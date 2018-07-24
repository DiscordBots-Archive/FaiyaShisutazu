const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Boobs extends Social {
  constructor(client) {
    super(client, {
      name: "boobs",
      description: "Muốn xem hình zú?!",
      category: "6. NSFW?",
      usage: "boobs",
      extended: "Dùng lệnh này để ngắm những cái dzú nha!",
      cost: 2,
      cooldown: 10,
      aliases: ["tits"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Đây là channel SFW thì hông có đăng hình 18+ được nha..");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001>...`);
      const { body } = await snek.get("http://api.oboobs.ru/boobs/0/1/random");
      
      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(`http://media.oboobs.ru/${body[0].preview}`)
        .setColor(0x9575cd)
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(`http://media.oboobs.ru/${body[0].preview}`)
        .setTimestamp()

      await msg.edit({embed});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Boobs;