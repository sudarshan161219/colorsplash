const sendPaymentConfirmationEmail = async (ctx, recipientEmail) => {
    try {
      await strapi.plugins['email'].services.email.send({
        to: recipientEmail,
        from: 'colorsplash1005@gmail.com',
        subject: 'Payment Confirmation',
        text: 'Thank you for your payment. Your payment was successful.',
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  };
  