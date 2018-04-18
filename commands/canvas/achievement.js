const Social = require(`${process.cwd()}/base/Social.js`);
const {
  Canvas
} = require("canvas-constructor");
const snek = require("snekfetch");
const {
  resolve,
  join
} = require("path");
const fsn = require("fs-nextra");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Minecraftia.ttf")), "Minecraftia");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Minecraftia");

class Achievement extends Social {
  constructor(client) {
    super(client, {
      name: "achievement",
      description: "Tạo 1 thành tích cho riêng mình?",
      category: "3. Canvas",
      usage: "achievement",
      extended: "Tạo 1 thành tích bất kỳ cho bạn bằng cách cung cấp nội dung cho em nè!",
      cost: 2,
      cooldown: 10,
      aliases: ["get", "achieveget", "achievementget"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let text = args.join(" ");
    if (text.length < 1) return message.response(undefined, `${message.member.displayName}-san phải cho em nội dung thì mới làm được chớ!`);
    if (text.length > 22) return message.response(undefined, "Em chỉ lấy được tối đa 22 chữ cái thôi à ${message.member.displayName}-san~");

    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}**-san đang nhận được 1 thành tích nè...`);
      const person = (message.mentions.users.first() || message.author).displayAvatarURL({
        format: "png",
        size: 32
      });
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      const result = await getAchievement(text, person);
      await message.channel.send({
        files: [{
          attachment: result,
          name: "achievementGet.png"
        }]
      });
      await msg.delete();
    } catch (error) {
      console.log(error);
      // this.client.logger.error(error);
    }
  }

  async getAchievement(text, person) {
    const plate = await fsn.readFile("./assets/images/plate_achievement.png");
    const {
      body
    } = await snek.get(person);
    return new Canvas(320, 64)
      .addImage(plate, 0, 0, 320, 64)
      .addImage(body, 16, 16, 32, 32, {
        type: "round",
        radius: 16
      })
      .restore()
      .setTextFont("11pt Minecraftia")
      .setColor("#FFFFFF")
      .addText(text, 60, 58)
      .toBuffer();
  }

}

module.exports = Achievement;