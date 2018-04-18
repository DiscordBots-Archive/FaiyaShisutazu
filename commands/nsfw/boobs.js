const Social = require(`${process.cwd()}/base/Social.js`);
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

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** muốn ngắm dzú...`);
      const { body } = await snek.get("http://api.oboobs.ru/boobs/0/1/random");
      await msg.edit({
        embed: {
          "title": "Hình gốc ở đây nè!",
          "url": `http://media.oboobs.ru/${body[0].preview}`,
          "color": 0x9575cd,
          "image": {
            "url": `http://media.oboobs.ru/${body[0].preview}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Boobs;