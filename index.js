require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  try {
    // Dont respond to yourself or other bots
    if (message.author.bot) return;

    console.log(message.content);
    // message.reply(`You said: ${message.content} `);

    const gptResponse = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `${message.author.username}:${message.content}`,
      temperature: 0,
      max_tokens: 60,
      maximum_length: 300,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["You:"],
    });

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);

console.log("ChatGPT Bot is Online on Discord.");
