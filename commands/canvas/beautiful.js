const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Beautiful extends Social {

  constructor(client) {
    super(client, {
      name: "beautiful",
      description: "Returns a beatiful canvas with the person you like on it",
      category: "3. Canvas",
      usage: "beautiful [@mention|userid]",
      extended: "This uses the provided tag to create a beautiful canvas with the person you like. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["painting"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const beautiful = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** đang ngắm người nào đó trong 1 khung tranh nè...`);

      const result = await this.getBeautiful(beautiful.displayAvatarURL({format: "png", size: 256}));
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