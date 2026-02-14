import {
  BlogPost,
  Collection,
  Coupon,
  Customer,
  Order,
  Product,
  Review,
  StaticPage,
  ThemeSection,
  QuizQuestion
} from "./types";

export const collections: Collection[] = [
  {
    id: "col-amber",
    slug: "amber-signature",
    title: "Amber Signature",
    titleAr: "توقيع العنبر",
    description: "Warm resins and smoky woods.",
    descriptionAr: "راتنجات دافئة وأخشاب دخانية.",
    tags: ["warm", "bold"]
  },
  {
    id: "col-floral",
    slug: "floral-veil",
    title: "Floral Veil",
    titleAr: "حجاب زهري",
    description: "Modern blooms with airy musk.",
    descriptionAr: "أزهار عصرية مع مسك هوائي.",
    tags: ["fresh"]
  }
];

export const products: Product[] = [
  {
    id: "prod-amber",
    slug: "silk-amber",
    name: "Silk Amber",
    nameAr: "عنبر حريري",
    description: "A luminous amber with clean musk and saffron glow.",
    descriptionAr: "عنبر مضيء مع مسك ناعم ولمعة زعفران.",
    notes: ["Amber", "Musk", "Saffron"],
    notesAr: ["عنبر", "مسك", "زعفران"],
    flags: { featured: true, bestSeller: true },
    rating: 4.8,
    tags: ["warm", "evening"],
    variants: [
      { id: "var-amber-50", size: "50ml", price: 1890, stock: 12 },
      { id: "var-amber-100", size: "100ml", price: 2690, stock: 6 }
    ],
    images: ["/images/silk-amber.png", "/images/amber-2.svg"]
  },
  {
    id: "prod-rose",
    slug: "rose-veil",
    name: "Rose Veil",
    nameAr: "حجاب الورد",
    description: "A sheer rose wrapped in pear and clean woods.",
    descriptionAr: "ورد شفاف يلتف حوله كمثرى وخشب نقي.",
    notes: ["Rose", "Pear", "Cedar"],
    notesAr: ["ورد", "كمثرى", "أرز"],
    flags: { new: true },
    rating: 4.6,
    tags: ["fresh", "day"],
    variants: [
      { id: "var-rose-50", size: "50ml", price: 1650, stock: 24 },
      { id: "var-rose-100", size: "100ml", price: 2390, stock: 10 }
    ],
    images: ["/images/rose-veil.png", "/images/rose-2.svg"]
  },
  {
    id: "prod-oud",
    slug: "golden-oud",
    name: "Golden Oud",
    nameAr: "عود ذهبي",
    description: "Spiced oud with a honeyed trail.",
    descriptionAr: "عود متبّل بأثر عسلي.",
    notes: ["Oud", "Honey", "Cardamom"],
    notesAr: ["عود", "عسل", "هيل"],
    flags: { featured: true },
    rating: 4.7,
    tags: ["bold", "night"],
    variants: [
      { id: "var-oud-50", size: "50ml", price: 2100, stock: 8 },
      { id: "var-oud-100", size: "100ml", price: 2950, stock: 5 }
    ],
    images: ["/images/oud-1.svg", "/images/oud-2.svg"]
  },
  {
    id: "prod-cedar",
    slug: "cedar-mist",
    name: "Cedar Mist",
    nameAr: "ضباب الأرز",
    description: "Dry cedar with a whisper of bergamot.",
    descriptionAr: "أرز جاف مع لمسة برغموت.",
    notes: ["Cedar", "Bergamot", "Vetiver"],
    notesAr: ["أرز", "برغموت", "فيتيفر"],
    flags: { new: true },
    rating: 4.5,
    tags: ["fresh", "day"],
    variants: [
      { id: "var-cedar-50", size: "50ml", price: 1520, stock: 18 },
      { id: "var-cedar-100", size: "100ml", price: 2200, stock: 9 }
    ],
    images: ["/images/cedar-1.svg", "/images/cedar-2.svg"]
  },
  {
    id: "prod-citrus",
    slug: "citrus-dawn",
    name: "Citrus Dawn",
    nameAr: "فجر الحمضيات",
    description: "Sparkling citrus lifted by neroli.",
    descriptionAr: "حمضيات متلألئة مع نيرولي.",
    notes: ["Lemon", "Neroli", "Musk"],
    notesAr: ["ليمون", "نيرولي", "مسك"],
    flags: { featured: true },
    rating: 4.4,
    tags: ["fresh", "day"],
    variants: [
      { id: "var-citrus-50", size: "50ml", price: 1450, stock: 20 },
      { id: "var-citrus-100", size: "100ml", price: 2100, stock: 7 }
    ],
    images: ["/images/citrus-1.svg", "/images/citrus-2.svg"]
  },
  {
    id: "prod-iris",
    slug: "velvet-iris",
    name: "Velvet Iris",
    nameAr: "آيرس مخملي",
    description: "Powdery iris wrapped in vanilla woods.",
    descriptionAr: "آيرس بودري مع أخشاب الفانيلا.",
    notes: ["Iris", "Vanilla", "Sandalwood"],
    notesAr: ["آيرس", "فانيلا", "صندل"],
    flags: { bestSeller: true },
    rating: 4.9,
    tags: ["warm", "evening"],
    variants: [
      { id: "var-iris-50", size: "50ml", price: 1980, stock: 14 },
      { id: "var-iris-100", size: "100ml", price: 2750, stock: 6 }
    ],
    images: ["/images/velvet-iris.png", "/images/iris-2.svg"]
  }
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-amber",
    rating: 5,
    author: "Lina",
    body: "Silky, warm, and lasts all night."
  },
  {
    id: "rev-2",
    productId: "prod-amber",
    rating: 4,
    author: "Omar",
    body: "Elegant and not overpowering."
  },
  {
    id: "rev-3",
    productId: "prod-rose",
    rating: 5,
    author: "Yara",
    body: "Fresh rose without the heaviness."
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "rituals-of-scent",
    title: "Rituals of Scent",
    titleAr: "طقوس العطر",
    excerpt: "How to layer fragrance for day and night.",
    excerptAr: "كيف تنسّق طبقات العطر ليلًا ونهارًا.",
    body: "Explore layering rituals and the art of scent transitions.",
    bodyAr: "استكشف طقوس التدرّج وفن انتقالات العطر.",
    cover: "/images/blog-rituals.svg"
  },
  {
    id: "blog-2",
    slug: "notes-and-memories",
    title: "Notes & Memories",
    titleAr: "نغمات وذكريات",
    excerpt: "Why certain notes feel like home.",
    excerptAr: "لماذا تبدو بعض النغمات كأنها المنزل.",
    body: "A dive into olfactive memory and emotion.",
    bodyAr: "غوص في ذاكرة الشم والعاطفة.",
    cover: "/images/blog-notes.svg"
  }
];

