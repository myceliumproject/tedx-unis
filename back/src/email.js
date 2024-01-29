import nodemailer from "nodemailer";

/**
 * @typedef {import("nodemailer/lib/mailer").Mail} Mail
 */

const emailpw = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "zmyceliumproject@gmail.com",
    pass: emailpw,
  },
  secure: true,
});

export function emailSpecs(to, subject, html) {
  return {
    from: "zmyceliumproject@gmail.com",
    to: to,
    subject: subject,
    html: html,
  };
}

/**
 *
 * @param {string | string[]} to
 * @param {string} subject
 * @param {string | Buffer} html
 * @param {Mail.Options["attachments"]} attachments
 */
export async function sendEmail(to, subject, html, attachments = []) {
  /** @type {Mail.Options} */
  const specs = {
    from: "zmyceliumproject@gmail.com",
    to: to,
    subject: subject,
    html: html,
    attachments: attachments,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(specs, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
