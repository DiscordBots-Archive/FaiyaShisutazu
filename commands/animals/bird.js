const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Bird extends Social {

  constructor(...args) {
    super(...args, {
      name: "bird",
      description: "Returns an image of a bird",
      category: "2. Animals",
      usage: "bird",
      extended: "This returns an image of a bird.",
      cost: 5,
      cooldown: 5,
      aliases: ["birb"],
      botPerms: ["EMBED_LINKS"],
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("http://random.birb.pw/tweet/");

    const embed = new MessageEmbed();
    embed
      .setDescription(`https://random.birb.pw/img/${body}`)
      .setColor(message.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(`https://random.birb.pw/img/${body}`)
      .setTimestamp();
    
    await replyMessage.edit(embed);
  }
}

module.exports = Bird;