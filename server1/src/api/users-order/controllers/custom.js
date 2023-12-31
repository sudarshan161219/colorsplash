const { createCoreController } = require("@strapi/strapi").factories;
const { instance } = require("../../../../utils/paymentInstance");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

module.exports = createCoreController(
  "api::users-order.users-order",
  ({ strapi }) => ({
    async controlleraction(ctx) {
      try {
        if (!ctx.request.body || typeof ctx.request.body.price !== "number") {
          ctx.status = 400;
          ctx.body = { message: "Invalid request body" };
          return;
        }

        const { price } = ctx.request.body;

        const options = {
          amount: price * 100,
          currency: "INR",
        };

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
      const serializedAdditionalData = ctx.request.query.data;

      try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
          .update(body.toString())
          .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
          const decodedAdditionalData = decodeURIComponent(
            serializedAdditionalData
          );
          const additionalData = JSON.parse(decodedAdditionalData);

          await strapi.service("api::users-order.users-order").create({
            data: {
              razorpay_payment_id: razorpay_payment_id,
              razorpay_order_id: razorpay_order_id,
              razorpay_signature: razorpay_signature,
              payment_method: additionalData.data.payment_method,
              user_address: additionalData.data.user_address,
              delivered: additionalData.data.delivered,
              order_canceled: additionalData.data.order_canceled,
              user_Id: additionalData.data.user_Id,
              user_email: additionalData.data.user_email,
              user_name: additionalData.data.user_name,
              user_phone: additionalData.data.user_phone,
              products_data: additionalData.data.products_data,
            },
          });

          // return { orderService };
          ctx.redirect(
            `http://localhost:5173/success-page?reference=${razorpay_payment_id}`
          );
        } else {
          ctx.response.status = 400;
          ctx.send({ message: "Invalid payment signature. Please try again!" });
        }
      } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.send({ message: "Internal server error" });
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
  })
);
