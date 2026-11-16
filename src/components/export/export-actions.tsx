"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { downloadBlob, renderResultImage } from "@/lib/result-image";
import { buildResultSummary } from "@/lib/result-summary";
import { getData, useAppData } from "@/lib/store";
import { useIsClient } from "@/lib/use-is-client";

const FILENAME = "cui-grades-result.png";

/** "Save image" and "Print or PDF" buttons for the GPA and CGPA pages. */
export function ExportActions() {
  const isClient = useIsClient();
  const data = useAppData();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isClient) return null;
  const empty = data.courses.length === 0 && data.semesters.length === 0;

  async function saveImage() {
    setBusy(true);
    setError(null);
    try {
      const blob = await renderResultImage(buildResultSummary(getData()));
      const file = new File([blob], FILENAME, { type: "image/png" });
      // On phones, open the share sheet (WhatsApp etc.). On desktop, just download.
      const phone = window.matchMedia("(pointer: coarse)").matches;
      if (phone && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "My semester result" });
      } else {
        downloadBlob(blob, FILENAME);
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError("Couldn't create the image. Try Print or PDF instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={saveImage}
          disabled={empty || busy}
          className={buttonClass("secondary", "sm")}
        >
          {busy ? "Creating Image…" : "Save Image"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          disabled={empty}
          className={buttonClass("secondary", "sm")}
        >
          Print or PDF
        </button>
      </div>
      {error && <p className="text-xs text-err">{error}</p>}
    </div>
  );
}
