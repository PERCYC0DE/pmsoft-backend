import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "392cd9ce32e3b9",
      pass: "fe1b4eeb8f8925",
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
