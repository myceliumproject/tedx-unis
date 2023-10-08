import nodemailer from 'nodemailer';

const emailpw = process.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
       auth: {
            user: 'zmyceliumproject@gmail.com',
            pass: emailpw,
         },
    secure: true,
    });

export function emailSpecsNoAttachment(to: string, subject: string, text: string) {
    return {
        from: 'zmyceliumproject@gmail.com', 
        to: to, 
        subject: subject, 
        text: text
    }
}

export function emailSPecsWAttachment(to: string, subject: string, text: string, attachments: []) {
    return {
        from: 'zmyceliumproject@gmail.com', 
        to: to, 
        subject: subject, 
        text: text,
        attachments: attachments
    }
}