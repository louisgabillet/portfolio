import { fail, type Actions } from '@sveltejs/kit';
import { SECRET_KEY, SENDGRID_API_KEY } from '$env/static/private';
import { PUBLIC_EMAIL } from '$env/static/public';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import type { ToastContent, ToastOptions } from '$lib/toast/types';

type Data = {
    success: boolean,
    send_notification: boolean,
    content: ToastContent,
    opts: ToastOptions,
}

const MailSchema = z.object({
    //cc: z.union([
    //    z.literal( '' ),
    //    z.string()
    //    .email("format de l'addresse email invalide"),
    //]),
    subject: z
        .string({ required_error: `objet obligatoire` })
        .min(1, `object obliqatoire`)
        //.max(78, "Votre sujet est trop long (max 78 caractères)")
        .trim(),
    email: z
        .string({ required_error: `addresse email obligatoire` })
        .min(1, `addresse email obligatoire`)
        //.max(64)
        .email(`format de l'addresse email invalide`),
    content: z
        .string({ required_error: `contenu de l'email manquant` })
        .min(1, `contenu de l'email manquant`)
        .trim(),
    token: z
        .string({ required_error: `reCAPTCHA token manquant` })
        .min(1, "reCAPTCHA token manquant"),
})
type Mail = z.infer<typeof MailSchema>;

export const actions: Actions = {
    email: async ({ request }) => {

        const formData = Object.fromEntries(await request.formData()) as Mail;

        try {
            MailSchema.parse(formData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const { fieldErrors: errors } = err.flatten();
                const { token, ...rest } = formData;
                return fail(400, { sucess: false, data: rest, errors });
            }
        }

        //const { cc, subject, email, content, token } = formData;
        const { subject, email, content, token } = formData;

        const data: Data = {
            success: false,
            send_notification: true,
            content: {
                appName: 'Mail',
                title: '',
                message: '',
            },
            opts: {}
        }

        if (!token) {
            data.content.title = 'Token reCAPTCHA manquant';
            data.content.message = `Nous ne pouvons pas prouver que vous êtes humain. Veuillez réessayez ultérieuremment.`;
            data.opts.icon = '❓'
            return fail(400, data);
        }

        try {
            const captchaVerification = await fetch(
                `https://www.recaptcha.net/recaptcha/api/siteverify`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `secret=${SECRET_KEY}&response=${token}`,
                }
            );
            const captchaData = await captchaVerification.json();

            if (!captchaData.success) {
                data.content.title = 'Verification reCAPTCHA échouée';
                data.content.message = 'Votre vérification reCAPTCHA a échouée. Veuillez réessayer ultérieuremment.';
                data.opts.icon = '🚫'
                return fail(400, data); 
            }

            const scoreThreshold: number = 0.5;
            const score = captchaData.score;

            if (score < scoreThreshold) {
                data.content.title = 'Activité suspecte';
                data.content.message = 'Vos actions ont été jugées suspecte (🤖). Veuillez réessayez ultérieuremment.';
                data.opts.icon = '🚨'
                return fail(403, data);
            }

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
                to: PUBLIC_EMAIL,
                //cc: cc,
                subject: subject,
                text: content,
                html: `<b>Email From : ${email} <br> Subject: ${subject}</b> <br> ${content}`,
                replyTo: email,
            }

            try {
                //await transporter.sendMail(mailOptions);
                data.success = true;
                data.content.title = 'Email envoyé';
                data.content.message = `Votre email m'a bien été envoyé. Merci 🙏`;
                data.opts.icon = '🎉'
                return data;
            } catch {
                data.content.title = "Échec de l'envoi";
                data.content.message = "L'envoi de votre email n'a pas pu être effectué. Veuillez réessayez ultérieuremment.";
                return fail(400, data);
            }

        } catch {
            data.content.title = 'Erreur du serveur';
            data.content.message = "Le serveur à connu une erreur. Veuillez réessayez ultérieuremment.";
            data.opts.icon = '💥'
            return fail(500, data);
        }

    }
}

