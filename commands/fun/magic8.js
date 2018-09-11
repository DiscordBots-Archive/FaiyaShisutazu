const answers = ["YESS!", "Yass!", "How about NAW?", "Nou nka", "Yes IK!!!", "Never!", "No ik!", "LUL how about Đ**?!", "Pfft. No nha!", "............", "Hmm... Hông biết.."];
const Social = require(`${process.cwd()}/base/Social.js`);

class Magic8 extends Social {

  constructor(client) {
    super(client, {
      name: "magic8",
      description: "Answers a question, magic 8 ball style.",
      category: "04. Fun",
      usage: "magic8 [question]?",
      extended: "This returns an answer to any of your question.",
      cost: 10,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["8", "8ball"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (!message.content.endsWith("?")) return message.response(undefined, "That does not look like a question, (Hint: End your question with a `?`.)");
      if (!args) return message.response(undefined, "You need to actually ask a question...");
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      
      setTimeout(() => response.edit(`${answers[Math.floor(Math.random() * answers.length)]}`), Math.random() * (1 - 5) + 1 * 2000);
    } catch (error) {
      message.channel.send(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Magic8;