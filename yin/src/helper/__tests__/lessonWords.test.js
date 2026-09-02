import filterLessonWords from "../lessonWords";

describe("filterLessonWords", () => {
  it("keeps legacy lesson words when no language tag exists", () => {
    const lesson = {
      language: undefined,
      words: [{ character: "妈" }, { character: "马" }],
    };

    expect(filterLessonWords(lesson, "mandarin")).toEqual(lesson.words);
  });

  it("keeps words when the lesson language is missing but the user language is set", () => {
    const lesson = {
      words: [{ character: "妈" }, { character: "马" }],
    };

    expect(filterLessonWords(lesson, "cantonese")).toEqual(lesson.words);
  });

  it("keeps all words when no active language is set", () => {
    const lesson = {
      language: "mandarin",
      words: [{ character: "妈", language: "mandarin" }, { character: "啊", language: "cantonese" }],
    };

    expect(filterLessonWords(lesson, "")).toEqual(lesson.words);
  });
});
