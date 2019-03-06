const Social = require("../../structures/Social.js");

class Daily extends Social {

  constructor(...args) {
    super(...args, {
      name: "daily",
      description: "Claims your daily points",
      category: "7. Social",
      usage: "daily",
      extended: "This redeems your guilds daily bonus.",
      hidden: false,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      await replyMessage.delete();
      await this.usrDay(message);
    } catch (error) {
      message.client.console.error(error);
    }
  }
}

module.exports = Daily;