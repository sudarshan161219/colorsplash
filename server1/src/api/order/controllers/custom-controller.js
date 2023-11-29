const { createCoreController } = require("@strapi/strapi").factories;
const { instance } = require("../../../../utils/paymentInstance");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async controlleraction(ctx) {
    try {
      if (!ctx.request.body || typeof ctx.request.body.price !== "number") {
        ctx.status = 400;
        ctx.body = { message: "Invalid request body" };
        return;
      }

      const { price } = ctx.request.body;
      const options = {
        amount: Number(price * 100),
        currency: "INR",
      };

      // Assuming 'instance' is a defined object for creating orders
      const order = await instance.orders.create(options);

      ctx.status = 200;
      ctx.body = { order: order };
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      ctx.body = { message: "Internal server error" };
    }
  },

  async paymentverification(ctx) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      ctx.request.body;

    // const userId = ctx.state.user.id; // Assuming user ID is in the state object

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      try {
        const orderService = strapi.services.order;
        console.log(orderService);
        // const newOrder = await orderService.create({
        //   user: userId,
        //   razorpay_payment_id,
        //   razorpay_order_id,
        //   razorpay_signature,
        // });

        // console.log(newOrder);
        // const recipientEmail = 'sudarshanhosalli90956@gmail.com';
        // await strapi.plugins["email"].services.email.send({
        //   to: recipientEmail,
        //   from: "godhustler90956@gmail.com",
        //   subject: "Payment Confirmation",
        //   text: "Thank you for your payment. Your payment was successful.",
        // });

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "godhustler90956@gmail.com", // Replace with your email
            pass: "jndj zwek psui ltvp", // Replace with your email password
          },
        });

        const mailOptions = {
          from: "godhustler90956@gmail.com",
          to: 'sudarshanhosalli90956@gmail.com',
          subject: "Payment Confirmation",
          text: "Thank you for your payment. Your payment was successfull.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Email sending failed:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });

        ctx.redirect(
          `http://localhost:5173/success-page?reference=${razorpay_payment_id}`
        );
      } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.send({ message: "Internal server error" });
      }
    } else {
      ctx.response.status = 400;
      ctx.send({ message: "Something went wrong, please try again later!" });
    }
  },

  async getkeys(ctx) {
    try {
      ctx.send({
        key: process.env.RAZOR_KEY_ID,
      });
    } catch (error) {
      console.error(error);
      ctx.response.status = 500;
      ctx.send({ message: "Internal server error" });
    }
  },
}));
