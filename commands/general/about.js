const Command = require(`${process.cwd()}/base/Command.js`);

class About extends Command {

  constructor(client) {
    super(client, {
      name: "about",
      description: "Returns a general description about me",
      category: "01. General",
      usage: "about",
      extended: "This returns a description/introduction about me.",
      cost: 0,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      message.channel.send(this.client.responses.aboutMessages.random()
        .replace("{{user}}", `${message.author.tag}`)
        .replace("{{prefix}}", `${message.settings.prefix}`));
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = About;