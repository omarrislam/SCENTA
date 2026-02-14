import { useTranslation } from "react-i18next";

interface StockIndicatorProps {
  stock: number;
}

const StockIndicator = ({ stock }: StockIndicatorProps) => {
  const { t } = useTranslation();
  const isLow = stock < 3;
  const isOut = stock <= 0;
  const status = isOut ? "out" : isLow ? "low" : "ok";
  const label = isOut
    ? t("stock.out")
    : isLow
      ? t("stock.low", { count: stock })
      : t("stock.ok", { count: stock });

  return (
    <div className={`stock-indicator stock-indicator--${status}`}>
      <span className="stock-indicator__dot" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default StockIndicator;
