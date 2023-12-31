module.exports = {
  routes: [
    {
      method: "POST",
      path: "/user_orders/checkout",
      handler: "custom.controlleraction",
    },
    {
      method: "POST",
      path: "/user_orders/verification",
      handler: "custom.paymentverification",
    },
    {
      method: "GET",
      path: "/user_orders/get_key",
      handler: "custom.getkeys",
    },
  ],
};
