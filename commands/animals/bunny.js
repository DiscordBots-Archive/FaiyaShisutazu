const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Bunny extends Social {

  constructor(client) {
    super(client, {
      name: "bunny",
      description: "Returns an image of a bunny",
      category: "02. Animals",
      usage: "bunny",
      extended: "This returns an image of a bunny.",
      cost: 5,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["bunbun"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const { body } = await get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
    const response = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    const embed = new Discord.MessageEmbed();
    embed
      .setDescription(body.media.gif)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.media.gif)
      .setTimestamp();

    response.edit(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
  }
}

module.exports = Bunny;