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

// Alternative chatbot endpoint with raw http call
app.post('/rawbot', (req, res) => {
  let body = req.body;
  let token = body.token;
  let enduser_text = body.payload.text;
  let tiledesk_request = body.payload.request;
  let project_id = body.payload.id_project;
  let request_id = tiledesk_request.request_id
  let bot_name = tiledesk_request.department.bot.name;
  
  // immediatly reply to TILEDESK
  res.status(200).send({"success":true});

  // Reply service is asynchronous.
  // Once you get the request token you can write to this
  // conversation as many times as you want
  
  const endpoint =
    "https://api.tiledesk.com/v2";
  let msg = {
    "text": "Hello from chatbot!",
    "type": "text",
    "senderFullname": bot_name // you can change the chatbot name here
  }
  
  request({
    url: `${endpoint}/${project_id}/requests/${request_id}/messages`,
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': 'JWT '+token
    },
    json: msg,
    method: 'POST'
    },
    function(err, res, resbody) {
      console.log("Message sent.")
    }
  );
})

app.listen(3000, () => {
  console.log('server started');
});