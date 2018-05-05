const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Owl extends Social {

  constructor(client) {
    super(client, {
      name: "owl",
      description: "Trả về hình 1 chú chim cú bất kỳ",
      category: "2. Animals",
      usage: "owl",
      extended: "Chỉ là trả về hình 1 chú chim cú bất kỳ thôi!",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) {

    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú chim cú nè...`);
    const owl = await get("http://pics.floofybot.moe/owl").then(r => r.body.image); // API Provided by Lewdcario
    await loadingMessage.edit({
      embed: {
        "title": `🌺 **${message.author.tag}** ❯ ${message.content}`,
        "description": owl,
        "color": 0x9575cd,
        "image": {
          "url": owl
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        }
      }
    });
    
  }
}

module.exports = Owl;