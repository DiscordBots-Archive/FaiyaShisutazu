const Social = require(`${process.cwd()}/base/Social.js`);

class Pick extends Social {

  constructor(client) {
    super(client, {
      name: "pick",
      description: "Picks one out of a list",
      category: "05. Random generators, raffles & votes",
      usage: "pick <option1>, <option2>, <option3>, <etc>",
      extended: "This returns a item in a list you provided, separate the items by commas.",
      cost: 5,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    
    try {
      const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const options = args.join(" ");
      if (options.length < 2) return response.edit("Invalid command usage, you must supply text.");
      const list = options.split(",");
      if (list.length < 2 || list[1] === "") return response.edit("Invalid command usage, you must supply at least two items to pick from.");
      
      setTimeout(
        () => response.edit(`🌺 **${message.author.tag}** ❯ ${message.content} | I have decided upon **${list[Math.floor(Math.random()*list.length)].trim()}**!`),
        Math.random() * (1 - 5) + 1 * 5000
      );
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Pick;