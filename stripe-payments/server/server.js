require("dotenv").config();

const cors = require("cors");
const express = require("express");
const Stripe = require("stripe");
const app = express();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(cors({ origin: "http://localhost:5500" }));

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "React Course" }],
  [2, { priceInCents: 20000, name: "Next JS Course" }],
]);

function formatToStripeItems(items) {
  return items.map((item) => {
    const storeItem = storeItems.get(item.id);
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: storeItem.name,
        },
        unit_amount: storeItem.priceInCents,
      },
      quantity: item.quantity,
    };
  });
}

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: formatToStripeItems(req.body.items),
      success_url: "http://localhost:5500/stripe-payments/client/success",
      cancel_url: "http://localhost:5500/stripe-payments/client/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000);
