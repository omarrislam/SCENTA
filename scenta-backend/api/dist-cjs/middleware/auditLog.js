"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = void 0;
const auditLog = (req, _res, next) => {
    if (req.user?.role === "admin") {
        console.info("[audit]", {
            path: req.path,
            method: req.method,
            adminId: req.user.id,
            time: new Date().toISOString()
        });
    }
    next();
};
exports.auditLog = auditLog;
