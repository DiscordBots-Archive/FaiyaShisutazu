const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const pSearch = require("pornsearch");

class PVid extends Social {

  constructor(...args) {
    super(...args, {
      name: "pornvid",
      description: "Returns porn videos",
      category: "6. NSFW",
      usage: "pornvid [search term]",
      extended: "This returns porn videos.",
      cost: 15,
      cooldown: 10,
      aliases: ["pvid"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, replyMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return replyMessage.edit("🔞 You need to be in a NSFW channel to use this command!");
    
    try {
      const search = new pSearch(args.join(" "));
      const videos = await search.videos();
      const randomVideo = videos.random();

      const embed = new MessageEmbed();
      embed
        .setTitle(`${randomVideo.title} (${randomVideo.duration})`)
        .setDescription(`URL: ${randomVideo.url}`)
        .setColor(message.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(randomVideo.thumb)
        .setTimestamp();

      await replyMessage.edit(embed);
    } catch (error) {
      await replyMessage.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}

module.exports = PVid;