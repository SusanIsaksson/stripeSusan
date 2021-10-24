require('dotenv').config('.env');

const secretKey = process.env.STRIPE_SECRET_KEY;

const fs = require('fs');
const express = require('express');
const server = express();
const stripe = require('stripe')(secretKey);
const port = 3000
const jsonDB = {};

server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/* // ev för spar i URL
  server.use('/', async (req, res) => {
  let pathname = parseurl(req).pathname;
  req.session.views[pathname] = (req.session.views[pathname] || 0) +  1;
}); */

/* server.get('/api/session/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retreive(req.query.session.id);
  //const customer = await stripe.customers.retreive(session.customer);

  res.send('<html><body><h1>Thanks for your order!</h1></body></html>');
}); */

/*server.get('/api/admin/purchases', async (req, res) => {
  //hämtar filen nedan
  res.status(200).json({jsonDB})
}); */

/*server.get('/api/session/success', async (req, res) => {
  const sessionId = await stripe.checkout.sessions.retrieve(req.query.sessionId);

  res.send('<html><body><h1>Thanks for you order!</h1></body></html>');
  console.log(sessionId)
}) */

server.get('/api/session', (req, res) => {
  const sessionId = req.query.id;
  res.send({ 'session': sessionId })
});
  /* let raw = fs.readFileSync("orders.json")
  let newSessionId = JSON.parse(raw)
  res.json(newSessionId) 
}); */

server.post('/api/session', (req, res) => {
  const sessionId = req.body.id

  res.send({'session': sessionId})
})

server.post('/api/session/new', async (req, res) => {
  //skapar en sessiont 
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body.line_items,
    mode: "payment",
    metadata: {

    },
    success_url: 'http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}',
    //success_url: "http://localhost:3000/session/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000"
  });
  //console.log(session)
  res.status(200).json({ id: session.id })
    
});

server.post('/api/session/verify', async (req, res) => {
  const sessionId = req.body.sessionId;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(session)

  res.status(200).json({ id: session.id })
  console.log(session) 

 /*  try {
    let raw = fs.readFileSync("orders.json")
    let newSessionId = JSON.parse(raw)
    newSessionId.push(req.body.session)
    fs.writeFileSync("orders.json", JSON.stringify(newSessionId))
    res.json(true)
  } catch(err) {
    console.error("error newSessionId")
    res.status(500).json(false)
  } */
  if (session.payment.status == 'paid') {
    const key = session.payment_intent;
    //const paymentIntent = await stripe.paymentIntent.retreive(key);
    //console.log(paymentIntent)
  
    if(!jsonDB[key]) {
      jsonDB[key] = {
        amount: session.amount_total /100,
        customerId: session.customer,
        //customerEmail: session.customer_details.email,
        metadata: session.metadata
      };
    }
    res.status(200).json({ paid: true });
  } else {
    res.status(200).json({ paid: false });
  } 

  //SPARA I JSON
  const key = session.payment_intent;
  //const paymentIntent = await stripe.paymentIntent.retrieve(key);
  //console.log(paymentIntent)

});

server.listen(port, () => {
  console.log(`Tjooho - servern är igång på port: ` + port)
})