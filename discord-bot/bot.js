require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.BOT_TOKEN);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "Hello") {
    message.channel.send("Hello");
  }

  if (message.content === "Love U") {
    message.react("❤️");
  }

  if (message.content === "!mod-me") modUser(message.member);
});

function modUser(user) {
  user.roles.add("1251257598750097448");
}
