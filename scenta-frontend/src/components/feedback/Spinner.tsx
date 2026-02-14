const Spinner = ({ size = 32, label = "Loading" }: { size?: number; label?: string }) => (
  <div className="spinner" role="status" aria-live="polite" aria-label={label}>
    <div className="spinner__ring" style={{ width: size, height: size }} />
  </div>
);

export default Spinner;
