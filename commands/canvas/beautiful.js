const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Beautiful extends Social {
  constructor(client) {
    super(client, {
      name: "beautiful",
      description: "Ngắm nhìn người khác trong 1 khung tranh thơ mộng~",
      category: "3. Canvas",
      usage: "beautiful [@mention|user id]",
      extended: "Tag người ấy vào để nhìn ngắm người ấy trong 1 khung tranh nha, không tag thì em đăng hình của chính senpai đó!",
      cost: 2,
      cooldown: 10,
      aliases: ["painting"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const beautiful = await this.verifyUser(message, args[0] ? args[0] : message.author.id);

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm người nào đó trong 1 khung tranh nè...`);

      const { getBeautiful } = this;
      const result = await getBeautiful(beautiful.displayAvatarURL({format: "png", size: 256}));
      await message.channel.send({
        files: [{
          attachment: result,
          name: "beautiful.jpg"
        }]
      });

      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getBeautiful(person) {
    const plate = await fsn.readFile("./assets/images/plate_beautiful.png");
    const { body } = await snek.get(person);
    return new Canvas(634, 675)
      .setColor("#000000")
      .addRect(0, 0, 634, 675)
      .addImage(body, 423, 45, 168, 168)
      .addImage(body, 426, 382, 168, 168)
      .addImage(plate, 0, 0, 634, 675)
      .toBuffer();
  }
}

module.exports = Beautiful; //