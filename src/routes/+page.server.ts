import { type Actions } from '@sveltejs/kit';
import { SECRET_KEY, SENDGRID_API_KEY } from '$env/static/private';
import nodemailer from 'nodemailer';

export const actions: Actions = {
    email: async ({ request }) => {
        // TODO -> Secure the recived values from the form (zod ?).
        const data = await request.json();

        const captchaVerification = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `secret=${SECRET_KEY}&response=${data?.token}`,
            }
        );
        const captchaData = await captchaVerification.json();

        if (captchaData.success) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: {
                    user: 'apikey',
                    pass: SENDGRID_API_KEY,
                }
            });
            
            const mailOptions = {
                from: 'Portfolio" <louisgab33@gmail.com>',
                to: 'gabillet.louis@gmail.com',
                cc: data?.cc,
                subject: data?.subject,
                text: data?.text,
                html: `<b>Email From : ${data?.from} <br> Subject: ${data?.subject}</b> <br> ${data?.text}`,
                replyTo: data?.from,
            }

            try {
                await transporter.sendMail(mailOptions);
                //return { success: true };
            } catch (err) {
                console.log('error when sending email', err);
                //return { success: false, error: err};
            }
        } else {
            console.log('ReCaptcha blocked user');
            //return { success: false};
        }
    }
}

