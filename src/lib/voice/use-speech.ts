import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Minimal types for the Web Speech API. TypeScript's DOM types don't include it,
 * and Chrome/Edge/Safari still expose it as webkitSpeechRecognition.
 */
type RecognitionAlternative = { transcript: string };
type RecognitionResult = { isFinal: boolean; 0: RecognitionAlternative };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionConstructor = new () => Recognition;

function getRecognition(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechSupported(): boolean {
  return getRecognition() !== null;
}

type Handlers = {
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
  onError: (code: string) => void;
};

/**
 * start(true) keeps listening until stop() (Chrome ends sessions after silence, so it restarts).
 * start(false) is for push-to-talk: it listens until stop() and still delivers the last words.
 */
export function useSpeechRecognition(lang: string, handlers: Handlers) {
  const handlersRef = useRef(handlers);
  const recognitionRef = useRef<Recognition | null>(null);
  const keepAliveRef = useRef(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  const stop = useCallback(() => {
    keepAliveRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      // Already stopped.
    }
    setListening(false);
  }, []);

  const start = useCallback(
    (continuous: boolean) => {
      const Recognition = getRecognition();
      if (!Recognition) {
        handlersRef.current.onError("unsupported");
        return;
      }
      recognitionRef.current?.abort();

      const rec = new Recognition();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const result = e.results[i];
          const text = result[0].transcript.trim();
          if (!text) continue;
          if (result.isFinal) handlersRef.current.onFinal(text);
          else handlersRef.current.onInterim(text);
        }
      };

      rec.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        keepAliveRef.current = false;
        setListening(false);
        handlersRef.current.onError(e.error);
      };

      rec.onend = () => {
        if (recognitionRef.current !== rec) return;
        if (keepAliveRef.current) {
          try {
            rec.start();
            return;
          } catch {
            // Fall through and stop.
          }
        }
        recognitionRef.current = null;
        setListening(false);
      };

      keepAliveRef.current = continuous;
      recognitionRef.current = rec;
      try {
        rec.start();
        setListening(true);
      } catch {
        recognitionRef.current = null;
        handlersRef.current.onError("start-failed");
      }
    },
    [lang],
  );

  useEffect(
    () => () => {
      keepAliveRef.current = false;
      recognitionRef.current?.abort();
    },
    [],
  );

  return { listening, start, stop };
}

export function speechErrorMessage(code: string): string {
  switch (code) {
    case "unsupported":
      return "Voice input needs Chrome, Edge or Safari. You can still type commands below.";
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access is blocked. Allow it from the address bar, then try again.";
    case "audio-capture":
      return "No microphone was found.";
    case "network":
      return "The speech service couldn't be reached. Check your internet connection.";
    case "language-not-supported":
      return "This language isn't supported here. Pick another one in voice settings.";
    default:
      return "Voice input stopped. Tap the mic to try again.";
  }
}
