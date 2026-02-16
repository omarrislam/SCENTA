import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { listCollections, listProducts } from "../../services/catalogService";
import { resolveApiAssetUrl, resolveResponsiveImageSource } from "../../services/api";
import { themeSections } from "../../services/mockData";
import ProductCard from "../../components/product/ProductCard";
import { useCart } from "../../storefront/cart/CartContext";
import useMeta from "../../app/seo/useMeta";
import { useToast } from "../../components/feedback/ToastContext";
import { useTheme } from "../../theme/ThemeProvider";
import Spinner from "../../components/feedback/Spinner";
import { pickLocalized, resolveLocale } from "../../utils/localize";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  useMeta("SCENTA | Signature Fragrance");
  const { addItem } = useCart();
  const { pushToast } = useToast();
  const { theme, isLoading: isThemeLoading } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["products", "home"],
    queryFn: () => listProducts({ limit: 12 }),
    staleTime: 1000 * 60
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => listCollections(),
    staleTime: 1000 * 60
  });
  const products = data?.items ?? [];
  const bestSellers = products.filter((item) => item.flags.bestSeller);
  const newArrivals = products.filter((item) => item.flags.new);
  const sections = theme?.homeSections?.length ? theme.homeSections : themeSections;
  const sectionSettings = theme?.home?.sectionSettings ?? {};

  const getSectionSetting = (id: string) => sectionSettings[id] ?? {};

  const fallbackSlides = useMemo(
    () => [
      {
        title: "Where scent meets soul",
        subtitle: "Contemporary fragrance rituals crafted with luminous oils and soft woods.",
        image: "/images/amber-1.svg",
        primary: { label: "Shop now", to: "/collections/amber-signature" },
        secondary: { label: "View collection", to: "/shop" }
      },
      {
        title: "New in: airy florals",
        subtitle: "Fresh petals and clean musk for day-to-night layering.",
        image: "/images/rose-1.svg",
        primary: { label: "Shop now", to: "/shop?tag=fresh" },
        secondary: { label: "View collection", to: "/shop" }
      },
      {
        title: "Signature warm woods",
        subtitle: "Silky amber, velvety iris, and a glowing night trail.",
        image: "/images/iris-1.svg",
        primary: { label: "Shop now", to: "/shop?tag=warm" },
        secondary: { label: "View collection", to: "/shop" }
      }
    ],
    []
  );

  const heroSlides = useMemo(() => {
    if (theme?.home?.heroSlides?.length) {
      return theme.home.heroSlides.map((slide) => ({
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.image,
        primary: { label: slide.primaryLabel, to: slide.primaryLink },
        secondary: { label: slide.secondaryLabel, to: slide.secondaryLink }
      }));
    }
    return fallbackSlides;
  }, [fallbackSlides, theme?.home?.heroSlides]);

  useEffect(() => {
    const first = heroSlides[0]?.image;
    const href = resolveApiAssetUrl(first) ?? first;
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [heroSlides]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const autoplayMs = theme?.home?.heroAutoplayMs ?? 6000;
    const handle = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, Math.max(2000, autoplayMs));
    return () => window.clearInterval(handle);
  }, [heroSlides.length, isPaused, theme?.home?.heroAutoplayMs]);

  useEffect(() => {
    setIsAnimating(true);
    const handle = window.setTimeout(() => setIsAnimating(false), 360);
    return () => window.clearTimeout(handle);
  }, [activeSlide]);

  const isWarm = (item: (typeof products)[number]) =>
    item.tags.some((tag) => ["warm", "bold", "night", "evening"].includes(tag));
  const isFresh = (item: (typeof products)[number]) =>
    item.tags.some((tag) => ["fresh", "day"].includes(tag));

  const genderTabs = [
    { key: "women", label: "Women", filter: (item: typeof products[number]) => isFresh(item) },
    { key: "men", label: "Men", filter: (item: typeof products[number]) => isWarm(item) }
  ];

  const [activeBestTab, setActiveBestTab] = useState(genderTabs[0]?.key ?? "women");
  const [activeNewTab, setActiveNewTab] = useState(genderTabs[0]?.key ?? "women");

  const bestSellerProducts = useMemo(() => {
    const base = bestSellers.length ? bestSellers : products;
    const active = genderTabs.find((tab) => tab.key === activeBestTab) ?? genderTabs[0];
    const filtered = base.filter(active?.filter ?? (() => true));
    return (filtered.length ? filtered : base).slice(0, 6);
  }, [activeBestTab, bestSellers, genderTabs, products]);

  const newInProducts = useMemo(() => {
    const base = newArrivals.length ? newArrivals : products;
    const active = genderTabs.find((tab) => tab.key === activeNewTab) ?? genderTabs[0];
    const filtered = base.filter(active?.filter ?? (() => true));
    return (filtered.length ? filtered : base).slice(0, 6);
  }, [activeNewTab, genderTabs, newArrivals, products]);

  const slide = heroSlides[activeSlide] ?? heroSlides[0];
  const slideImageSource = resolveResponsiveImageSource(slide.image);
  const slideImage = slideImageSource?.src ?? (resolveApiAssetUrl(slide.image) ?? slide.image);
  const shippingItems =
    theme?.home?.shippingItems?.length
      ? theme.home.shippingItems
      : [
          { title: "14 days return", body: "Refund or exchange within two weeks of delivery.", icon: "gift" as const },
          { title: "Support 24/7", body: "Our fragrance advisors are available day and night.", icon: "truck" as const },
          { title: "Payment protection", body: "Secure checkout with encrypted payment data.", icon: "cash" as const }
        ];
  const heroAlignment = theme?.home?.heroAlignment ?? "left";
  const heroPauseOnHover = theme?.home?.heroPauseOnHover ?? true;
  const collectionsSetting = getSectionSetting("collections");
  const bestSetting = getSectionSetting("bestsellers");
  const quizSetting = getSectionSetting("quiz");
  const editorialSetting = getSectionSetting("editorial");
  const newsletterSetting = getSectionSetting("newsletter");
  const collectionsCtaLabel = collectionsSetting.ctaLabel ?? "View collection";
  const collectionsCtaLink = collectionsSetting.ctaLink ?? "/shop";
  const heroLabel = getSectionSetting("hero").title ?? "Welcome to our store";
  const offerImage = resolveApiAssetUrl("/images/iris-1.svg") ?? "/images/iris-1.svg";
  const offerImageSource = resolveResponsiveImageSource(offerImage);
  const editorialImage = resolveApiAssetUrl(editorialSetting.backgroundImage ?? "/images/amber-1.svg")
    ?? editorialSetting.backgroundImage
    ?? "/images/amber-1.svg";
  const editorialImageSource = resolveResponsiveImageSource(editorialImage);
  const signatureFeatures = [
    {
      title: "Original creations",
      body: "Small-batch compositions with modern, luminous notes.",
      link: { label: "Try now", to: "/shop" }
    },
    {
      title: "Luxury oils",
      body: "High-quality concentrates blended for lasting trails.",
      link: { label: "Discover", to: "/collections/amber-signature" }
    },
    {
      title: "Uncover hidden gems",
      body: "Explore our curated drops and limited bundles.",
      link: { label: "Shop now", to: "/shop" }
    }
  ];
  const collectionFallbackImage = (slug: string) => {
    const fallbackBySlug: Record<string, string> = {
      "amber-signature": "/images/silk-amber.png",
      "floral-veil": "/images/rose-veil.png"
    };
    return fallbackBySlug[slug] ?? "/images/amber-1.svg";
  };
  const resolveCollectionCardImage = (slug: string, image?: string) => {
    const resolved = resolveApiAssetUrl(image) ?? image;
    if (!resolved || /\/uploads\//.test(resolved)) {
      const fallback = collectionFallbackImage(slug);
      return resolveApiAssetUrl(fallback) ?? fallback;
    }
    return resolved;
  };

  const handleQuickAdd = (item: (typeof products)[number]) => {
    const variant = item.variants[0];
    if ((variant?.stock ?? 0) <= 0) {
      pushToast(t("stock.out"), "error");
      return;
    }
    addItem(item, variant);
    pushToast(t("cta.addedCart"), "success");
  };

  if (isLoading || isThemeLoading) {
    return <Spinner />;
  }

  return (
    <div className="home-page">
      <div className="home-stack">
      {sections
        .filter((section) => section.isVisible)
        .map((section) => {
          if (section.id === "hero") {
            return (
              <section key={section.id} className="section-block section-block--hero" data-reveal>
                <div
                  className={`hero hero--slider hero--${heroAlignment} ${isAnimating ? "is-animating" : ""}`.trim()}
                  onMouseEnter={() => heroPauseOnHover && setIsPaused(true)}
                  onMouseLeave={() => heroPauseOnHover && setIsPaused(false)}
                >
                  <div className="hero__content" key={slide.title}>
                    <p className="hero__eyebrow">{heroLabel}</p>
                    <h1 className="hero__title">{slide.title}</h1>
                    <p className="hero__subtitle">{slide.subtitle}</p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Link className="button button--primary" to={slide.primary.to}>
                        {slide.primary.label}
                      </Link>
                      <Link className="button button--outline" to={slide.secondary.to}>
                        {slide.secondary.label}
                      </Link>
                    </div>
                    <div className="hero__dots">
                      {heroSlides.map((item, index) => (
                        <button
                          key={item.title}
                          className={`hero__dot ${index === activeSlide ? "is-active" : ""}`.trim()}
                          type="button"
                          onClick={() => setActiveSlide(index)}
                          aria-label={t("hero.slideLabel", { index: index + 1 })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="hero__media" aria-hidden="true">
                    <img
                      key={slideImage}
                      className="hero__media-image"
                      src={slideImage}
                      srcSet={slideImageSource?.srcSet}
                      alt=""
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div className="hero__notes">
                  <p className="section-title" style={{ fontSize: "1.2rem" }}>
                    {getSectionSetting("notes").title ?? t("hero.notesTitle")}
                  </p>
                  <div className="grid grid--3">
                    {["Amber", "Rose", "Musk"].map((note) => (
                      <div key={note} className="card" style={{ padding: "16px" }} data-reveal>
                        <strong>{note}</strong>
                        <p className="hero__subtitle">{t("hero.notesSubtitle")}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {collections.length > 0 && (
                  <section
                    className="collection-strip section-block section-block--divider"
                    data-reveal
                    style={
                      collectionsSetting.backgroundImage
                        ? {
                            backgroundImage: `url(${resolveApiAssetUrl(collectionsSetting.backgroundImage) ?? collectionsSetting.backgroundImage})`
                          }
                        : undefined
                    }
                  >
                    <div className="collection-strip__header">
                      <div>
                        <h2 className="section-title">{collectionsSetting.title ?? "Our collections"}</h2>
                        {collectionsSetting.subtitle && <p>{collectionsSetting.subtitle}</p>}
                      </div>
                      {collectionsCtaLabel && (
                        <Link className="button button--outline" to={collectionsCtaLink}>
                          {collectionsCtaLabel}
                        </Link>
                      )}
                    </div>
                    <div className={collectionsSetting.layout === "carousel" ? "collection-carousel" : "collection-grid"}>
                      {(theme?.home?.collectionItems?.length
                        ? theme.home.collectionItems
                        : collections.map((collection) => ({
                            slug: collection.slug,
                            title: collection.title,
                            description: collection.description,
                            image: collection.image,
                            enabled: true
                          }))
                      )
                        .filter((item) => item.enabled !== false)
                        .slice(0, collectionsSetting.maxItems ?? collections.length)
                        .map((item) => {
                          const collection = collections.find((entry) => entry.slug === item.slug);
                          if (!collection) return null;
                          const title = pickLocalized(collection.title, collection.titleAr, locale);
                          const resolvedTitle = item.title ?? title;
                          const cardImage = resolveCollectionCardImage(collection.slug, item.image ?? collection.image);
                          const cardImageSource = resolveResponsiveImageSource(cardImage);
                          return (
                          <Link key={collection.id} className="collection-card" to={`/collections/${collection.slug}`}>
                            <div className="collection-card__media">
                              <img
                                className="collection-card__image"
                                src={cardImageSource?.src ?? cardImage}
                                srcSet={cardImageSource?.srcSet}
                                alt={resolvedTitle}
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                              />
                            </div>
                            <div className="collection-card__overlay">
                              <span className="button button--outline collection-card__cta">{resolvedTitle}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}
                <section
                  className="shipping-strip card section-block section-block--divider"
                  data-reveal
                  style={
                    getSectionSetting("shipping").backgroundImage
                      ? {
                          backgroundImage: `url(${resolveApiAssetUrl(getSectionSetting("shipping").backgroundImage) ?? getSectionSetting("shipping").backgroundImage})`
                        }
                      : undefined
                  }
                >
                  {shippingItems
                    .filter((item) => item.enabled !== false)
                    .slice(0, getSectionSetting("shipping").maxItems ?? shippingItems.length)
                    .map((item) => (
                    <div key={item.title} className="shipping-item">
                      <span className="shipping-item__icon" aria-hidden="true">
                        {item.icon === "truck" && (
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M3 6h11v9H3V6Zm12 4h3.2l2.8 3.5V15h-6v-5Zm-9.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                        {item.icon === "cash" && (
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M4 7h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm2 2a2 2 0 0 1-2 2v2a2 2 0 0 1 2 2h12a2 2 0 0 1 2-2v-2a2 2 0 0 1-2-2H6Zm6 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                        {item.icon === "gift" && (
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M3 10h18v4H3v-4Zm2 5h6v6H5v-6Zm8 0h6v6h-6v-6ZM9 6a2 2 0 0 1 4 0v1H9V6Zm-2 1V6a4 4 0 0 1 8 0v1h5v3H4V7h3Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </div>
                    </div>
                  ))}
                </section>
                <section className="editorial-banner" data-reveal>
                  <img
                    className="editorial-banner__image"
                    src={editorialImageSource?.src ?? editorialImage}
                    srcSet={editorialImageSource?.srcSet}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    sizes="100vw"
                  />
                  <div className="editorial-banner__content">
                    <p className="editorial-banner__eyebrow">{t("home.editorialEyebrow")}</p>
                    <h2 className="section-title">{editorialSetting.title ?? t("home.editorialTitle")}</h2>
                    <p>{editorialSetting.subtitle ?? t("home.editorialBody")}</p>
                    {editorialSetting.ctaLabel && editorialSetting.ctaLink ? (
                      <Link className="button button--primary" to={editorialSetting.ctaLink}>
                        {editorialSetting.ctaLabel}
                      </Link>
                    ) : (
                      <Link className="button button--primary" to="/shop">
                        {t("home.editorialCta")}
                      </Link>
                    )}
                  </div>
                </section>
              </section>
            );
          }
          if (section.id === "bestsellers") {
            return (
              <section
                key={section.id}
                className="section-block section-block--accent"
                data-reveal
                style={
                  bestSetting.backgroundImage
                    ? { backgroundImage: `url(${resolveApiAssetUrl(bestSetting.backgroundImage) ?? bestSetting.backgroundImage})` }
                    : undefined
                }
              >
                <div className="siwa-section-header">
                  <div>
                    <p className="siwa-eyebrow">Our best sellers</p>
                    <h2 className="section-title">{bestSetting.title ?? "Our best sellers"}</h2>
                    {bestSetting.subtitle && <p className="siwa-section-header__meta">{bestSetting.subtitle}</p>}
                  </div>
                  <Link className="button button--outline" to="/shop">
                    View collection
                  </Link>
                </div>
                <div className="tabs">
                  {genderTabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`tab ${tab.key === activeBestTab ? "is-active" : ""}`.trim()}
                      type="button"
                      onClick={() => setActiveBestTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className={bestSetting.layout === "grid" ? "product-grid" : "product-carousel"}>
                  {bestSellerProducts
                    .slice(0, bestSetting.maxItems ?? 6)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickAdd={handleQuickAdd}
                        showStockIndicator={false}
                      />
                    ))}
                </div>
              </section>
            );
          }
          if (section.id === "newin") {
            return (
              <section key={section.id} className="section-block" data-reveal>
                <div className="siwa-section-header">
                  <div>
                    <p className="siwa-eyebrow">New in</p>
                    <h2 className="section-title">New in</h2>
                    <p className="siwa-section-header__meta">
                      Fresh arrivals curated for luminous layering.
                    </p>
                  </div>
                  <Link className="button button--outline" to="/shop?sort=new">
                    View collection
                  </Link>
                </div>
                <div className="tabs">
                  {genderTabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`tab ${tab.key === activeNewTab ? "is-active" : ""}`.trim()}
                      type="button"
                      onClick={() => setActiveNewTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="product-grid">
                  {newInProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickAdd={handleQuickAdd} />
                  ))}
                </div>
              </section>
            );
          }
          if (section.id === "offers") {
            return (
              <section key={section.id} className="section-block" data-reveal>
                <div className="siwa-offer">
                  <div>
                    <p className="siwa-eyebrow">Offers &amp; discounts</p>
                    <h2 className="section-title">Our bundles</h2>
                    <p className="siwa-section-header__meta">
                      Discover layered sets and limited drops curated for gifting and ritual.
                    </p>
                    <Link className="button button--primary" to="/shop">
                      Shop now
                    </Link>
                  </div>
                  <div
                    className="siwa-offer__media"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <img
                      className="siwa-offer__image"
                      src={offerImageSource?.src ?? offerImage}
                      srcSet={offerImageSource?.srcSet}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  </div>
                </div>
              </section>
            );
          }
          if (section.id === "signature") {
            return (
              <section key={section.id} className="section-block" data-reveal>
                <div className="siwa-section-header">
                  <div>
                    <p className="siwa-eyebrow">Signature luxury</p>
                    <h2 className="section-title">Signature luxury</h2>
                  </div>
                  <p className="siwa-section-header__meta">
                    Uncover hidden gems crafted for a modern fragrance wardrobe.
                  </p>
                </div>
                <div className="siwa-feature-grid">
                  {signatureFeatures.map((feature) => (
                    <div key={feature.title} className="siwa-feature-card">
                      <h3 className="siwa-feature-card__title">{feature.title}</h3>
                      <p>{feature.body}</p>
                      <Link className="siwa-feature-card__link" to={feature.link.to}>
                        {feature.link.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          if (section.id === "quiz") {
            return (
              <section
                key={section.id}
                className="card section-block section-block--divider"
                data-reveal
                style={
                  quizSetting.backgroundImage
                    ? { backgroundImage: `url(${resolveApiAssetUrl(quizSetting.backgroundImage) ?? quizSetting.backgroundImage})` }
                    : undefined
                }
              >
                <h2 className="section-title">{quizSetting.title ?? t("home.quizTitle")}</h2>
                <p>{quizSetting.subtitle ?? t("home.quizBody")}</p>
                {quizSetting.ctaLabel && quizSetting.ctaLink ? (
                  <Link className="button button--primary" to={quizSetting.ctaLink}>
                    {quizSetting.ctaLabel}
                  </Link>
                ) : (
                  <Link className="button button--primary" to="/quiz">
                    {t("home.quizCta")}
                  </Link>
                )}
              </section>
            );
          }
          if (section.id === "newsletter") {
            return (
              <section
                key={section.id}
                className="card section-block"
                data-reveal
                style={
                  newsletterSetting.backgroundImage
                    ? {
                        backgroundImage: `url(${resolveApiAssetUrl(newsletterSetting.backgroundImage) ?? newsletterSetting.backgroundImage})`
                      }
                    : undefined
                }
              >
                <h2 className="section-title">{newsletterSetting.title ?? t("home.newsletterTitle")}</h2>
                <p>{newsletterSetting.subtitle ?? t("home.newsletterBody")}</p>
                <button className="button button--primary" type="button">
                  {newsletterSetting.ctaLabel ?? t("home.newsletterCta")}
                </button>
              </section>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default HomePage;
