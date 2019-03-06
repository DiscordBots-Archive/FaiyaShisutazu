const Social = require("../../structures/Social.js");

class Pay extends Social {

  constructor(...args) {
    super(...args, {
      name: "pay",
      description: "Gives points to someone in the guild",
      category: "7. Social",
      usage: "pay",
      extended: "This gives points to someone in the guild.",
      cost: 0,
      cooldown: 0,
      hidden: false,
      guildOnly: true,
      aliases: ["giff", "give"],
      permLevel: "User"
    });
  }
  
  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    await replyMessage.delete();
    if (args.length === 0) return message.response(undefined, "B-baka, you need to mention someone to b-be able to pay them.");
    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response("❗", "Bot's cannot accumulate points or levels.");
      if (isNaN(args[1])) return message.response(undefined, "Not a valid amount!");

      if (parseInt(args[1]) > Number.MAX_SAFE_INTEGER) return message.response(undefined, "That number is to high!");
      
      if (args[1] < 0) return message.response(undefined, "You cannot pay less than zero, whatcha trying to do? rob em?");
      else if (args[1] < 1) return message.response(undefined, "You paying 'em with air? boi don't make me slap you 👋");
      if (message.author.id === user.id) return message.response(undefined, "You cannot pay yourself, why did you even try it?");

      await this.usrPay(message, message.author.id, user, parseInt(args[1]));
    } catch (error) {
      this.client.console.error(error);
    }
  }
}

module.exports = Pay;