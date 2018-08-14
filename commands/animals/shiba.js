const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Shibe extends Social {

  constructor(client) {
    super(client, {
      name: "shibe",
      description: "Trả về hình 1 chú Shiba Inu bất kỳ",
      category: "2. Animals",
      usage: "shibe",
      extended: "Chỉ là trả về hình 1 chú Shiba Inu bất kỳ thôi!",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["shibe", "doge", "shiba"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {

    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001>...`);
    const { body } = await get("http://shibe.online/api/shibes");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
      .setDescription(body[0])
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body[0])
      .setTimestamp()

    await loadingMessage.edit({embed});
  }
}

module.exports = Shibe;