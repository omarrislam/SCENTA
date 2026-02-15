import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getTheme, updateTheme, uploadImage, ThemeConfig } from "../../services/backendApi";
import { themeSections } from "../../services/mockData";
import { listCollections } from "../../services/catalogService";
import Button from "../../components/ui/Button";
import { ThemeSection } from "../../services/types";
import { resolveLocale } from "../../utils/localize";
import { useToast } from "../../components/feedback/ToastContext";
import TextInput from "../../components/ui/TextInput";
import Select from "../../components/ui/Select";
import { defaultThemeConfig, darkThemePreset, lightThemePreset } from "../../theme/themeDefaults";

type HeroSlide = {
  title: string;
  subtitle: string;
  image: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
};

type ShippingItem = {
  title: string;
  body: string;
  icon: "truck" | "cash" | "gift";
  enabled?: boolean;
};

const buildDefaultHome = (t: (key: string) => string) => ({
  heroHeight: 520,
  heroAlignment: "left",
  heroOverlayStrength: 0.45,
  heroAutoplayMs: 6000,
  heroPauseOnHover: true,
  promoEnabled: true,
  promoShowIcon: true,
  promoSpeedSeconds: 18,
  promoMessages: [t("promo.shipping"), t("promo.cod"), t("promo.crafted")],
  heroSlides: [
    {
      title: t("hero.title"),
      subtitle: t("hero.subtitle"),
      image: "/images/amber-1.svg",
      primaryLabel: t("hero.primary"),
      primaryLink: "/collections/amber-signature",
      secondaryLabel: t("hero.secondary"),
      secondaryLink: "/quiz"
    },
    {
      title: t("hero.slideTwoTitle"),
      subtitle: t("hero.slideTwoSubtitle"),
      image: "/images/rose-1.svg",
      primaryLabel: t("hero.slideTwoPrimary"),
      primaryLink: "/shop?tag=fresh",
      secondaryLabel: t("hero.secondary"),
      secondaryLink: "/quiz"
    },
    {
      title: t("hero.slideThreeTitle"),
      subtitle: t("hero.slideThreeSubtitle"),
      image: "/images/iris-1.svg",
      primaryLabel: t("hero.slideThreePrimary"),
      primaryLink: "/shop?tag=warm",
      secondaryLabel: t("hero.secondary"),
      secondaryLink: "/quiz"
    }
  ],
  shippingItems: [
    { title: t("home.shippingFastTitle"), body: t("home.shippingFastBody"), icon: "truck" as const },
    { title: t("home.shippingCodTitle"), body: t("home.shippingCodBody"), icon: "cash" as const },
    { title: t("home.shippingGiftTitle"), body: t("home.shippingGiftBody"), icon: "gift" as const }
  ]
});

type SectionSetting = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  backgroundImage?: string;
  layout?: "grid" | "carousel";
  maxItems?: number;
};

type BadgeSettings = {
  bestLabel?: string;
  newLabel?: string;
  textColor?: string;
  backgroundColor?: string;
  position?: "top-left" | "top-right";
};

type ColorSettings = Required<NonNullable<ThemeConfig["colors"]>>;
type RadiusSettings = Required<NonNullable<ThemeConfig["radius"]>>;

const buildDefaultSectionSettings = (t: (key: string) => string) => ({
  hero: { title: t("hero.label") },
  notes: { title: t("hero.notesTitle") },
  collections: { title: t("home.collectionsTitle"), ctaLabel: t("home.collectionsCta"), ctaLink: "/shop" },
  shipping: {},
  editorial: { title: t("home.editorialTitle"), subtitle: t("home.editorialBody"), ctaLabel: t("home.editorialCta"), ctaLink: "/shop" },
  quiz: { title: t("home.quizTitle"), subtitle: t("home.quizBody"), ctaLabel: t("home.quizCta"), ctaLink: "/quiz" },
  bestsellers: { title: t("hero.bestSellers") },
  newsletter: { title: t("home.newsletterTitle"), subtitle: t("home.newsletterBody"), ctaLabel: t("home.newsletterCta") }
});

const isRouteOrUrl = (value: string) =>
  value.startsWith("/") || /^https?:\/\/.+/i.test(value);

const isHexColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

