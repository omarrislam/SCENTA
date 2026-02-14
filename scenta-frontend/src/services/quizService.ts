import { fetchApi } from "./api";
import { listQuizQuestions as listMockQuiz } from "./mockApi";
import { QuizQuestion } from "./types";

const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

interface BackendQuizQuestion {
  _id?: string;
  id?: string;
  prompt: string;
  promptAr?: string;
  options: { label: string; labelAr?: string; score: number; note: string }[];
}

const mapQuizQuestion = (question: BackendQuizQuestion, index: number): QuizQuestion => ({
  id: question._id ?? question.id ?? `quiz-${index}`,
  prompt: question.prompt,
  promptAr: question.promptAr,
  options: question.options ?? []
});

export const listQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!hasApi) {
    return listMockQuiz();
  }
  try {
    const questions = await fetchApi<BackendQuizQuestion[]>("/quiz");
    if (!questions.length) {
      return listMockQuiz();
    }
    return questions.map(mapQuizQuestion);
  } catch {
    return listMockQuiz();
  }
};
