import config from './config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_ACCOUNT,
        pass: config.GMAIL_PASS
    }
});

// Email para recuperar contraseña.
export const sendRecoveryPass = async (email, token) => {
    const link = `${config.APP_BASE}/resetpassword/${token}`;
    try {
        const res = await transporter.sendMail({
            from: config.GMAIL_ACCOUNT,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `<p>Haz click en el siguiente enlace para recuperar tu contraseña: <a href="${link}">Recuperar contraseña</a></p>`
        });
    } catch(err) {
        console.log(err);
        throw new Error("Error al enviar el correo de recuperación.")
    }
}

export default transporter;