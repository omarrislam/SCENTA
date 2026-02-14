import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { listQuizQuestions } from "../../services/quizService";
import { listProducts } from "../../services/catalogService";
import Button from "../../components/ui/Button";
import { pickLocalized, resolveLocale } from "../../utils/localize";

type QuizAnswer = {
  score: number;
  note: string;
};

const QuizPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
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

  const recommendation = useMemo(() => {
    if (!products.length) return undefined;
    const noteScores = answers.reduce<Record<string, number>>((acc, answer) => {
      const note = answer.note?.trim().toLowerCase();
      if (!note) return acc;
      acc[note] = (acc[note] ?? 0) + answer.score;
      return acc;
    }, {});
    const sortedNotes = Object.entries(noteScores).sort((a, b) => b[1] - a[1]);
    const topNote = sortedNotes[0]?.[0];
    if (topNote) {
      const byNote = products.find((product) => {
        const fields = [...(product.tags ?? []), ...(product.notes ?? [])]
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean);
        return fields.includes(topNote);
      });
      if (byNote) return byNote;
    }
    return totalScore <= 2 ? products[1] ?? products[0] : totalScore <= 4 ? products[0] : products[2] ?? products[0];
  }, [answers, products, totalScore]);

  const recommendationName = recommendation ? pickLocalized(recommendation.name, recommendation.nameAr, locale) : t("brand");
  const recommendationDescription = recommendation
    ? pickLocalized(recommendation.description, recommendation.descriptionAr, locale)
    : t("quiz.reason");

  return (
    <div className="quiz-page">
      <div className="quiz-hero">
        <p className="siwa-eyebrow">{t("quiz.title")}</p>
        <h1 className="section-title">{t("quiz.title")}</h1>
        <p className="quiz-hero__subtitle">{t("quiz.subtitle")}</p>
      </div>
      <div className="card quiz-card">
        {current ? (
          <div className="quiz-step">
            <h2>{pickLocalized(current.prompt, current.promptAr, locale)}</h2>
            <div className="quiz-options">
              {current.options.map((option, index) => (
                <Button
                  key={`${option.label}-${index}`}
                  className="quiz-option"
                  type="button"
                  onClick={() => setAnswers((prev) => [...prev, { score: option.score, note: option.note }])}
                >
                  {pickLocalized(option.label, option.labelAr, locale)}
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
