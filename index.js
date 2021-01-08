const express = require('express');
const bodyParser = require('body-parser');
const { TiledeskChatbotClient } = require('@tiledesk/tiledesk-chatbot-client');

const app = express();
app.use(bodyParser.json());

app.post('/bot', (req, res) => {
  const tdclient = 
    new TiledeskChatbotClient({request: req, response: res});
  console.log('You asked: ' + tdclient.text);
  // instantly reply "success" to TILEDESK
  res.status(200).send({"success":true});
  // Replies are asynchronous.
  // You can reply when your data is ready
  // i.e. send asynch messages whenever an event occurs.
  let msg = {
    text: 'Cheers! You asked: ' + tdclient.text
  }
  tdclient.sendMessage(msg);
});

app.listen(3000, () => {
  console.log('server started');
});