const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

class Thicc extends Social {
  constructor(client) {
    super(client, {
      name: "thicc",
      description: "Hay là muốn xem những cặp mông nè?",
      category: "6. NSFW?",
      usage: "thicc",
      extended: "Dùng lệnh này để có những cặp mông quyến rũ nha!",
      cost: 40,
      cooldown: 10,
      aliases: ["ass"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Đây là channel SFW thì hông có đăng hình 18+ được nha..");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** muốn ngắm mông...`);
      const { body } = await snek.get("http://api.obutts.ru/butts/0/1/random");
      await msg.edit({
        embed: {
          "title": "Hình gốc ở đây nè!",
          "url": `http://media.obutts.ru/${body[0].preview}`,
          "color": 0x9575cd,
          "image": {
            "url": `http://media.obuttss.ru/${body[0].preview}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Thicc;