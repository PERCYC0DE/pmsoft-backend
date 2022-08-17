import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Information email
  const info = await transport.sendMail({
    from: "PMSoft <admin@pmsoft.com>",
    to: email,
    subject: "PMSoft - Confirma tu cuenta",
    text: "Comprueba tu cuenta en PMSoft",
    html: `<p>Hola: ${name}, comprueba tu cuenta en PMSoft</p>
    <p>Tu cuenta ya esta casi lista, por favor compruebala mediante el siguiente enlace:</p>
    <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Comprueba tu cuenta</a>
    <p>Si no creaste esta cuenta, por favor ignora el mensaje</p>
    `,
  });
};

export const emailResetPassword = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Information email
  const info = await transport.sendMail({
    from: "PMSoft <admin@pmsoft.com>",
    to: email,
    subject: "PMSoft - Restablece tu contraseña",
    text: "Restablece tu contraseña en PMSoft",
    html: `<p>Hola: ${name}, has solicitado restablecer tu contraseña en PMSoft</p>
    <p>Sigue el siguiente enlace para cambiar tu contraseña:</p>
    <a href="${process.env.FRONTEND_URL}/recovery-password/${token}">Restablecer contraseña</a>
    <p>Si no solicitaste este email, por favor ignora el mensaje</p>
    `,
  });
};
