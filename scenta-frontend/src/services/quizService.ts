import { fetchApi } from "./api";
import { QuizQuestion } from "./types";

interface BackendQuizQuestion {
  _id?: string;
  id?: string;
  prompt: string;
  options: { label: string; score: number; note: string }[];
}

const mapQuestion = (q: BackendQuizQuestion, index: number): QuizQuestion => ({
  id: q._id ?? q.id ?? `quiz-${index}`,
  prompt: q.prompt,
  options: q.options ?? []
});

export const listQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const locale =
    typeof document !== "undefined" && document.documentElement.lang?.startsWith("ar") ? "ar" : "en";
  const questions = await fetchApi<BackendQuizQuestion[]>(`/quiz?locale=${locale}`);
  return questions.map(mapQuestion);
};
