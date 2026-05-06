const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { plan } = JSON.parse(event.body);

  const prices = {
  basic: "price_BASIC_ID",
  standard: "price_STANDARD_ID",
  premium: "price_PREMIUM_ID"
};

    if (!prices[plan]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid plan" })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices[plan],
          quantity: 1
        }
      ],
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cancel.html`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};