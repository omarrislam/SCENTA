import sgMail from "@sendgrid/mail";
import { env } from "../config/env";

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
}

const sendConsole = async ({ to, subject, text }: EmailPayload) => {
  console.info("[email]", { to, subject, text });
};

const sendSendgrid = async ({ to, subject, text }: EmailPayload) => {
  if (!env.SENDGRID_API_KEY || !env.SENDGRID_FROM) {
    throw new Error("SendGrid config missing");
  }
  sgMail.setApiKey(env.SENDGRID_API_KEY);
  await sgMail.send({
    to,
    from: env.SENDGRID_FROM,
    subject,
    text
  });
};

export const sendEmail = async (payload: EmailPayload) => {
  if (env.EMAIL_PROVIDER === "sendgrid") {
    return sendSendgrid(payload);
  }
  return sendConsole(payload);
};
