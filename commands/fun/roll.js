const Social = require("../../structures/Social.js");

class Roll extends Social {

  constructor(...args) {
    super(...args, {
      name: "roll",
      description: "Rolls a random number from 1 to 100 unless specified",
      category: "4. Fun",
      usage: "roll [min] [max]",
      extended: "This returns a random number from 1-100 by default if you didn't specify a range.",
      cost: 5,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const min = (args[0] === undefined) ? 1 : Math.ceil(args[0]);
      const max = (args[1] === undefined) ? 100 : Math.floor(args[1]);
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      
      response.edit(`Requested by **${message.author.tag}** ❯ \`${message.content}\` | You rolled **${number}**!`);
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Roll;