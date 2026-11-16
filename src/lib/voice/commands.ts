/** Example voice commands, shown in the voice help dialog and on the Guide page. */
export const VOICE_COMMAND_GROUPS: { title: string; items: [say: string, does: string][] }[] = [
  {
    title: "Subjects",
    items: [
      ["new subject database systems", "Adds a subject with 3 theory credits"],
      ["credits 3 plus 1", "Sets theory and lab credit hours"],
      ["switch to operating systems", "Opens another subject"],
      ["next subject / previous subject", "Moves between subjects"],
    ],
  },
  {
    title: "Marks",
    items: [
      ["quiz 8", "Fills the next empty quiz, out of its usual total"],
      ["quiz 8 out of 15", "Same, and changes the total"],
      ["quiz 3 is 7", "Sets quiz number 3"],
      ["quizzes 8 7 9 6", "Fills all quizzes at once"],
      ["assignment 9 out of 10", "Also works as: lab assignment 9"],
      ["midterm 20 out of 25", "Also works as: lab midterm 18"],
      ["final 41", "Also works as: lab final 44"],
    ],
  },
  {
    title: "GPA and CGPA",
    items: [
      ["grade b plus", "Uses B+ for this subject on the GPA page"],
      ["grade from marks", "Goes back to the grade from marks"],
      ["semester 3.45 with 18 credits", "Adds a past semester to the CGPA page"],
    ],
  },
  {
    title: "Other",
    items: [
      ["go to gpa / cgpa / internal marks / guide", "Opens a page"],
      ["undo", "Reverses the last voice command"],
      ["stop", "Stops listening"],
    ],
  },
];
