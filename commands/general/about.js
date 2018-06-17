const Command = require(`${process.cwd()}/base/Command.js`);

class About extends Command {

  constructor(client) {
    super(client, {
      name: "about",
      description: "Tìm hiểu về em tí nha!",
      category: "1. General",
      usage: "about",
      extended: "Chỉ là command để giới thiệu thui mà...",
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
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = About;