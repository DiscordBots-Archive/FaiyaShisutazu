const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Respect extends Social {

  constructor(client) {
    super(client, {
      name: "respect",
      description: "Pays respect to a person",
      category: "03. Canvas",
      usage: "respect [@mention|userid]",
      extended: "This uses the provided tag to allow everyone to pay respect to a person using the F react. If there was no tag provided, this command will use the image of the message's author!",
      cost: 30,
      cooldown: 30,
      hidden: false,
      guildOnly: true,
      aliases: ["pressf", "f", "rip", "ripme"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const person = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const result = await this.giveRespect(person.displayAvatarURL({format: "png", size: 128}));
      const attachment = new Discord.MessageAttachment(result, "respect.png");
      
      loadingMessage.delete();
      const respectMessage = await message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | Press **F** to pay respect!`, {files: [attachment]});
      respectMessage.react("🇫");
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }

  async giveRespect(person) {
    const plate = await fsn.readFile("./assets/images/image_respects.png");
    const { body } = await snek.get(person);
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