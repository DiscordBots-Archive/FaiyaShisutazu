const Social = require(`${process.cwd()}/base/Social.js`);

class Daily extends Social {

  constructor(client) {
    super(client, {
      name: "daily",
      description: "Claims your daily points",
      category: "09. Social",
      usage: "daily",
      extended: "This redeems your guilds daily bonus.",
      cost: 0,
      cooldown: 0,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    try {
      await this.usrDay(message);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Daily;