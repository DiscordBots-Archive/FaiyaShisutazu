const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Lion extends Social {

  constructor(client) {
    super(client, {
      name: "lion",
      description: "Returns an image of a lion",
      category: "02. Animals",
      usage: "lion",
      extended: "This returns an image of a lion.",
      cost: 5,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["mufasa"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    const { body } = await get("https://animals.anidiots.guide/lion");
    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription(body.link)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.link)
      .setTimestamp();

    response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});    
  }
}

module.exports = Lion;