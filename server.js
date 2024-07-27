const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  const messageText = message.body.toLowerCase().trim();

  if (messageText === "ping") {
    message.reply("pong");
  } else if (messageText === "hello") {
    message.reply("Hi there! How can I help you today?");
  } else if (messageText === "help") {
    message.reply(
      "Here are some commands you can use:\n1. 'ping' - Check if the bot is online.\n2. 'hello' - Greet the bot.\n3. 'joke' - Hear a joke.\n4. 'quote' - Get an inspirational quote.\n5. 'bye' - Exit."
    );
  } else if (messageText === "joke") {
    axios
      .get("https://official-joke-api.appspot.com/random_joke")
      .then((response) => {
        console.log(response);
        const joke = `${response.data.setup} - ${response.data.punchline}`;
        message.reply(joke);
      })
      .catch((error) => {
        console.error("Error fetching joke:", error);
        message.reply(
          "Sorry, I couldn't fetch a joke at the moment. Please try again later."
        );
      });
  } else if (messageText === "quote") {
    axios
      .get("https://api.quotable.io/random")
      .then((response) => {
        console.log(response);
        const quote = `"${response.data.content}" - ${response.data.author}`;
        message.reply(quote);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        message.reply(
          "Sorry, I couldn't fetch a quote at the moment. Please try again later."
        );
      });
  } else if (messageText === "bye") {
    message.reply("Goodbye! Have a great day!");
  } else {
    message.reply(
      "I'm sorry, I didn't understand that command. Type 'help' to see what I can do."
    );
  }
});

client.initialize();
