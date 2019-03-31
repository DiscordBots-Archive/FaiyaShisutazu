const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

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
      replyMessage: [
        "<:karen:559907412425834497> Well I didn't know **{{user}}-san** likes birds...\n<:tsukihi:559908175906734097> Here you go!",
        "<:tsukihi:559908175906734097> I got you a bird **{{user}}-san**!",
        "<:karen:559907412425834497> A random bird for **{{user}}-san**!",
        "<:tsukihi:559908175906734097> *chuu chuu*",
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("http://random.birb.pw/tweet/")
        .then(res => res.text());

      const embed = new MessageEmbed()
        .setDescription(`https://random.birb.pw/img/${body}`)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`https://random.birb.pw/img/${body}`)
        .setTimestamp();
      
      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Bird;