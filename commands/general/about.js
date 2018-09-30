const Command = require("../../structures/Command.js");

class About extends Command {

  constructor(...args) {
    super(...args, {
      name: "about",
      description: "Returns a general description about me",
      category: "1. General",
      usage: "about",
      extended: "This returns a description/introduction about me.",
      cost: 0,
      cooldown: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    try {
      await response.edit(message.client.responses.aboutMessages.random()
        .replaceAll("{{user}}", `${message.author.tag}`)
        .replaceAll("{{prefix}}", `${message.settings.prefix}`));
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = About;