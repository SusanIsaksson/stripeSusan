require('dotenv').config('.env');

const secretKey = process.env.STRIPE_SECRET_KEY;

const express = require('express');
const server = express();
const stripe = require('stripe')(secretKey);
const port = 3000

server.use(express.static('public'));
server.use(express.json());

server.get('/api', (req, res) => {
  res.json("server_get")
})

server.post('/api/session/new', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.line_items,
        mode: "payment",
        success_url: "http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000"
    });
    res.status(200).json({ id: session.id })

});

server.listen(port, () => {
  console.log(`Tjooho - servern är igång på port: ` + port)
})