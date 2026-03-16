"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeConfig = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HomeSectionSchema = new mongoose_1.Schema({
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
}, { _id: false });
const HeroSlideSchema = new mongoose_1.Schema({
    title: String,
    subtitle: String,
    image: String,
    primaryLabel: String,
    primaryLink: String,
    secondaryLabel: String,
    secondaryLink: String
}, { _id: false });
const ShippingItemSchema = new mongoose_1.Schema({
    title: String,
    body: String,
    icon: { type: String, enum: ["truck", "cash", "gift"] },
    enabled: { type: Boolean, default: true }
}, { _id: false });
const HomeConfigSchema = new mongoose_1.Schema({
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
        new mongoose_1.Schema({
            slug: String,
            title: String,
            description: String,
            image: String,
            enabled: { type: Boolean, default: true }
        }, { _id: false })
    ],
    badges: {
        bestLabel: String,
        newLabel: String,
        textColor: String,
        backgroundColor: String,
        position: { type: String, enum: ["top-left", "top-right"] }
    }
}, { _id: false });
const ThemeConfigSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
ThemeConfigSchema.index({ locale: 1 }, { unique: true });
exports.ThemeConfig = mongoose_1.default.model("ThemeConfig", ThemeConfigSchema);
