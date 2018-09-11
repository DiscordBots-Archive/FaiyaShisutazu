const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const { resolve, join } = require("path");
const fsn = require("fs-nextra");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Minecraftia.ttf")), "Minecraftia");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Minecraftia");

class Achievement extends Social {

  constructor(client) {
    super(client, {
      name: "achievement",
      description: "Creates an user-defined achievement",
      category: "03. Canvas",
      usage: "achievement [description]",
      extended: "This uses the provided text to create a custom achievement.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["get", "achieveget", "achievementget", "achieve"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let text = args.join(" ").toUpperCase();
    if (text.length < 1) return message.response(undefined, `B-baka!! ${message.member.displayName}-san must input something in order for this to work!!`);
    if (text.length > 22) return message.response(undefined, `The maximum length is 22 characters ${message.member.displayName}-san!`);

    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      const person = message.author.displayAvatarURL({format: "png", size: 32});      
      const result = await this.getAchievement(text, person);
      const attachment = new Discord.MessageAttachment(result, "achievement.png");
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {files: [attachment]});
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }

  async getAchievement(text, person) {
    const plate = await fsn.readFile("./assets/images/plate_achievement.png");
    const { body } = await snek.get(person);
    return new Canvas(320, 64)
      .addImage(plate, 0, 0, 320, 64)
      .addImage(body, 16, 16, 32, 32, {type: "round", radius: 16})
      .restore()
      .setTextFont("11pt Minecraftia")
      .setColor("#FFFFFF")
      .addText(text, 60, 58, 0, 0)
      .toBuffer();
  }

}

module.exports = Achievement;