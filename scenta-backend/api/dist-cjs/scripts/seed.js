"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const Content_1 = require("../models/Content");
const Coupon_1 = require("../models/Coupon");
const Collection_1 = require("../models/Collection");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const Quiz_1 = require("../models/Quiz");
const quizDefaults_1 = require("../data/quizDefaults");
const seedProducts = [
    {
        slug: "silk-amber",
        title: "Silk Amber",
        description: "A luminous amber with clean musk and saffron glow.",
        notes: { top: ["Amber", "Musk", "Saffron"] },
        flags: { isFeatured: true, isBestSeller: true },
        images: [{ url: "/images/amber-1.svg" }, { url: "/images/amber-2.svg" }],
        variants: [
            { key: "silk-amber-50", sizeMl: 50, price: 1890, stock: 12 },
            { key: "silk-amber-100", sizeMl: 100, price: 2690, stock: 6 }
        ],
        status: "published"
    },
    {
        slug: "rose-veil",
        title: "Rose Veil",
        description: "A sheer rose wrapped in pear and clean woods.",
        notes: { top: ["Rose", "Pear", "Cedar"] },
        flags: { isNew: true },
        images: [{ url: "/images/rose-1.svg" }, { url: "/images/rose-2.svg" }],
        variants: [
            { key: "rose-veil-50", sizeMl: 50, price: 1650, stock: 24 },
            { key: "rose-veil-100", sizeMl: 100, price: 2390, stock: 10 }
        ],
        status: "published"
    },
    {
        slug: "golden-oud",
        title: "Golden Oud",
        description: "Spiced oud with a honeyed trail.",
        notes: { top: ["Oud", "Honey", "Cardamom"] },
        flags: { isFeatured: true },
        images: [{ url: "/images/oud-1.svg" }, { url: "/images/oud-2.svg" }],
        variants: [
            { key: "golden-oud-50", sizeMl: 50, price: 2100, stock: 8 },
            { key: "golden-oud-100", sizeMl: 100, price: 2950, stock: 5 }
        ],
        status: "published"
    },
    {
        slug: "cedar-mist",
        title: "Cedar Mist",
        description: "Dry cedar with a whisper of bergamot.",
        notes: { top: ["Cedar", "Bergamot", "Vetiver"] },
        flags: { isNew: true },
        images: [{ url: "/images/cedar-1.svg" }, { url: "/images/cedar-2.svg" }],
        variants: [
            { key: "cedar-mist-50", sizeMl: 50, price: 1520, stock: 18 },
            { key: "cedar-mist-100", sizeMl: 100, price: 2200, stock: 9 }
        ],
        status: "published"
    },
    {
        slug: "citrus-dawn",
        title: "Citrus Dawn",
        description: "Sparkling citrus lifted by neroli.",
        notes: { top: ["Lemon", "Neroli", "Musk"] },
        flags: { isFeatured: true },
        images: [{ url: "/images/citrus-1.svg" }, { url: "/images/citrus-2.svg" }],
        variants: [
            { key: "citrus-dawn-50", sizeMl: 50, price: 1450, stock: 20 },
            { key: "citrus-dawn-100", sizeMl: 100, price: 2100, stock: 7 }
        ],
        status: "published"
    },
    {
        slug: "velvet-iris",
        title: "Velvet Iris",
        description: "Powdery iris wrapped in vanilla woods.",
        notes: { top: ["Iris", "Vanilla", "Sandalwood"] },
        flags: { isBestSeller: true },
        images: [{ url: "/images/iris-1.svg" }, { url: "/images/iris-2.svg" }],
        variants: [
            { key: "velvet-iris-50", sizeMl: 50, price: 1980, stock: 14 },
            { key: "velvet-iris-100", sizeMl: 100, price: 2750, stock: 6 }
        ],
        status: "published"
    }
];
const seedCollections = [
    {
        slug: "amber-signature",
        title: "Amber Signature",
        description: "Warm resins and smoky woods.",
        productSlugs: ["silk-amber", "golden-oud", "velvet-iris"]
    },
    {
        slug: "floral-veil",
        title: "Floral Veil",
        description: "Modern blooms with airy musk.",
        productSlugs: ["rose-veil", "cedar-mist", "citrus-dawn"]
    }
];
const seedBlogPosts = [
    {
        slug: "rituals-of-scent",
        title: "Rituals of Scent",
        excerpt: "How to layer fragrance for day and night.",
        body: "Explore layering rituals and the art of scent transitions.",
        cover: "/images/blog-rituals.svg"
    },
    {
        slug: "notes-and-memories",
        title: "Notes & Memories",
        excerpt: "Why certain notes feel like home.",
        body: "A dive into olfactive memory and emotion.",
        cover: "/images/blog-notes.svg"
    }
];
const seedPages = [
    {
        slug: "about",
        title: "About SCENTA",
        body: "SCENTA crafts contemporary fragrances with a minimal, luxe soul."
    },
    {
        slug: "returns",
        title: "Returns",
        body: "Returns accepted within 14 days for unopened products."
    },
    {
        slug: "shipping",
        title: "Shipping",
        body: "Nationwide delivery within 3-5 business days."
    },
    {
        slug: "privacy",
        title: "Privacy Policy",
        body: "We only use your data to fulfill orders and improve your experience."
    },
    {
        slug: "terms",
        title: "Terms of Service",
        body: "By using SCENTA, you agree to our store terms and policies."
    }
];
const seedCoupons = [
    { code: "SCENTA10", type: "percent", value: 10, status: "active" },
    { code: "BOGO", type: "bxgy", value: 1, status: "draft" }
];
const seedAdmin = async () => {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@scenta.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
    const adminName = process.env.ADMIN_NAME || "Admin";
    const existing = await User_1.User.findOne({ email: adminEmail });
    if (!existing) {
        const passwordHash = await bcryptjs_1.default.hash(adminPassword, 10);
        await User_1.User.create({ email: adminEmail, passwordHash, name: adminName, role: "admin" });
    }
};
const run = async () => {
    await (0, db_1.connectDatabase)();
    await Promise.all([
        Product_1.Product.deleteMany({}),
        Collection_1.Collection.deleteMany({}),
        Content_1.BlogPost.deleteMany({}),
        Content_1.Page.deleteMany({}),
        Coupon_1.Coupon.deleteMany({}),
        Quiz_1.QuizQuestion.deleteMany({})
    ]);
    await Product_1.Product.collection.dropIndexes().catch(() => undefined);
    const products = await Product_1.Product.insertMany(seedProducts);
    const productMap = new Map(products.map((product) => [product.slug, product._id]));
    const collections = seedCollections.map((collection) => ({
        slug: collection.slug,
        title: collection.title,
        description: collection.description,
        productIds: collection.productSlugs.map((slug) => productMap.get(slug)).filter(Boolean)
    }));
    await Promise.all([
        Collection_1.Collection.insertMany(collections),
        Content_1.BlogPost.insertMany(seedBlogPosts),
        Content_1.Page.insertMany(seedPages),
        Coupon_1.Coupon.insertMany(seedCoupons),
        Quiz_1.QuizQuestion.insertMany(quizDefaults_1.quizDefaults.map((question, index) => ({ ...question, position: index }))),
        seedAdmin()
    ]);
    await mongoose_1.default.disconnect();
};
run().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
});
