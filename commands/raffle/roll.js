const Social = require(`${process.cwd()}/base/Social.js`);

class Roll extends Social {
  constructor(client) {
    super(client, {
      name: "roll",
      description: "Roll a random number from 1 to 100.",
      category: "5. Random raffles & votes",
      usage: "roll [min] [max]",
      extended: "This command will roll a random number from 1-100 by default if you don't provide a range",
      cost: 2,
      aliases: ["random"],
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
        const min = (args[0] === undefined) ? 1 : Math.ceil(args[0]);
        const max = (args[1] === undefined) ? 100 : Math.floor(args[1]);
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        await message.channel.send(`Your number is: **${number}**`);
    } catch (error) {
        this.client.logger.error(error);
    }
  }
}

module.exports = Roll;