const AdminTheme = () => {
  const { t, i18n } = useTranslation();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const locale = resolveLocale(i18n.language);
  const { data } = useQuery({
    queryKey: ["theme", locale],
    queryFn: () => getTheme(locale)
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => listCollections(),
    staleTime: 1000 * 60
  });
  const [sections, setSections] = useState<ThemeSection[]>([]);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const defaultColors: ColorSettings = lightThemePreset.colors;
  const defaultRadius: RadiusSettings = lightThemePreset.radius;
  const [colors, setColors] = useState<ColorSettings>(defaultColors);
  const [radius, setRadius] = useState<RadiusSettings>(defaultRadius);
  const [heroHeight, setHeroHeight] = useState(defaultThemeConfig.home?.heroHeight ?? 520);
  const [heroAlignment, setHeroAlignment] = useState<"left" | "center" | "right">("left");
  const [heroOverlayStrength, setHeroOverlayStrength] = useState(0.45);
  const [heroAutoplayMs, setHeroAutoplayMs] = useState(6000);
  const [heroPauseOnHover, setHeroPauseOnHover] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [promoShowIcon, setPromoShowIcon] = useState(true);
  const [promoSpeedSeconds, setPromoSpeedSeconds] = useState(18);
  const [promoMessages, setPromoMessages] = useState<string[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([]);
  const [sectionSettings, setSectionSettings] = useState<Record<string, SectionSetting>>({});
  const [collectionItems, setCollectionItems] = useState<
    Array<{ slug: string; title?: string; description?: string; image?: string; enabled?: boolean }>
  >([]);
  const [badgeSettings, setBadgeSettings] = useState<BadgeSettings>({
    bestLabel: defaultThemeConfig.home?.badges?.bestLabel ?? "Best",
    newLabel: defaultThemeConfig.home?.badges?.newLabel ?? "New",
    textColor: defaultThemeConfig.home?.badges?.textColor ?? "#ffffff",
    backgroundColor: defaultThemeConfig.home?.badges?.backgroundColor ?? "#2f2623",
    position: defaultThemeConfig.home?.badges?.position ?? "top-left"
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaultHome = buildDefaultHome(t);
    const defaultSectionSettings = buildDefaultSectionSettings(t);
    if (data?.homeSections?.length) {
      setSections(data.homeSections);
    } else {
      setSections(themeSections);
    }
    if (data?.mode) {
      setMode(data.mode);
    } else {
      setMode(defaultThemeConfig.mode ?? "light");
    }
    setColors({ ...defaultColors, ...(data?.colors ?? {}) });
    setRadius({ ...defaultRadius, ...(data?.radius ?? {}) });
    const home = data?.home ?? {};
    setHeroHeight(home.heroHeight ?? defaultHome.heroHeight ?? 520);
    setHeroAlignment((home.heroAlignment ?? defaultHome.heroAlignment ?? "left") as "left" | "center" | "right");
    setHeroOverlayStrength(home.heroOverlayStrength ?? defaultHome.heroOverlayStrength ?? 0.45);
    setHeroAutoplayMs(home.heroAutoplayMs ?? defaultHome.heroAutoplayMs ?? 6000);
    setHeroPauseOnHover(home.heroPauseOnHover ?? defaultHome.heroPauseOnHover ?? true);
    setPromoEnabled(home.promoEnabled ?? defaultHome.promoEnabled ?? true);
    setPromoShowIcon(home.promoShowIcon ?? defaultHome.promoShowIcon ?? true);
    setPromoSpeedSeconds(home.promoSpeedSeconds ?? defaultHome.promoSpeedSeconds ?? 18);
    setPromoMessages(home.promoMessages?.length ? home.promoMessages : defaultHome.promoMessages);
    setHeroSlides(home.heroSlides?.length ? home.heroSlides : defaultHome.heroSlides);
    setShippingItems(home.shippingItems?.length ? home.shippingItems : defaultHome.shippingItems);
    setSectionSettings({ ...defaultSectionSettings, ...(home.sectionSettings ?? {}) });
    setCollectionItems(
      home.collectionItems?.length
        ? home.collectionItems
        : collections.map((collection) => ({
            slug: collection.slug,
            title: collection.title,
            description: collection.description,
            image: collection.image,
            enabled: true
          }))
    );
    setBadgeSettings({
      ...defaultThemeConfig.home?.badges,
      ...(home.badges ?? {})
    });
    setFieldErrors({});
  }, [data, t, collections]);

  const validateThemeEditor = () => {
    const errors: Record<string, string> = {};
    if (heroHeight < 320 || heroHeight > 900) errors.heroHeight = "Use a value between 320 and 900.";
    if (heroOverlayStrength < 0 || heroOverlayStrength > 1) errors.heroOverlayStrength = "Use a value from 0 to 1.";
    if (heroAutoplayMs < 2000 || heroAutoplayMs > 20000) errors.heroAutoplayMs = "Use 2000 to 20000 ms.";
    if (promoSpeedSeconds < 8 || promoSpeedSeconds > 60) errors.promoSpeedSeconds = "Use 8 to 60 seconds.";

    promoMessages.forEach((message, index) => {
      if (!message.trim()) {
        errors[`promoMessages.${index}`] = "Message cannot be empty.";
      } else if (message.trim().length > 90) {
        errors[`promoMessages.${index}`] = "Keep message under 90 characters.";
      }
    });

    heroSlides.forEach((slide, index) => {
      if (!slide.title.trim()) errors[`heroSlides.${index}.title`] = "Title is required.";
      if (!slide.subtitle.trim()) errors[`heroSlides.${index}.subtitle`] = "Subtitle is required.";
      if (!slide.image.trim()) errors[`heroSlides.${index}.image`] = "Image is required.";
      if (!slide.primaryLabel.trim()) errors[`heroSlides.${index}.primaryLabel`] = "Primary label is required.";
      if (!slide.secondaryLabel.trim()) errors[`heroSlides.${index}.secondaryLabel`] = "Secondary label is required.";
      if (!slide.primaryLink.trim() || !isRouteOrUrl(slide.primaryLink.trim())) {
        errors[`heroSlides.${index}.primaryLink`] = "Use a route like /shop or a full URL.";
      }
      if (!slide.secondaryLink.trim() || !isRouteOrUrl(slide.secondaryLink.trim())) {
        errors[`heroSlides.${index}.secondaryLink`] = "Use a route like /quiz or a full URL.";
      }
    });

    sectionOrder.forEach((id) => {
      const setting = sectionSettings[id];
      if (setting?.ctaLink && !isRouteOrUrl(setting.ctaLink)) {
        errors[`sectionSettings.${id}.ctaLink`] = "Use a route like /shop or a full URL.";
      }
      if (typeof setting?.maxItems === "number" && (setting.maxItems < 1 || setting.maxItems > 24)) {
        errors[`sectionSettings.${id}.maxItems`] = "Use a value between 1 and 24.";
      }
    });

    if (!badgeSettings.bestLabel?.trim()) errors.badgeBestLabel = "Best label is required.";
    if (!badgeSettings.newLabel?.trim()) errors.badgeNewLabel = "New label is required.";
    if (badgeSettings.textColor && !isHexColor(badgeSettings.textColor)) errors.badgeTextColor = "Use a valid hex color.";
    if (badgeSettings.backgroundColor && !isHexColor(badgeSettings.backgroundColor)) errors.badgeBackgroundColor = "Use a valid hex color.";

    const paletteEntries: Array<[string, string]> = Object.entries(colors) as Array<[string, string]>;
    paletteEntries.forEach(([key, value]) => {
      if (!isHexColor(value)) errors[`colors.${key}`] = "Use a valid hex color.";
    });

    (["sm", "md", "lg"] as const).forEach((sizeKey) => {
      const value = radius[sizeKey] ?? 0;
      if (value < 0 || value > 40) errors[`radius.${sizeKey}`] = "Use a value between 0 and 40.";
    });

    return errors;
  };

  const handleSaveTheme = () => {
    const nextErrors = validateThemeEditor();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      pushToast("Fix highlighted theme settings before saving.", "error");
      return;
    }
    updateMutation.mutate();
  };

  const updateMutation = useMutation({
    mutationFn: () =>
      updateTheme({
        locale,
        homeSections: sections,
        mode,
        colors,
        radius,
        home: {
          heroHeight,
          heroAlignment,
          heroOverlayStrength,
          heroAutoplayMs,
          heroPauseOnHover,
          promoEnabled,
          promoShowIcon,
          promoSpeedSeconds,
          promoMessages,
          heroSlides,
          shippingItems,
          sectionSettings,
          collectionItems,
          badges: badgeSettings
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme", locale] });
      pushToast("Theme saved", "success");
    }
  });

  const canMove = useMemo(() => sections.length > 1, [sections.length]);
  const sectionOrder = [
    "hero",
    "notes",
    "collections",
    "shipping",
    "editorial",
    "quiz",
    "bestsellers",
    "newsletter"
  ];

  const move = (index: number, direction: number) => {
    if (!canMove) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    setSections(next);
  };

  const toggle = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isVisible: !section.isVisible } : section
      )
    );
  };

  const updatePromoMessage = (index: number, value: string) => {
    setPromoMessages((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const moveHeroSlide = (index: number, direction: number) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= heroSlides.length) return;
    setHeroSlides((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const updateHeroSlide = (index: number, patch: Partial<HeroSlide>) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateShippingItem = (index: number, patch: Partial<ShippingItem>) => {
    setShippingItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const moveShippingItem = (index: number, direction: number) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= shippingItems.length) return;
    setShippingItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const updateSectionSetting = (id: string, patch: Partial<SectionSetting>) => {
    setSectionSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch }
    }));
  };

  const updateCollectionItem = (
    index: number,
    patch: Partial<{ title?: string; description?: string; image?: string; enabled?: boolean; slug?: string }>
  ) => {
    setCollectionItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleImageUpload = async (file: File, onLoad: (value: string) => void) => {
    try {
      const url = await uploadImage(file);
      onLoad(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      pushToast(message, "error");
    }
  };

  const moveCollectionItem = (index: number, direction: number) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= collectionItems.length) return;
    setCollectionItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className="card grid admin-theme admin-theme-editor">
      <div className="admin-theme__header">
        <h1 className="section-title">Theme Editor</h1>
        <Button type="button" className="button--primary" onClick={handleSaveTheme}>
          {t("cta.save")}
        </Button>
      </div>
      <div className="grid admin-theme__grid">
        <div className="card">
          <h2 className="section-title">Mode</h2>
          <Select value={mode} onChange={(event) => setMode(event.target.value as "light" | "dark")}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              type="button"
              onClick={() => {
                setMode(darkThemePreset.mode);
                setColors({ ...defaultColors, ...darkThemePreset.colors });
                setRadius({ ...defaultRadius, ...darkThemePreset.radius });
              }}
            >
              Apply dark preset
            </Button>
            <Button
              type="button"
              onClick={() => {
                setMode(lightThemePreset.mode);
                setColors(lightThemePreset.colors);
                setRadius(lightThemePreset.radius);
              }}
            >
              Reset to light
            </Button>
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Promo Bar</h2>
          <label>
            <input
              type="checkbox"
              checked={promoEnabled}
              onChange={(event) => setPromoEnabled(event.target.checked)}
            />{" "}
            Enabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={promoShowIcon}
              onChange={(event) => setPromoShowIcon(event.target.checked)}
            />{" "}
            Show icon
          </label>
          <label>Rotation speed (seconds)</label>
          <TextInput
            type="number"
            className={fieldErrors.promoSpeedSeconds ? "admin-theme__field--invalid" : ""}
            value={promoSpeedSeconds}
            onChange={(event) => setPromoSpeedSeconds(Number(event.target.value))}
          />
          <p className="admin-theme__field-help">Recommended: 12-24 seconds.</p>
          {fieldErrors.promoSpeedSeconds && <p className="admin-theme__field-error">{fieldErrors.promoSpeedSeconds}</p>}
          <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
            {promoMessages.map((message, index) => (
              <div key={`promo-${index}`} className="admin-theme__field-block">
                <TextInput
                  className={fieldErrors[`promoMessages.${index}`] ? "admin-theme__field--invalid" : ""}
                  value={message}
                  onChange={(event) => updatePromoMessage(index, event.target.value)}
                  placeholder={`Promo message ${index + 1}`}
                />
                {fieldErrors[`promoMessages.${index}`] && (
                  <p className="admin-theme__field-error">{fieldErrors[`promoMessages.${index}`]}</p>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button type="button" onClick={() => setPromoMessages((prev) => [...prev, "New promo message"])}>
                Add message
              </Button>
              <Button
                type="button"
                onClick={() => setPromoMessages((prev) => prev.slice(0, Math.max(0, prev.length - 1)))}
              >
                Remove last
              </Button>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Hero Settings</h2>
          <label>Hero height (px)</label>
          <TextInput
            type="number"
            className={fieldErrors.heroHeight ? "admin-theme__field--invalid" : ""}
            value={heroHeight}
            onChange={(event) => setHeroHeight(Number(event.target.value))}
          />
          {fieldErrors.heroHeight && <p className="admin-theme__field-error">{fieldErrors.heroHeight}</p>}
          <label>Alignment</label>
          <Select value={heroAlignment} onChange={(event) => setHeroAlignment(event.target.value as "left" | "center" | "right")}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </Select>
          <label>Overlay strength (0 to 1)</label>
          <TextInput
            type="number"
            className={fieldErrors.heroOverlayStrength ? "admin-theme__field--invalid" : ""}
            value={heroOverlayStrength}
            step="0.05"
            onChange={(event) => setHeroOverlayStrength(Number(event.target.value))}
          />
          {fieldErrors.heroOverlayStrength && <p className="admin-theme__field-error">{fieldErrors.heroOverlayStrength}</p>}
          <label>Autoplay (ms)</label>
          <TextInput
            type="number"
            className={fieldErrors.heroAutoplayMs ? "admin-theme__field--invalid" : ""}
            value={heroAutoplayMs}
            onChange={(event) => setHeroAutoplayMs(Number(event.target.value))}
          />
          {fieldErrors.heroAutoplayMs && <p className="admin-theme__field-error">{fieldErrors.heroAutoplayMs}</p>}
          <label>
            <input
              type="checkbox"
              checked={heroPauseOnHover}
              onChange={(event) => setHeroPauseOnHover(event.target.checked)}
            />{" "}
            Pause on hover
          </label>
        </div>
        <div className="card">
          <h2 className="section-title">Hero Slides</h2>
          <div className="grid">
            {heroSlides.map((slide, index) => (
              <div key={`slide-${index}`} className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Slide {index + 1}</strong>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="button" onClick={() => moveHeroSlide(index, -1)}>
                      Up
                    </Button>
                    <Button type="button" onClick={() => moveHeroSlide(index, 1)}>
                      Down
                    </Button>
                    <Button type="button" onClick={() => setHeroSlides((prev) => prev.filter((_, idx) => idx !== index))}>
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="grid">
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.title`] ? "admin-theme__field--invalid" : ""}
                    value={slide.title}
                    onChange={(event) => updateHeroSlide(index, { title: event.target.value })}
                    placeholder="Title"
                  />
                  {fieldErrors[`heroSlides.${index}.title`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.title`]}</p>
                  )}
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.subtitle`] ? "admin-theme__field--invalid" : ""}
                    value={slide.subtitle}
                    onChange={(event) => updateHeroSlide(index, { subtitle: event.target.value })}
                    placeholder="Subtitle"
                  />
                  {fieldErrors[`heroSlides.${index}.subtitle`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.subtitle`]}</p>
                  )}
                  <div className="grid">
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleImageUpload(file, (value) => updateHeroSlide(index, { image: value }));
                      }}
                    />
                    <TextInput
                      className={fieldErrors[`heroSlides.${index}.image`] ? "admin-theme__field--invalid" : ""}
                      value={slide.image}
                      readOnly
                      placeholder="Image preview (data URL)"
                    />
                    {fieldErrors[`heroSlides.${index}.image`] && (
                      <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.image`]}</p>
                    )}
                    <Button type="button" onClick={() => updateHeroSlide(index, { image: "" })}>
                      Clear image
                    </Button>
                  </div>
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.primaryLabel`] ? "admin-theme__field--invalid" : ""}
                    value={slide.primaryLabel}
                    onChange={(event) => updateHeroSlide(index, { primaryLabel: event.target.value })}
                    placeholder="Primary label"
                  />
                  {fieldErrors[`heroSlides.${index}.primaryLabel`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.primaryLabel`]}</p>
                  )}
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.primaryLink`] ? "admin-theme__field--invalid" : ""}
                    value={slide.primaryLink}
                    onChange={(event) => updateHeroSlide(index, { primaryLink: event.target.value })}
                    placeholder="Primary link"
                  />
                  {fieldErrors[`heroSlides.${index}.primaryLink`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.primaryLink`]}</p>
                  )}
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.secondaryLabel`] ? "admin-theme__field--invalid" : ""}
                    value={slide.secondaryLabel}
                    onChange={(event) => updateHeroSlide(index, { secondaryLabel: event.target.value })}
                    placeholder="Secondary label"
                  />
                  {fieldErrors[`heroSlides.${index}.secondaryLabel`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.secondaryLabel`]}</p>
                  )}
                  <TextInput
                    className={fieldErrors[`heroSlides.${index}.secondaryLink`] ? "admin-theme__field--invalid" : ""}
                    value={slide.secondaryLink}
                    onChange={(event) => updateHeroSlide(index, { secondaryLink: event.target.value })}
                    placeholder="Secondary link"
                  />
                  {fieldErrors[`heroSlides.${index}.secondaryLink`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`heroSlides.${index}.secondaryLink`]}</p>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                setHeroSlides((prev) => [
                  ...prev,
                  {
                    title: "New slide title",
                    subtitle: "New slide subtitle",
                    image: "/images/amber-1.svg",
                    primaryLabel: "Primary CTA",
                    primaryLink: "/shop",
                    secondaryLabel: "Secondary CTA",
                    secondaryLink: "/quiz"
                  }
                ])
              }
            >
              Add slide
            </Button>
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Section Settings</h2>
          <div className="grid">
            {sectionOrder.map((id) => (
              <div key={id} className="card" style={{ padding: "16px" }}>
                <strong>{id}</strong>
                <div className="grid">
                  <TextInput
                    value={sectionSettings[id]?.title ?? ""}
                    onChange={(event) => updateSectionSetting(id, { title: event.target.value })}
                    placeholder="Title"
                  />
                  <TextInput
                    value={sectionSettings[id]?.subtitle ?? ""}
                    onChange={(event) => updateSectionSetting(id, { subtitle: event.target.value })}
                    placeholder="Subtitle"
                  />
                  <TextInput
                    value={sectionSettings[id]?.ctaLabel ?? ""}
                    onChange={(event) => updateSectionSetting(id, { ctaLabel: event.target.value })}
                    placeholder="CTA label"
                  />
                  <TextInput
                    className={fieldErrors[`sectionSettings.${id}.ctaLink`] ? "admin-theme__field--invalid" : ""}
                    value={sectionSettings[id]?.ctaLink ?? ""}
                    onChange={(event) => updateSectionSetting(id, { ctaLink: event.target.value })}
                    placeholder="CTA link"
                  />
                  {fieldErrors[`sectionSettings.${id}.ctaLink`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`sectionSettings.${id}.ctaLink`]}</p>
                  )}
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleImageUpload(file, (value) => updateSectionSetting(id, { backgroundImage: value }));
                      }}
                    />
                  <TextInput value={sectionSettings[id]?.backgroundImage ?? ""} readOnly placeholder="Background image" />
                  <Button type="button" onClick={() => updateSectionSetting(id, { backgroundImage: "" })}>
                    Clear background
                  </Button>
                  <Select
                    value={sectionSettings[id]?.layout ?? "grid"}
                    onChange={(event) =>
                      updateSectionSetting(id, { layout: event.target.value as SectionSetting["layout"] })
                    }
                  >
                    <option value="grid">Grid</option>
                    <option value="carousel">Carousel</option>
                  </Select>
                  <TextInput
                    type="number"
                    className={fieldErrors[`sectionSettings.${id}.maxItems`] ? "admin-theme__field--invalid" : ""}
                    value={sectionSettings[id]?.maxItems ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateSectionSetting(id, { maxItems: value ? Number(value) : undefined });
                    }}
                    placeholder="Max items"
                  />
                  {fieldErrors[`sectionSettings.${id}.maxItems`] && (
                    <p className="admin-theme__field-error">{fieldErrors[`sectionSettings.${id}.maxItems`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Collection Tiles</h2>
          <div className="grid">
            {collectionItems.map((item, index) => (
              <div key={`${item.slug}-${index}`} className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{item.slug}</strong>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="button" onClick={() => moveCollectionItem(index, -1)}>
                      Up
                    </Button>
                    <Button type="button" onClick={() => moveCollectionItem(index, 1)}>
                      Down
                    </Button>
                  </div>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={(event) => updateCollectionItem(index, { enabled: event.target.checked })}
                  />{" "}
                  Enabled
                </label>
                <Select
                  value={item.slug}
                  onChange={(event) => updateCollectionItem(index, { slug: event.target.value })}
                >
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.slug}>
                      {collection.title}
                    </option>
                  ))}
                </Select>
                <div className="grid">
                  <TextInput
                    value={item.title ?? ""}
                    onChange={(event) => updateCollectionItem(index, { title: event.target.value })}
                    placeholder="Custom title"
                  />
                  <TextInput
                    value={item.description ?? ""}
                    onChange={(event) => updateCollectionItem(index, { description: event.target.value })}
                    placeholder="Custom description"
                  />
                    <input
                      className="input"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void handleImageUpload(file, (value) => updateCollectionItem(index, { image: value }));
                      }}
                    />
                  <TextInput value={item.image ?? ""} readOnly placeholder="Image override" />
                  <Button type="button" onClick={() => updateCollectionItem(index, { image: "" })}>
                    Clear image
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Trust Strip</h2>
          <div className="grid">
            {shippingItems.map((item, index) => (
              <div key={`ship-${index}`} className="card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Item {index + 1}</strong>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button type="button" onClick={() => moveShippingItem(index, -1)}>
                      Up
                    </Button>
                    <Button type="button" onClick={() => moveShippingItem(index, 1)}>
                      Down
                    </Button>
                  </div>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={(event) => updateShippingItem(index, { enabled: event.target.checked })}
                  />{" "}
                  Enabled
                </label>
                <div className="grid">
                  <TextInput
                    value={item.title}
                    onChange={(event) => updateShippingItem(index, { title: event.target.value })}
                    placeholder="Title"
                  />
                  <TextInput
                    value={item.body}
                    onChange={(event) => updateShippingItem(index, { body: event.target.value })}
                    placeholder="Body"
                  />
                  <Select
                    value={item.icon}
                    onChange={(event) =>
                      updateShippingItem(index, { icon: event.target.value as ShippingItem["icon"] })
                    }
                  >
                    <option value="truck">Truck</option>
                    <option value="cash">Cash</option>
                    <option value="gift">Gift</option>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="section-title">Badges</h2>
          <label>Best label</label>
          <TextInput
            className={fieldErrors.badgeBestLabel ? "admin-theme__field--invalid" : ""}
            value={badgeSettings.bestLabel ?? ""}
            onChange={(event) => setBadgeSettings((prev) => ({ ...prev, bestLabel: event.target.value }))}
          />
          {fieldErrors.badgeBestLabel && <p className="admin-theme__field-error">{fieldErrors.badgeBestLabel}</p>}
          <label>New label</label>
          <TextInput
            className={fieldErrors.badgeNewLabel ? "admin-theme__field--invalid" : ""}
            value={badgeSettings.newLabel ?? ""}
            onChange={(event) => setBadgeSettings((prev) => ({ ...prev, newLabel: event.target.value }))}
          />
          {fieldErrors.badgeNewLabel && <p className="admin-theme__field-error">{fieldErrors.badgeNewLabel}</p>}
          <label>Text color</label>
          <TextInput
            type="color"
            className={fieldErrors.badgeTextColor ? "admin-theme__field--invalid" : ""}
            value={badgeSettings.textColor ?? "#ffffff"}
            onChange={(event) => setBadgeSettings((prev) => ({ ...prev, textColor: event.target.value }))}
          />
          {fieldErrors.badgeTextColor && <p className="admin-theme__field-error">{fieldErrors.badgeTextColor}</p>}
          <label>Background color</label>
          <TextInput
            type="color"
            className={fieldErrors.badgeBackgroundColor ? "admin-theme__field--invalid" : ""}
            value={badgeSettings.backgroundColor ?? "#2f2623"}
            onChange={(event) => setBadgeSettings((prev) => ({ ...prev, backgroundColor: event.target.value }))}
          />
          {fieldErrors.badgeBackgroundColor && <p className="admin-theme__field-error">{fieldErrors.badgeBackgroundColor}</p>}
          <label>Position</label>
          <Select
            value={badgeSettings.position ?? "top-left"}
            onChange={(event) =>
              setBadgeSettings((prev) => ({ ...prev, position: event.target.value as BadgeSettings["position"] }))
            }
          >
            <option value="top-left">Top left</option>
            <option value="top-right">Top right</option>
          </Select>
        </div>
        <div className="card">
          <h2 className="section-title">Palette</h2>
          <label>Background start</label>
          <TextInput
            type="color"
            className={fieldErrors["colors.bgStart"] ? "admin-theme__field--invalid" : ""}
            value={colors.bgStart}
            onChange={(event) => setColors((prev) => ({ ...prev, bgStart: event.target.value }))}
          />
          {fieldErrors["colors.bgStart"] && <p className="admin-theme__field-error">{fieldErrors["colors.bgStart"]}</p>}
          <label>Background mid</label>
          <TextInput
            type="color"
            value={colors.bgMid}
            onChange={(event) => setColors((prev) => ({ ...prev, bgMid: event.target.value }))}
          />
          <label>Background end</label>
          <TextInput
            type="color"
            value={colors.bgEnd}
            onChange={(event) => setColors((prev) => ({ ...prev, bgEnd: event.target.value }))}
          />
          <label>Surface</label>
          <TextInput
            type="color"
            className={fieldErrors["colors.surface"] ? "admin-theme__field--invalid" : ""}
            value={colors.surface}
            onChange={(event) => setColors((prev) => ({ ...prev, surface: event.target.value }))}
          />
          {fieldErrors["colors.surface"] && <p className="admin-theme__field-error">{fieldErrors["colors.surface"]}</p>}
          <label>Text</label>
          <TextInput
            type="color"
            value={colors.text}
            onChange={(event) => setColors((prev) => ({ ...prev, text: event.target.value }))}
          />
          <label>Muted</label>
          <TextInput
            type="color"
            value={colors.muted}
            onChange={(event) => setColors((prev) => ({ ...prev, muted: event.target.value }))}
          />
          <label>Accent</label>
          <TextInput
            type="color"
            value={colors.accent}
            onChange={(event) => setColors((prev) => ({ ...prev, accent: event.target.value }))}
          />
          <label>Accent dark</label>
          <TextInput
            type="color"
            value={colors.accentDark}
            onChange={(event) => setColors((prev) => ({ ...prev, accentDark: event.target.value }))}
          />
          <label>Accent soft</label>
          <TextInput
            type="color"
            value={colors.accentSoft}
            onChange={(event) => setColors((prev) => ({ ...prev, accentSoft: event.target.value }))}
          />
        </div>
        <div className="card">
          <h2 className="section-title">Radius</h2>
          <label>Small</label>
          <TextInput
            type="number"
            className={fieldErrors["radius.sm"] ? "admin-theme__field--invalid" : ""}
            value={radius.sm}
            onChange={(event) => setRadius((prev) => ({ ...prev, sm: Number(event.target.value) }))}
          />
          {fieldErrors["radius.sm"] && <p className="admin-theme__field-error">{fieldErrors["radius.sm"]}</p>}
          <label>Medium</label>
          <TextInput
            type="number"
            className={fieldErrors["radius.md"] ? "admin-theme__field--invalid" : ""}
            value={radius.md}
            onChange={(event) => setRadius((prev) => ({ ...prev, md: Number(event.target.value) }))}
          />
          {fieldErrors["radius.md"] && <p className="admin-theme__field-error">{fieldErrors["radius.md"]}</p>}
          <label>Large</label>
          <TextInput
            type="number"
            className={fieldErrors["radius.lg"] ? "admin-theme__field--invalid" : ""}
            value={radius.lg}
            onChange={(event) => setRadius((prev) => ({ ...prev, lg: Number(event.target.value) }))}
          />
          {fieldErrors["radius.lg"] && <p className="admin-theme__field-error">{fieldErrors["radius.lg"]}</p>}
        </div>
        <div className="card">
          <h2 className="section-title">Preview</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            <p style={{ margin: 0 }}>Preview text uses your palette.</p>
            <Button className="button--primary" type="button">
              Primary CTA
            </Button>
            <div className="badge">Badge</div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="section-title">Section Order</h2>
        <div className="theme-section-list">
          {sections.map((section, index) => (
            <div key={section.id} className="theme-section-row">
              <span>{section.label}</span>
              <div className="theme-section-actions">
                <Button type="button" onClick={() => move(index, -1)}>
                  Up
                </Button>
                <Button type="button" onClick={() => move(index, 1)}>
                  Down
                </Button>
                <Button type="button" onClick={() => toggle(section.id)}>
                  {section.isVisible ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTheme;
