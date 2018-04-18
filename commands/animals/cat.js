const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Cat extends Social {
  constructor(client) {
    super(client, {
      name: "cat",
      description: "Lấy hình 1 chú mèo tinh nghịch?",
      category: "2. Animals",
      usage: "cat",
      extended: "Dùng lệnh này để có 1 chú mèo nè.",
      cost: 2,
      cooldown: 10,
      aliases: ["kitten"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang chơi với 1 con mèo nè...`);
      const {
        body
      } = await snek.get("http://random.cat/meow");
      await msg.edit({
        embed: {
          "url": body.file,
          "color": 0x9575cd,
          "image": {
            "url": body.file
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Cat;