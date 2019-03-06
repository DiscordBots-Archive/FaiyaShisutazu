const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class E621 extends Social {

  constructor(...args) {
    super(...args, {
      name: "e621",
      description: "Returns an entry from E621",
      category: "6. NSFW",
      usage: "e621 [search term]",
      extended: "This returns an entry from E621.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");

    try {
      const { body } = await get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(args)}`);
      const result = body.random();

      const embed = new MessageEmbed();
      embed
        .setDescription(`https://e621.net/post/show/${result.id}`)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(result.file_url)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = E621;