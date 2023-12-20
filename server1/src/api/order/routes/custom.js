module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/checkout",
      handler: "custom.controlleraction",
    },
    {
      method: "POST",
      path: "/orders/verification",
      handler: "custom.paymentverification",
    },
    {
      method: "GET",
      path: "/orders/get_key",
      handler: "custom.getkeys",
    },
  ],
};
