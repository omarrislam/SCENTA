const Spinner = ({
  size = 32,
  label = "Loading",
  centered = true
}: {
  size?: number;
  label?: string;
  centered?: boolean;
}) => (
  <div className={`spinner ${centered ? "spinner--centered" : ""}`.trim()} role="status" aria-live="polite" aria-label={label}>
    <div className="spinner__ring" style={{ width: size, height: size }} />
  </div>
);

export default Spinner;
