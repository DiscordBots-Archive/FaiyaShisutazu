const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Valut extends Social {

  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Gives someone a thumbs up",
      category: "3. Canvas",
      usage: "thumbs [@mention|userid]",
      extended: "This uses the provided tag to give someone a thumbs up. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["like"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const user = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const msg = await message.channel.send("...");
      
      const result = await this.getThumbsUp(user.displayAvatarURL({format: "png", size: 128}));
      await message.channel.send({
        files: [{
          attachment: result,
          name: "thumbs.jpg"
        }]
      });

      await msg.delete();
    } catch (error) {
      throw error;
    }
  }

  async getThumbsUp(person) {
    const plate = await fsn.readFile("./assets/images/plate_vaultboy.png");
    const { body } = await snek.get(person);
    return new Canvas(365, 365)
      .setColor("#000000")
      .addRect(0, 0, 365, 365)
      .addImage(body, 153, 62, 100, 100)
      .addImage(plate, 0, 0, 365, 365)
      .toBuffer();
  }
}

module.exports = Valut; //