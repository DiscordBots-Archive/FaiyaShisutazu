const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Neko extends Social {

  constructor(...args) {
    super(...args, {
      name: "neko",
      description: "Shows a picture of a neko",
      category: "6. NSFW",
      usage: "neko",
      extended: "This returns a Neko, a lewd Neko if used in a NSFW channel",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");
    
    try {
      const { body } = await get(`https://nekos.life/api${Math.random() >= 0.5 ? "/lewd" : ""}/neko`);
      
      const embed = new MessageEmbed();
      embed
        .setDescription(body.neko)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.neko)
        .setTimestamp();
        
      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Neko;