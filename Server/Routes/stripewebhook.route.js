const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Payment = require("../Models/Payment");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔐 Utiliser la clé de signature depuis le dashboard Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("⚠️  Webhook signature verification failed.");
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Stocker le paiement dans MongoDB
        try {
            const newPayment = new Payment({
                stripeSessionId: session.id,
                courseId: session.metadata.courseId,
                userId: session.metadata.userId,
                email: session.customer_email,
                amount: session.amount_total / 100, // montant en euros
                status: session.payment_status
            });

            await newPayment.save();
            console.log("✅ Paiement enregistré avec succès dans MongoDB !");
        } catch (err) {
            console.error("❌ Erreur lors de l’enregistrement du paiement :", err.message);
        }
    }


    res.status(200).end();
});

router.post("order/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("⚠️  Webhook signature verification failed.");
        return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata.order_id;

        await Order.findByIdAndUpdate(orderId, { paymentStatus: "payé" });
        console.log("✅ Paiement reçu pour la commande :", orderId);
    }

    res.status(200).json({ received: true });
});
  

module.exports = router;
