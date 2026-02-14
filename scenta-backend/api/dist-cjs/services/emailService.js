"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const env_1 = require("../config/env");
const sendConsole = async ({ to, subject, text }) => {
    console.info("[email]", { to, subject, text });
};
const sendSendgrid = async ({ to, subject, text }) => {
    if (!env_1.env.SENDGRID_API_KEY || !env_1.env.SENDGRID_FROM) {
        throw new Error("SendGrid config missing");
    }
    mail_1.default.setApiKey(env_1.env.SENDGRID_API_KEY);
    await mail_1.default.send({
        to,
        from: env_1.env.SENDGRID_FROM,
        subject,
        text
    });
};
const sendEmail = async (payload) => {
    if (env_1.env.EMAIL_PROVIDER === "sendgrid") {
        return sendSendgrid(payload);
    }
    return sendConsole(payload);
};
exports.sendEmail = sendEmail;
