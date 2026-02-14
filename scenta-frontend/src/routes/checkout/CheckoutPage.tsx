import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { useCart } from "../../storefront/cart/CartContext";
import { useToast } from "../../components/feedback/ToastContext";
import PaymentOptions from "../../storefront/payments/PaymentOptions";
import { listPublicCoupons } from "../../services/couponService";
import { Coupon } from "../../services/types";
import {
  CheckoutItemPayload,
  createCodOrder,
  createStripeIntent,
  validateCheckout,
  ShippingAddressPayload
} from "../../services/orderService";
import { pickLocalized, resolveLocale } from "../../utils/localize";
import { getProduct } from "../../services/catalogService";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const StripePaymentForm = ({
  orderId,
  onSuccess
}: {
  orderId: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = async () => {
    if (!stripe || !elements) return;
    setIsConfirming(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`
        },
        redirect: "if_required"
      });

      if (result.error) {
        pushToast(result.error.message ?? t("checkout.orderFailed"), "error");
        return;
      }

      pushToast("Payment successful", "success");
      onSuccess();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("checkout.orderFailed"), "error");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="card grid">
      <strong>Card payment</strong>
      <PaymentElement />
      <Button type="button" className="button--primary" onClick={() => void confirm()} disabled={isConfirming}>
        {isConfirming ? "Confirming..." : "Confirm payment"}
      </Button>
    </div>
  );
};

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const { items, total } = useCart();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressPayload>({
    fullName: "",
    phone: "",
    city: "",
    area: "",
    street: "",
    building: "",
    notes: ""
  });
  const [isPlacing, setIsPlacing] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeOrderId, setStripeOrderId] = useState<string | null>(null);

  const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);
  const { data: coupons = [] } = useQuery({ queryKey: ["coupons"], queryFn: listPublicCoupons });

  const stepLabels = [
    t("checkout.steps.address"),
    t("checkout.steps.shipping"),
    t("checkout.steps.payment"),
    t("checkout.steps.review")
  ];

  const next = () => setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const match = coupons.find((coupon) => coupon.code.toUpperCase() === code && coupon.status === "active");
    if (!match) {
      setCouponError(t("checkout.couponInvalid"));
      setAppliedCoupon(null);
      return;
    }
    setCouponError("");
    setAppliedCoupon(match);
    pushToast(t("checkout.couponApplied"), "success");
  };

  const payloadItems = useMemo<CheckoutItemPayload[]>(
    () =>
      items.map((item) => ({
        productId: item.product.id,
        variantKey: item.variant.id,
        qty: item.quantity
      })),
    [items]
  );
  const isMongoId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

  const resolvePayloadItems = async () => {
    return Promise.all(
      items.map(async (item) => {
        if (isMongoId(item.product.id)) {
          return {
            productId: item.product.id,
            productSlug: item.product.slug,
            variantKey: item.variant.id,
            qty: item.quantity
          };
        }
        if (item.product.slug) {
          const product = await getProduct(item.product.slug);
          const variant =
            product.variants.find((entry) => entry.size === item.variant.size) ?? product.variants[0];
          return {
            productId: product.id,
            productSlug: product.slug,
            variantKey: variant.id,
            qty: item.quantity
          };
        }
        return {
          productId: item.product.id,
          productSlug: item.product.slug,
          variantKey: item.variant.id,
          qty: item.quantity
        };
      })
    );
  };

  const isAddressReady =
    shippingAddress.fullName &&
    shippingAddress.phone &&
    shippingAddress.city &&
    shippingAddress.area &&
    shippingAddress.street &&
    shippingAddress.building;

  const { data: checkoutTotals } = useQuery({
    queryKey: ["checkout", payloadItems, shippingAddress, appliedCoupon?.code],
    queryFn: async () => {
      const resolvedItems = await resolvePayloadItems();
      return validateCheckout(resolvedItems, shippingAddress, appliedCoupon?.code);
    },
    enabled: hasApi && step === 3 && Boolean(isAddressReady) && payloadItems.length > 0,
    retry: false
  });

  const localDiscount =
    appliedCoupon?.type === "percent" ? (total * appliedCoupon.value) / 100 : 0;
  const baseSummary = {
    subtotal: total,
    shippingFee: 60,
    discountTotal: localDiscount,
    grandTotal: Math.max(0, total - localDiscount) + 60,
    coupon: undefined as undefined | { code: string; type: string; value: number }
  };
  const summary = hasApi ? (checkoutTotals ?? baseSummary) : baseSummary;

  const placeOrder = async () => {
    if (!isAddressReady) {
      pushToast(t("checkout.addressMissing"), "error");
      return;
    }
    setIsPlacing(true);
    try {
      const resolvedItems = await resolvePayloadItems();
      if (payment === "stripe") {
        if (!stripePromise) {
          pushToast("Stripe is not configured. Missing VITE_STRIPE_PUBLISHABLE_KEY.", "error");
          return;
        }
        const intent = await createStripeIntent(resolvedItems, shippingAddress, appliedCoupon?.code);
        if (!intent.clientSecret) {
          pushToast("Failed to initialize Stripe payment.", "error");
          return;
        }
        setStripeClientSecret(intent.clientSecret);
        setStripeOrderId(intent.orderId);
        pushToast("Card form ready. Confirm payment below.", "success");
        return;
      }
      await createCodOrder(resolvedItems, shippingAddress, appliedCoupon?.code);
      pushToast(t("checkout.placeOrder"), "success");
      navigate("/order-confirmation");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("checkout.orderFailed"), "error");
    } finally {
      setIsPlacing(false);
    }
  };

  const stripeOptions = useMemo(
    () => ({
      clientSecret: stripeClientSecret ?? "",
      appearance: { theme: "stripe" as const }
    }),
    [stripeClientSecret]
  );

  return (
    <div>
      <h1 className="section-title">{t("checkout.title")}</h1>
      <div className="card">
        {!items.length ? (
          <p>{t("checkout.empty")}</p>
        ) : (
          <>
            <p>{t("checkout.stepLabel", { current: step + 1, total: stepLabels.length, label: stepLabels[step] })}</p>
            {step === 0 && (
              <div className="checkout-form">
                <TextInput
                  placeholder={t("checkout.fullName")}
                  value={shippingAddress.fullName}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
                <TextInput
                  placeholder={t("checkout.phone")}
                  value={shippingAddress.phone}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
                <TextInput
                  placeholder={t("checkout.city")}
                  value={shippingAddress.city}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, city: event.target.value }))
                  }
                />
                <TextInput
                  placeholder={t("checkout.area")}
                  value={shippingAddress.area}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, area: event.target.value }))
                  }
                />
                <TextInput
                  placeholder={t("checkout.street")}
                  value={shippingAddress.street}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, street: event.target.value }))
                  }
                />
                <TextInput
                  placeholder={t("checkout.building")}
                  value={shippingAddress.building}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, building: event.target.value }))
                  }
                />
                <textarea
                  className="input checkout-notes"
                  placeholder={t("checkout.notes")}
                  value={shippingAddress.notes}
                  onChange={(event) =>
                    setShippingAddress((prev) => ({ ...prev, notes: event.target.value }))
                  }
                />
              </div>
            )}
            {step === 1 && (
              <div className="checkout-form">
                <Select>
                  <option>{t("checkout.shippingStandard")}</option>
                  <option>{t("checkout.shippingExpress")}</option>
                </Select>
              </div>
            )}
            {step === 2 && (
              <div className="checkout-form">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={(event) => {
                      setPayment(event.target.value);
                      setStripeClientSecret(null);
                      setStripeOrderId(null);
                    }}
                  />
                  {t("checkout.paymentCod")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={payment === "stripe"}
                    onChange={(event) => {
                      setPayment(event.target.value);
                      setStripeClientSecret(null);
                      setStripeOrderId(null);
                    }}
                  />
                  {t("checkout.paymentCard")}
                </label>
                <PaymentOptions />
              </div>
            )}
            {step === 3 && (
              <div className="grid">
                <div className="checkout-grid">
                  <div className="card checkout-items">
                    <strong>{t("cart.title")}</strong>
                    <div className="receipt-items">
                      {items.map((item) => (
                        <div key={item.id} className="receipt-row">
                          <span>
                            {pickLocalized(item.product.name, item.product.nameAr, locale)} - {item.variant.size} x {item.quantity}
                          </span>
                          <span>EGP {(item.variant.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="receipt-divider" />
                    <div className="receipt-row">
                      <span>{t("checkout.couponLabel")}</span>
                      <div className="receipt-coupon">
                        <TextInput
                          placeholder={t("checkout.couponPlaceholder")}
                          value={couponCode}
                          onChange={(event) => setCouponCode(event.target.value)}
                        />
                        <Button type="button" onClick={applyCoupon}>
                          {t("checkout.applyCoupon")}
                        </Button>
                      </div>
                    </div>
                    {couponError && <p>{couponError}</p>}
                  </div>
                  <div className="card checkout-receipt">
                    <strong>{t("checkout.reviewTotal")}</strong>
                    <div className="receipt-row">
                      <span>Subtotal</span>
                      <span>EGP {summary.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="receipt-row">
                      <span>Shipping</span>
                      <span>EGP {summary.shippingFee.toLocaleString()}</span>
                    </div>
                    {summary.discountTotal ? (
                      <div className="receipt-row receipt-row--discount">
                        <span>{t("checkout.discount")}</span>
                        <span>- EGP {summary.discountTotal.toLocaleString()}</span>
                      </div>
                    ) : null}
                    <div className="receipt-divider" />
                    <div className="receipt-row receipt-total">
                      <span>{t("checkout.finalTotal")}</span>
                      <span>EGP {summary.grandTotal.toLocaleString()}</span>
                    </div>
                    {summary.coupon?.code && <p>Coupon: {summary.coupon.code}</p>}
                  </div>
                </div>
                {payment === "stripe" && stripePromise && stripeClientSecret && stripeOrderId ? (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripePaymentForm orderId={stripeOrderId} onSuccess={() => navigate("/order-confirmation")} />
                  </Elements>
                ) : null}
              </div>
            )}
            <div className="checkout-actions">
              <Button type="button" onClick={back} disabled={step === 0 || isPlacing}>
                {t("checkout.back")}
              </Button>
              {step < stepLabels.length - 1 ? (
                <Button type="button" className="button--primary" onClick={next}>
                  {t("checkout.continue")}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="button--primary"
                  onClick={() => void placeOrder()}
                  disabled={isPlacing || (payment === "stripe" && Boolean(stripeClientSecret))}
                >
                  {isPlacing
                    ? t("checkout.placing")
                    : payment === "stripe" && !stripeClientSecret
                      ? "Continue to card"
                      : t("checkout.placeOrder")}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
