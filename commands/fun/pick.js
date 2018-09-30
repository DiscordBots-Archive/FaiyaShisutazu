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

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const options = args.join(" ");
      if (options.length < 2) return response.edit("Invalid command usage, you must supply text.");
      const list = options.split(",");
      if (list.length < 2 || list[1] === "") return response.edit("Invalid command usage, you must supply at least two items to pick from.");
      
      setTimeout(
        () => response.edit(`Requested by **${message.author.tag}** ❯ \`${message.content}\` | I have decided upon **${list[Math.floor(Math.random()*list.length)].trim()}**!`),
        Math.random() * (1 - 5) + 1 * 5000
      );
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Pick;