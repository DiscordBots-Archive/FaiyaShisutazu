const Social = require(`${process.cwd()}/base/Social.js`);
const request = require("snekfetch");
const HTMLParser = require("fast-html-parser");
const {
  MessageEmbed
} = require("discord.js");

class FML extends Social {
  constructor(client) {
    super(client, {
      name: "fml",
      description: "Lấy 1 câu chuyện FML bất kỳ",
      usage: "fml",
      category: "4. Fun",
      extended: "Dùng để kiếm 1 mẩu truyện về những người bị cuộc đời nắk!",
      cost: 10,
      cooldown: 10,
      aliases: ["fuckmylife", "fuckme"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const reply = await message.channel.send("<a:typing:397490442469376001> **Đang tìm** chờ em một tẹo~");
      const {
        text
      } = await request.get("http://www.fmylife.com/random");
      const root = HTMLParser.parse(text);
      const article = root.querySelector(".block a");
      const downdoot = root.querySelector(".vote-down");
      const updoot = root.querySelector(".vote-up");
      const embed = new MessageEmbed()
        .setTitle("Chỉ là một mẩu truyện về một người bị cuộc đời nắk")
        .setColor(0x9575cd)
        .setThumbnail("http://i.imgur.com/5cMj0fw.png")
        .setFooter(`Requested by: ${message.member.displayName}`)
        .setDescription(`_${article.childNodes[0].text}\n\n_`)
        .addField("RIP", updoot.childNodes[0].text, true)
        .addField("LUL:", downdoot.childNodes[0].text, true);
      if (article.childNodes[0].text.length < 5) {
        return message.response(undefined, "Hình như lỗi rồi huhu.... Chán wá nkỉ :<");
      }
      reply.edit({
        embed
      });
    } catch (error) {
      if (error.message === "Cannot send an empty message") {
        message.response(undefined, "Today, something went wrong, so you'll have to try again in a few moments. FML");
      }
      this.client.logger.error(error);
    }
  }
}

module.exports = FML;