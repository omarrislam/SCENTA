"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragranceAttrsSchema = void 0;
const mongoose_1 = require("mongoose");
// Fragrance-specific product attributes.
// To reuse this template for a different store type, delete this file and
// remove the fragranceAttrs field from the Product model.
exports.FragranceAttrsSchema = new mongoose_1.Schema({
    gender: { type: String, enum: ["men", "women", "unisex"] },
    concentration: { type: String, default: "extrait" },
    bottleType: { type: String, default: "spray" },
    notes: {
        top: [String],
        middle: [String],
        base: [String]
    },
    season: [String],
    occasion: [String],
    longevity: String,
    sillage: String
}, { _id: false });
