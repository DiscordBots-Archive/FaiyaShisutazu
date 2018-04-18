const Social = require(`${process.cwd()}/base/Social.js`);
const {
  Canvas
} = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Respect extends Social {
  constructor(client) {
    super(client, {
      name: "respect",
      description: "Thể hiện 1 chút tôn trọng cho người ấy nha?!",
      category: "3. Canvas",
      usage: "respect [@mention|user id]",
      extended: "Tag người ấy vào để mọi người tưởng nhớ, không tag thì em đăng hình của chính senpai đó!",
      cost: 2,
      cooldown: 30,
      aliases: ["pressf", "f", "rip", "ripme"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, args[0] ? args[0] : message.author.id);

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send("Thật là đáng buồn mà~");

      const {
        giveRespect
      } = this;
      const result = await giveRespect(target.displayAvatarURL({
        format: "png",
        size: 128
      }));
      const m = await message.channel.send("Press 🇫 to pay respects.", {
        files: [{
          attachment: result,
          name: "paid-respects.png"
        }]
      });
      await msg.delete();
      m.react("🇫");
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async giveRespect(person) {
    const plate = await fsn.readFile("./assets/images/image_respects.png");
    const {
      body
    } = await snek.get(person);
    return new Canvas(720, 405)
      .addRect(0, 0, 720, 405)
      .setColor("#000000")
      .addImage(body, 110, 45, 90, 90)
      .restore()
      .addImage(plate, 0, 0, 720, 405)
      .toBuffer();
  }
}

module.exports = Respect; //