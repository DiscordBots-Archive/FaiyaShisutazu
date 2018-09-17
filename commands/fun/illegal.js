const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get, post } = require("snekfetch");
const inUse = new Map();

class IsNowIllegal extends Social {

  constructor(client) {
    super(client, {
      name: "illegal",
      description: "Returns Trump making something illegal",
      category: "04. Fun",
      usage: "illegal [text]",
      extended: "Powered by IsNowIllegal.com, get Donald Trump to make anything illegal.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["trump", "sign"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    inUse.set("true", {
      user: message.author.id
    });

    const word = args.join(" ");
    const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(word);

    if (word.length < 1 || word.length > 10) {
      inUse.delete("true");
      message.response(undefined, "Cannot be longer than 10 characters or shorter than 1 character.");
      return;
    }
    if (!wordMatch) {
      inUse.delete("true");
      message.response(undefined, "Oops! Non-standard unicode characters are now illegal.");
      return;
    }

    try {
      await post("https://is-now-illegal.firebaseio.com/queue/tasks.json").send({
        task: "gif",
        word: word.toUpperCase()
      });
      await this.client.wait(5000);
      const result = await get(`https://is-now-illegal.firebaseio.com/gifs/${word.toUpperCase()}.json`);
      const attachment = new Discord.MessageAttachment(result.body.url, "illegal.gif");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
      inUse.delete("true");
    } catch (error) {
      inUse.delete("true");
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = IsNowIllegal;