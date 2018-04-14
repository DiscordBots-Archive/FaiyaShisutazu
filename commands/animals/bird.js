const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Bird extends Social {
  constructor(client) {
    super(client, {
      name: "bird",
      description: "Lấy hình một chú chim nha?!",
      category: "2. Animals",
      usage: "bird",
      extended: "Dùng lệnh này để nhận được 1 hình chim bất kỳ nè!",
      cost: 5,
      cooldown: 10,
      aliases: ["birb"]
    });
  }

  async run(message, args, level) {
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm nhìn 1 chú chim nè...`);
      const {
        body
      } = await snek.get("http://random.birb.pw/tweet/");
      await msg.edit({
        embed: {
          "url": `https://random.birb.pw/img/${body}`,
          "color": 0x9575cd,
          "image": {
            "url": `https://random.birb.pw/img/${body}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Bird;