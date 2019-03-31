const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Shibe extends Social {

  constructor(...args) {
    super(...args, {
      name: "shibe",
      description: "Returns an image of a Shiba Inu",
      category: "2. Animals",
      usage: "shibe",
      extended: "This returns an image of a Shiba Inu.",
      cost: 5,
      cooldown: 5,
      aliases: ["shibe", "doge", "shiba"],
      botPerms: ["EMBED_LINKS"],
      replyMessage: [
        "<:tsukihi:559908175906734097> I got you a Shiba Inu **{{user}}-san**!",
        "<:karen:559907412425834497> A random Shiba Inu for **{{user}}-san**!"
      ]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    try {
      const body = await fetch("http://shibe.online/api/shibes")
        .then(res => res.json());

      const embed = new MessageEmbed()
        .setDescription(body[0])
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body[0])
        .setTimestamp();

      await replyMessage.edit(this.replyMessage.random().replaceAll("{{user}}", message.member.displayName),embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = Shibe;