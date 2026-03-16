import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { listQuizQuestions } from "../../services/quizService";
import { listProducts } from "../../services/catalogService";
import Button from "../../components/ui/Button";
import { getFragranceRecommendation } from "../../domain/fragrance/quizRecommendation";

type QuizAnswer = {
  score: number;
  note: string;
};

const QuizPage = () => {
  const { t } = useTranslation();
  const { data: questions = [] } = useQuery({
    queryKey: ["quiz"],
    queryFn: listQuizQuestions
  });
  const { data: productsData } = useQuery({
    queryKey: ["quiz-products"],
    queryFn: () => listProducts({ limit: 12 })
  });
  const products = productsData?.items ?? [];
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const current = questions[answers.length];
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);

  const recommendation = useMemo(
    () => getFragranceRecommendation(answers, products, totalScore),
    [answers, products, totalScore]
  );

  const recommendationName = recommendation?.name ?? t("brand");
  const recommendationDescription = recommendation?.description ?? t("quiz.reason");

  return (
    <div className="quiz-page">
      <div className="quiz-hero">
        <p className="eyebrow">{t("quiz.title")}</p>
        <h1 className="section-title">{t("quiz.title")}</h1>
        <p className="quiz-hero__subtitle">{t("quiz.subtitle")}</p>
      </div>
      <div className="card quiz-card">
        {current ? (
          <div className="quiz-step">
            <h2>{current.prompt}</h2>
            <div className="quiz-options">
              {current.options.map((option, index) => (
                <Button
                  key={`${option.label}-${index}`}
                  className="quiz-option"
                  type="button"
                  onClick={() => setAnswers((prev) => [...prev, { score: option.score, note: option.note }])}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="quiz-progress">
              {t("quiz.progress", { current: answers.length + 1, total: questions.length || 1 })}
            </p>
          </div>
        ) : (
          <div className="quiz-result">
            <h2>{t("quiz.recommendation", { name: recommendationName })}</h2>
            <p>{recommendationDescription}</p>
            <p className="quiz-result__hint">{t("quiz.reason")}</p>
            <Button className="quiz-retake" type="button" onClick={() => setAnswers([])}>
              {t("quiz.retake")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
