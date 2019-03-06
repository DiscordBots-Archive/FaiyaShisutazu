const Social = require("../../structures/Social.js");

class Pick extends Social {

  constructor(...args) {
    super(...args, {
      name: "pick",
      description: "Picks one out of a list",
      category: "4. Fun",
      usage: "pick <option1>, <option2>, <option3>, <etc>",
      extended: "This returns a item in a list you provided, separate the items by commas.",
      cost: 5,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const options = args.join(" ");
      if (options.length < 2) return replyMessage.edit("Invalid command usage, you must supply text.");
      const list = options.split(",");
      if (list.length < 2 || list[1] === "") return replyMessage.edit("Invalid command usage, you must supply at least two items to pick from.");
      
      setTimeout( async () => await replyMessage.edit(`Requested by **${message.author.tag}** | I have decided upon **${list[Math.floor(Math.random()*list.length)].trim()}**!`),
        Math.random() * (1 - 5) + 1 * 5000
      );
    } catch (error) {
      await message.channel.send(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Pick;