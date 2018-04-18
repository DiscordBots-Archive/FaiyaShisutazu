const answers = ["YESS!", "Yass!", "How about NAW?", "Nou nka", "Yes IK!!!", "Never!", "No ik!", "LUL how about Đ**?!", "Pfft. No nha!", "............", "Hmm... Hông biết.."];
const Social = require(`${process.cwd()}/base/Social.js`);

class Magic8 extends Social {
  constructor(client) {
    super(client, {
      name: "magic8",
      description: "Answers a question, magic 8 ball style.",
      usage: "magic8 <question>?",
      category: "4. Fun",
      extended: "This Social will answer any question given to it in the style of a magic 8 ball.",
      cost: 2,
      aliases: ["8", "8ball"],

    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (!message.content.endsWith("?")) return message.response(undefined, "That does not look like a question, (hint, end your question with a `?`.)");
      if (!args) return message.response(undefined, "You need to actually ask a question...");
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.guild.me.displayName}** is thinking...`);
      setTimeout(
        () => msg.edit(`${answers[Math.floor(Math.random() * answers.length)]}`),
        Math.random() * (1 - 5) + 1 * 2000
      );
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Magic8;