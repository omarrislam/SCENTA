import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { listAdminQuiz, updateAdminQuiz } from "../../services/backendApi";
import { QuizQuestion } from "../../services/types";
import { useToast } from "../../components/feedback/ToastContext";

const emptyOption = { label: "", labelAr: "", score: 1, note: "" };

const AdminQuiz = () => {
  const { pushToast } = useToast();
  const { data = [] } = useQuery({ queryKey: ["admin-quiz"], queryFn: listAdminQuiz });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const lastSerialized = useRef("");

  useEffect(() => {
    const nextSerialized = JSON.stringify(data);
    if (nextSerialized && nextSerialized !== lastSerialized.current) {
      lastSerialized.current = nextSerialized;
      setQuestions(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: QuizQuestion[]) => updateAdminQuiz(payload),
    onSuccess: () => {
      pushToast("Quiz updated", "success");
    }
  });

  const updateQuestion = (index: number, next: Partial<QuizQuestion>) => {
    setQuestions((prev) => prev.map((question, idx) => (idx === index ? { ...question, ...next } : question)));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    next: Partial<QuizQuestion["options"][number]>
  ) => {
    setQuestions((prev) =>
      prev.map((question, idx) => {
        if (idx !== questionIndex) return question;
        const options = question.options.map((option, optIdx) =>
          optIdx === optionIndex ? { ...option, ...next } : option
        );
        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: `quiz-${Date.now()}`, prompt: "", promptAr: "", options: [emptyOption] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === questionIndex ? { ...question, options: [...question.options, { ...emptyOption }] } : question
      )
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, idx) => {
        if (idx !== questionIndex) return question;
        const options = question.options.filter((_, optIdx) => optIdx !== optionIndex);
        return { ...question, options: options.length ? options : [{ ...emptyOption }] };
      })
    );
  };

  return (
    <div className="admin-grid">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <h1 className="section-title">Quiz Builder</h1>
        <Button className="button--primary" type="button" onClick={() => mutation.mutate(questions)}>
          Save Quiz
        </Button>
      </div>
      <div className="card">
        <p style={{ margin: 0, color: "var(--color-muted)" }}>
          In each option: <strong>Score</strong> controls weight for recommendation matching, and{" "}
          <strong>Note tag</strong> is the scent family/note used in the final suggestion (example: oud, rose, citrus).
        </p>
        <p style={{ margin: "8px 0 0", color: "var(--color-muted)" }}>
          Result setup: set each option's <strong>Note tag</strong> to match product tags/notes in catalog. The quiz result picks the
          highest scoring note tag and recommends a product with that tag.
        </p>
      </div>
      <div className="grid">
        {questions.map((question, index) => (
          <div key={question.id ?? index} className="card grid" style={{ gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <strong>Question {index + 1}</strong>
              <Button type="button" onClick={() => removeQuestion(index)}>
                Remove
              </Button>
            </div>
            <label className="input-label">
              Prompt (EN)
              <TextInput
                value={question.prompt}
                onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
              />
            </label>
            <label className="input-label">
              Prompt (AR)
              <TextInput
                value={question.promptAr ?? ""}
                onChange={(event) => updateQuestion(index, { promptAr: event.target.value })}
              />
            </label>
            <div className="grid" style={{ gap: "12px" }}>
              <strong>Options</strong>
              {question.options.map((option, optionIndex) => (
                <div key={`${question.id}-${optionIndex}`} className="grid card" style={{ gap: "10px", padding: "14px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <TextInput
                      placeholder="Answer label (EN)"
                      value={option.label}
                      onChange={(event) => updateOption(index, optionIndex, { label: event.target.value })}
                    />
                    <TextInput
                      placeholder="Answer label (AR)"
                      value={option.labelAr ?? ""}
                      onChange={(event) => updateOption(index, optionIndex, { labelAr: event.target.value })}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <TextInput
                      type="number"
                      placeholder="Score weight"
                      value={String(option.score)}
                      onChange={(event) => updateOption(index, optionIndex, { score: Number(event.target.value) })}
                    />
                    <TextInput
                      placeholder="Note tag (e.g. oud)"
                      value={option.note}
                      onChange={(event) => updateOption(index, optionIndex, { note: event.target.value })}
                    />
                    <Button type="button" onClick={() => removeOption(index, optionIndex)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => addOption(index)}>
                Add option
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" onClick={addQuestion}>
        Add question
      </Button>
    </div>
  );
};

export default AdminQuiz;
