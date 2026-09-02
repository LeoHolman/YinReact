export default function filterLessonWords(lesson, activeLang) {
  if (!lesson || !Array.isArray(lesson.words)) {
    return [];
  }

  const lessonLanguage =
    typeof lesson.language === "string" ? lesson.language : "";
  const normalizedActiveLang =
    typeof activeLang === "string" ? activeLang.trim().toLowerCase() : "";
  const hasExplicitLessonLanguage = lessonLanguage.trim() !== "";

  if (!normalizedActiveLang) {
    return lesson.words;
  }

  if (!hasExplicitLessonLanguage) {
    return lesson.words;
  }

  const normalizedLessonLang = lessonLanguage.trim().toLowerCase();

  if (normalizedLessonLang === normalizedActiveLang) {
    return lesson.words;
  }

  return lesson.words.filter((word) => {
    const wordLanguage =
      word && typeof word.language === "string" ? word.language : "";
    const normalizedWordLanguage = wordLanguage.trim().toLowerCase();
    return (
      normalizedWordLanguage === normalizedActiveLang ||
      normalizedWordLanguage === ""
    );
  });
}
