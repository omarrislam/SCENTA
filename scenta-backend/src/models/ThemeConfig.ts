import mongoose, { Schema } from "mongoose";

const ThemeConfigSchema = new Schema(
  {
    locale: { type: String, enum: ["ar", "en"], required: true },
    home: Schema.Types.Mixed,
    homeSections: [Schema.Types.Mixed],
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
  {
    timestamps: true,
    strict: false
  }
);

export const ThemeConfig = mongoose.model("ThemeConfig", ThemeConfigSchema);
