const Social = require("../../../structures/Social.js");

class Deduct extends Social {

  constructor(...args) {
    super(...args, {
      name: "deduct",
      description: "Takes points away from the nominated user",
      category: "7. Social",
      usage: "deduct [@mention|userid] [amount]",
      extended: "This takes points away from a nominated user.",
      cost: 0,
      cooldown: 10,
      aliases: [],
      permLevel: "Administrator"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    await replyMessage.delete();
    if (args.length === 0) return message.response(undefined, "BAKA! You need to mention someone to punish them!");

    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response("❗", "Bot's cannot accumulate points or levels.");
      if (isNaN(args[1])) return message.response(undefined, "Not a valid amount");
      if (parseInt(args[1]) > parseInt(message.guild.members.get(user.id).score.points)) return message.response(undefined, "You cannot deduct less than their points, whatcha trying to do? reward em?");
      else if (args[1] < 1) return message.response(undefined, "You trying to deduct their air? boi don't make me slap you 👋");
      if (message.author.id === user.id) return message.response(undefined, "You cannot punish yourself, why did you even try it?");
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      message.client.console.error(error);
    }
  }
}

module.exports = Deduct;