const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");

class Neko extends Social {
  constructor(client) {
    super(client, {
      name: "neko",
      description: "Shows a picture of a neko.",
      category: "6. NSFW?",
      usage: "neko",
      extended: "This command will return a Neko, a lewd Neko if used in a NSFW channel",
      cost: 2,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Đây là channel SFW thì hông có đăng hình 18+ được nha..");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001>...`);
      const { body } = await snek.get(`https://nekos.life/api${Math.random() >= 0.5 ? "/lewd" : ""}/neko`);
      
      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`🌺 **${message.author.tag}** ❯ ${message.content}`)
        .setDescription(body.neko)
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setImage(body.neko)
        .setTimestamp()
        
      await msg.edit({embed});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Neko;