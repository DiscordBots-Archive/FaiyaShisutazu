const Social = require(`${process.cwd()}/base/Social.js`);

class Roll extends Social {

  constructor(client) {
    super(client, {
      name: "roll",
      description: "Rolls a random number from 1 to 100 unless specified",
      category: "05. Random generators, raffles & votes",
      usage: "roll [min] [max]",
      extended: "This returns a random number from 1-100 by default if you didn't specify a range.",
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
      const min = (args[0] === undefined) ? 1 : Math.ceil(args[0]);
      const max = (args[1] === undefined) ? 100 : Math.floor(args[1]);
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      
      response.edit(`🌺 **${message.author.tag}** ❯ ${message.content} | You rolled **${number}**!`);
    } catch (error) {
      response.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Roll;