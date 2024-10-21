import { type Actions } from '@sveltejs/kit';
import { SECRET_KEY } from '$env/static/private';

export const actions: Actions = {
    email: async ({ request }) => {
        const data = await request.json();
        console.log('server', data?.token);

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
        console.log(captchaData);
        if (captchaData.success) {
            console.log('LETS GOOOOOOOOOOOOOO')
        } else {
            console.log('NOOOOOOOOOOOOOOO');
        }
    }
}

