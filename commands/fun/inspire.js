const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Inspire extends Social {

  constructor(client) {
    super(client, {
      name: "inspire",
      description: "Returns an inspirational quote",
      category: "04. Fun",
      usage: "inspire",
      extended: "This returns an inspirational quote from an AI.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    try {  
      const xmas = message.flags[0] === "xmas" ? "&season=xmas" : "";
      const { text } = await snek.get(`http://inspirobot.me/api?generate=true${xmas}`);
      const attachment = new Discord.MessageAttachment(text, "inspire.jpg");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}

module.exports = Inspire;