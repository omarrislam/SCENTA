"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCollection = exports.listCollections = exports.createCollection = void 0;
const Collection_1 = require("../../models/Collection");
const response_1 = require("../../utils/response");
const createCollection = async (req, res, next) => {
    try {
        const collection = await Collection_1.Collection.create(req.body);
        return (0, response_1.sendSuccess)(res, collection, 201);
    }
    catch (error) {
        return next(error);
    }
};
exports.createCollection = createCollection;
const listCollections = async (_req, res, next) => {
    try {
        const collections = await Collection_1.Collection.find();
        return (0, response_1.sendSuccess)(res, collections);
    }
    catch (error) {
        return next(error);
    }
};
exports.listCollections = listCollections;
const updateCollection = async (req, res, next) => {
    try {
        const collection = await Collection_1.Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return (0, response_1.sendSuccess)(res, collection);
    }
    catch (error) {
        return next(error);
    }
};
exports.updateCollection = updateCollection;