export const staticPages: StaticPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "About SCENTA",
    titleAr: "عن سنتا",
    body: "SCENTA crafts contemporary fragrances with a minimal, luxe soul.",
    bodyAr: "تبتكر سنتا عطورًا عصرية بروح فاخرة وبساطة أنيقة."
  },
  {
    id: "page-returns",
    slug: "returns",
    title: "Returns",
    titleAr: "الاسترجاع",
    body: "Returns accepted within 14 days for unopened products.",
    bodyAr: "نقبل الاسترجاع خلال 14 يومًا للمنتجات غير المفتوحة."
  },
  {
    id: "page-shipping",
    slug: "shipping",
    title: "Shipping",
    titleAr: "الشحن",
    body: "Nationwide delivery within 3-5 business days.",
    bodyAr: "توصيل لكل المحافظات خلال ٣-٥ أيام عمل."
  },
  {
    id: "page-privacy",
    slug: "privacy",
    title: "Privacy Policy",
    titleAr: "سياسة الخصوصية",
    body: "We only use your data to fulfill orders and improve your experience.",
    bodyAr: "نستخدم بياناتك فقط لإتمام الطلبات وتحسين تجربتك."
  },
  {
    id: "page-terms",
    slug: "terms",
    title: "Terms of Service",
    titleAr: "شروط الخدمة",
    body: "By using SCENTA, you agree to our store terms and policies.",
    bodyAr: "باستخدام سنتا، توافق على شروط المتجر وسياساته."
  }
];

export const orders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "SCN-1024",
    status: "paid",
    total: 4580,
    createdAt: "2026-01-10"
  }
];

export const customers: Customer[] = [
  { id: "cust-1", name: "Salma", email: "salma@example.com", orders: 3 },
  { id: "cust-2", name: "Hassan", email: "hassan@example.com", orders: 1 }
];

export const coupons: Coupon[] = [
  { id: "c-1", code: "SCENTA10", type: "percent", value: 10, status: "active" },
  { id: "c-2", code: "BOGO", type: "bxgy", value: 1, status: "draft" }
];

export const themeSections: ThemeSection[] = [
  { id: "hero", label: "Hero Banner", isVisible: true },
  { id: "bestsellers", label: "Best Sellers", isVisible: true },
  { id: "newin", label: "New In", isVisible: true },
  { id: "offers", label: "Offers", isVisible: true },
  { id: "signature", label: "Signature Luxury", isVisible: true },
  { id: "quiz", label: "Scent Quiz", isVisible: false },
  { id: "newsletter", label: "Newsletter", isVisible: false }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which mood fits your scent?",
    promptAr: "أي مزاج يناسب عطرك؟",
    options: [
      { label: "Warm and cozy", labelAr: "دافئ ومريح", score: 2, note: "amber" },
      { label: "Bright and airy", labelAr: "منعش وخفيف", score: 1, note: "floral" },
      { label: "Bold and smoky", labelAr: "قوي ومدخّن", score: 3, note: "oud" }
    ]
  },
  {
    id: "q2",
    prompt: "When do you wear fragrance most?",
    promptAr: "متى تستخدم العطر غالبًا؟",
    options: [
      { label: "Daytime", labelAr: "نهارًا", score: 1, note: "fresh" },
      { label: "Evening", labelAr: "مساءً", score: 2, note: "warm" },
      { label: "Anytime", labelAr: "أي وقت", score: 2, note: "versatile" }
    ]
  }
];
