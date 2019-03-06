const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Butts extends Social {

  constructor(...args) {
    super(...args, {
      name: "butts",
      description: "Returns butts",
      category: "6. NSFW",
      usage: "butts",
      extended: "This returns butts from oboobs.ru.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");
    
    try {
      const { body } = await get("http://api.obutts.ru/butts/0/1/random");
      const embed = new MessageEmbed();
      embed
        .setDescription(`http://media.obutts.ru/${body[0].preview}`)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`http://media.obutts.ru/${body[0].preview}`)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Butts;