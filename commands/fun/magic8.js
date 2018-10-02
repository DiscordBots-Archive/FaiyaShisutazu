const Social = require("../../structures/Social.js");

class Magic8 extends Social {

  constructor(...args) {
    super(...args, {
      name: "magic8",
      description: "Answers a question, magic 8 ball style.",
      category: "4. Fun",
      usage: "magic8 [question]?",
      extended: "This returns an answer to any of your question.",
      cost: 10,
      cooldown: 10,
      aliases: ["8", "8ball"]
    });
    this.answers = ["Maybe.", "Certainly not.", "I hope so.", "**YESS!**", "**Yass!**", "How about **NAW**?", "Fuhgeddaboudit.", "LOL not even worth asking", "Hell no!", "Never!", "Pfft~ No..", "I would rather not say.", "Who cares?", "Possibly.", "Never, ever, ever.", "There is a small chance."];
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (!message.content.endsWith("?")) return message.channel.send("That does not look like a question, (Hint: End your question with a `?`.)");
      if (!args) return message.channel.send("A-a real baka...?!! You need to actually ask a question... yes? No?!");

      setTimeout( async () => await message.channel.send(`${this.answers[Math.floor(Math.random() * this.answers.length)]}`), Math.random() * (1 - 5) + 1 * 2000);
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Magic8;