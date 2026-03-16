import { Product } from "../../services/types";

type QuizAnswer = { score: number; note: string };

// Fragrance-specific quiz recommendation logic.
// Matches the highest-scoring note tag from answers against product tags/notes.
// To reuse this template for a different store type, replace this function
// with your own recommendation strategy.
export const getFragranceRecommendation = (
  answers: QuizAnswer[],
  products: Product[],
  totalScore: number
): Product | undefined => {
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
};
