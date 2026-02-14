export const quizDefaults = [
  {
    prompt: "Which mood fits your scent?",
    promptAr: "أي مزاج يناسب عطرك؟",
    options: [
      { label: "Warm and cozy", labelAr: "دافئ ومريح", score: 2, note: "amber" },
      { label: "Bright and airy", labelAr: "منعش وخفيف", score: 1, note: "floral" },
      { label: "Bold and smoky", labelAr: "قوي ومدخّن", score: 3, note: "oud" }
    ]
  },
  {
    prompt: "When do you wear fragrance most?",
    promptAr: "متى تستخدم العطر غالبًا؟",
    options: [
      { label: "Daytime", labelAr: "نهارًا", score: 1, note: "fresh" },
      { label: "Evening", labelAr: "مساءً", score: 2, note: "warm" },
      { label: "Anytime", labelAr: "أي وقت", score: 2, note: "versatile" }
    ]
  }
];
