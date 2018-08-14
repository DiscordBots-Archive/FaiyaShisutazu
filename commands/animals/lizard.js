const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { get } = require("snekfetch");

class Lizard extends Social {

  constructor(client) {
    super(client, {
      name: "lizard",
      description: "Trả về hình 1 chú thằn lằn hay tắc kè bất kỳ",
      category: "2. Animals",
      usage: "lizard",
      extended: "Chỉ là trả về hình 1 chú thằn lằn hay tắc kè bất kỳ thôi!",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["gecko"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {

    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001>...`);
    const { body } = await get("https://nekos.life/api/v2/img/lizard");

    const embed = new Discord.MessageEmbed();
    embed
      .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
      .setDescription(body.url)
      .setColor(this.client.config.colors.random())
      .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
      .setImage(body.url)
      .setTimestamp()

    await loadingMessage.edit({embed});    
  }
}

module.exports = Lizard;