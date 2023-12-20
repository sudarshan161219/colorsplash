"use strict";

// module.exports = {
//   async confirm(ctx) {
//     const { userId } = ctx.request.body;
//     try {
//       await strapi.plugins['email'].services.email.send({
//         to: userId,
//         from: 'colorsplash1005@gmail.com',
//         subject: 'Payment Confirmation',
//         text: 'Thank you for your payment. Your payment was successful.',
//       });
//       return {
//         message: "Purchase confirmed and success email sent",
//       };
//     } catch (error) {
//       return ctx.throw(500, "Internal server error");
//     }
//   },
// };

const nodemailer = require("nodemailer");

module.exports = {
  async confirm(ctx) {
    const { userId } = ctx.request.body;
    try {
      // Nodemailer configuration
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "colorsplash1005@gmail.com",
          pass: "Coloursplash@24",
        },
      });

      // Email options
      const mailOptions = {
        from: "yourEmail@gmail.com",
        to: userId,
        subject: "Your Purchase Confirmation",
        text: "Thank you for your purchase!",
        html: "<p>Thank you for your purchase!</p>",
      };

      // Sending email
      await transporter.sendMail(mailOptions);

      return {
        message: "Purchase confirmed and success email sent",
      };
    } catch (error) {
      return ctx.throw(error);
    }
  },
};
