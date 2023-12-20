const { createCoreController } = require("@strapi/strapi").factories;
const { instance } = require("../../../../utils/paymentInstance");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async controlleraction(ctx) {
    try {
      if (!ctx.request.body || typeof ctx.request.body.price !== "number") {
        return ctx.badRequest("Invalid request body");
      }

      const { price } = ctx.request.body;
      const options = {
        amount: Number(price * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);

      return ctx.send({ order });
    } catch (error) {
      strapi.log.error(`Error in create order: ${error}`);
      return ctx.internalServerError("Internal server error");
    }
  },

  async paymentverification(ctx) {
    try {
      console.log('Request body:', ctx.request.body);

      // @ts-ignore
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = ctx.request.body || {};

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return ctx.badRequest("Invalid signature");
      }

      const newOrder = await strapi.services.order.create({
        user: ctx.state.user.id, 
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      console.log("New order:", newOrder);

      // Send an email confirmation
      const recipientEmail = "sudarshanhosalli90956@gmail.com";
      await strapi.plugins.email.services.email.send({
        to: recipientEmail,
        from: "godhustler90956@gmail.com",
        subject: "Payment Confirmation",
        text: "Thank you for your payment. Your payment was successful.",
      });

      // Redirect to the success page
      ctx.redirect(`http://localhost:5173/success-page?reference=${razorpay_payment_id}`);
    } catch (error) {
      strapi.log.error(`Error in payment verification: ${error}`);
      return ctx.internalServerError("Internal server error");
    }
  },

  async getkeys(ctx) {
    try {
      return ctx.send({
        key: process.env.RAZOR_KEY_ID,
      });
    } catch (error) {
      strapi.log.error(`Error in get keys: ${error}`);
      return ctx.internalServerError("Internal server error");
    }
  },
}));
