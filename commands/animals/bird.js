const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Bird extends Social {

  constructor(client) {
    super(client, {
      name: "bird",
      description: "Trả về hình 1 chú chim bất kỳ",
      category: "2. Animals",
      usage: "bird",
      extended: "Chỉ là trả về hình 1 chú chim bất kỳ thôi!",
      cost: 2,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["birb"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {

    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const loadingMessage = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú chim nè...`);
    const { body } = await get("http://random.birb.pw/tweet/");
    return loadingMessage.edit({
      embed: {
        "title": `🌺 **${message.author.tag}** ❯ ${message.content}`,
        "description": `https://random.birb.pw/img/${body}`,
        "color": 0x9575cd,
        "image": {
          "url": `https://random.birb.pw/img/${body}`
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
        }
      }
    });

  }
}

module.exports = Bird;