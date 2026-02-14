"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTheme = exports.getTheme = void 0;
const ThemeConfig_1 = require("../../models/ThemeConfig");
const response_1 = require("../../utils/response");
const getTheme = async (req, res, next) => {
    try {
        const theme = await ThemeConfig_1.ThemeConfig.findOne({ locale: req.query.locale ?? "en" });
        return (0, response_1.sendSuccess)(res, theme);
    }
    catch (error) {
        return next(error);
    }
};
exports.getTheme = getTheme;
const updateTheme = async (req, res, next) => {
    try {
        const theme = await ThemeConfig_1.ThemeConfig.findOneAndUpdate({ locale: req.body.locale }, req.body, { new: true, upsert: true });
        return (0, response_1.sendSuccess)(res, theme);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateTheme = updateTheme;
