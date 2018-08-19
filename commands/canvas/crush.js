const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Crush extends Social {

  constructor(client) {
    super(client, {
      name: "crush",
      description: "Shows everyone who you missed",
      category: "3. Canvas",
      usage: "crush [@mention|userid]",
      extended: "This uses the provided tag to tell everyone who you missed the most. If there was no tag provided, this command will use the image of the message's author!",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["miss"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const crush = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const crusher = message.author;
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${crush.username}** đang bị ${message.member.displayName} ngắm nè~`);

      const result = await this.getCrushed(crusher.displayAvatarURL({format: "png", size: 128}), crush.displayAvatarURL({format: "png", size: 512}));
      await message.channel.send({
        files: [{
          attachment: result,
          name: "crush.png"
        }]
      });

      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getCrushed(crusher, crush) {
    const [plate, Crusher, Crush] = await Promise.all([
      fsn.readFile("./assets/images/plate_crush.png"),
      snek.get(crusher),
      snek.get(crush),
    ]);
    return new Canvas(600, 873)
      .rotate(-0.09)
      .addImage(Crush.body, 109, 454, 417, 417)
      .resetTransformation()
      .addImage(plate, 0, 0, 600, 873)
      .addImage(Crusher.body, 407, 44, 131, 131, {type: "round", radius: 66})
      .restore()
      .toBuffer();
  }
}

module.exports = Crush; //