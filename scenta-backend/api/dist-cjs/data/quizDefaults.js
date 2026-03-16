"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizDefaults = void 0;
exports.quizDefaults = [
    {
        translations: {
            en: { prompt: "Which mood fits your scent?" },
            ar: { prompt: "أي مزاج يناسب عطرك؟" }
        },
        options: [
            { translations: { en: { label: "Warm and cozy" }, ar: { label: "دافئ ومريح" } }, score: 2, note: "amber" },
            { translations: { en: { label: "Bright and airy" }, ar: { label: "منعش وخفيف" } }, score: 1, note: "floral" },
            { translations: { en: { label: "Bold and smoky" }, ar: { label: "قوي ومدخّن" } }, score: 3, note: "oud" }
        ]
    },
    {
        translations: {
            en: { prompt: "When do you wear fragrance most?" },
            ar: { prompt: "متى تستخدم العطر غالبًا؟" }
        },
        options: [
            { translations: { en: { label: "Daytime" }, ar: { label: "نهارًا" } }, score: 1, note: "fresh" },
            { translations: { en: { label: "Evening" }, ar: { label: "مساءً" } }, score: 2, note: "warm" },
            { translations: { en: { label: "Anytime" }, ar: { label: "أي وقت" } }, score: 2, note: "versatile" }
        ]
    }
];
