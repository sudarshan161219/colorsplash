module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/checkout",
      handler: "custom-controller.controlleraction",
    },
    {
      method: "POST",
      path: "/orders/verification",
      handler: "custom-controller.paymentverification",
    },
    {
      method: "GET",
      path: "/orders/get_key",
      handler: "custom-controller.getkeys",
    },
  ],
};
