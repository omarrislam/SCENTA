import { useMemo } from "react";

const slugifyNote = (note: string) =>
  note
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const NoteBadges = ({ notes, labels }: { notes: string[]; labels?: string[] }) => {
  const items = useMemo(
    () =>
      notes.map((note, index) => ({
        note,
        label: labels?.[index] ?? note,
        icon: `/icons/notes/${slugifyNote(note)}.svg`
      })),
    [notes, labels]
  );

  return (
    <div className="note-badges">
      {items.map((item) => (
        <div key={`${item.note}-${item.label}`} className="note-badge">
          <img
            src={item.icon}
            alt={item.label}
            className="note-badge__icon"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const target = event.currentTarget;
              target.onerror = null;
              target.src = "/icons/notes/default.svg";
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default NoteBadges;

