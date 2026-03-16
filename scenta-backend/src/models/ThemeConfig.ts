import mongoose, { Schema } from "mongoose";

const HomeSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: String,
    isVisible: { type: Boolean, default: true },
    settings: {
      title: String,
      subtitle: String,
      ctaLabel: String,
      ctaLink: String,
      backgroundImage: String,
      layout: { type: String, enum: ["grid", "carousel"] },
      maxItems: Number
    }
  },
  { _id: false }
);

const HeroSlideSchema = new Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    primaryLabel: String,
    primaryLink: String,
    secondaryLabel: String,
    secondaryLink: String
  },
  { _id: false }
);

const ShippingItemSchema = new Schema(
  {
    title: String,
    body: String,
    icon: { type: String, enum: ["truck", "cash", "gift"] },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const HomeConfigSchema = new Schema(
  {
    heroHeight: Number,
    heroAlignment: { type: String, enum: ["left", "center", "right"] },
    heroOverlayStrength: Number,
    heroAutoplayMs: Number,
    heroPauseOnHover: Boolean,
    promoEnabled: Boolean,
    promoMessages: [String],
    promoShowIcon: Boolean,
    promoSpeedSeconds: Number,
    heroSlides: [HeroSlideSchema],
    shippingItems: [ShippingItemSchema],
    collectionItems: [
      new Schema(
        {
          slug: String,
          title: String,
          description: String,
          image: String,
          enabled: { type: Boolean, default: true }
        },
        { _id: false }
      )
    ],
    badges: {
      bestLabel: String,
      newLabel: String,
      textColor: String,
      backgroundColor: String,
      position: { type: String, enum: ["top-left", "top-right"] }
    }
  },
  { _id: false }
);

const ThemeConfigSchema = new Schema(
  {
    locale: { type: String, enum: ["ar", "en"], required: true },
    home: { type: HomeConfigSchema, default: undefined },
    homeSections: { type: [HomeSectionSchema], default: [] },
    mode: { type: String, enum: ["light", "dark"], default: "light" },
    colors: {
      bgStart: String,
      bgMid: String,
      bgEnd: String,
      surface: String,
      text: String,
      muted: String,
      accent: String,
      accentDark: String,
      accentSoft: String
    },
    radius: {
      sm: Number,
      md: Number,
      lg: Number
    }
  },
  { timestamps: true }
);

ThemeConfigSchema.index({ locale: 1 }, { unique: true });

export const ThemeConfig = mongoose.model("ThemeConfig", ThemeConfigSchema);
