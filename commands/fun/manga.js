/*

  All credits for the core of this command go to Yukine <@184632227894657025>
  You can find his repo here; https://github.com/Dev-Yukine

*/
const Command = require(`${process.cwd()}/base/Command.js`);
const Discord = require("discord.js");
const Kitsu = require("kitsu");
const kitsu = new Kitsu();

class Manga extends Command {

  constructor(client) {
    super(client, {
      name: "manga",
      description: "Returns information about a manga",
      category: "04. Fun",
      usage: "manga [name/title of manga]",
      extended: "This returns information about the selected manga.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    function filter(msg) {
      if (msg.author.id !== message.author.id) return false;
      return ["1", "2", "3", "4", "5"].includes(msg.content);
    }
    if (args.length < 1) return message.reply("You must add a manga to search for");
    let loadingMessage = await message.channel.send("*Fetching information from Kitsu!*");
    try {
      const { data } = await kitsu.fetch("manga", { filter: { text: args.join("-") } });
      loadingMessage = await loadingMessage.edit(`Okay I found 5 possible matches which do you want to see? Write the first number, this will be canceled after 20 seconds! ${this.makeTitles(data)}`);
      const collected = await message.channel.awaitMessages(filter, { max: 20, maxProcessed: 1, time: 20000, errors: ["time"] });
      const returnMessage = collected.first();
      const index = Number(returnMessage.content) - 1;
      await returnMessage.delete();

      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`${data[index].titles.en_jp} (${data[index].titles.en})`)
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .setDescription(`**Synopsis:** ${data[index].synopsis}`)
        .addField("Start & end date:", `${data[index].startDate} > ${data[index].endDate || "In progress..."}`, true)
        .addField("Type:", `${data[index].subtype}`, true)
        .addField("Popularity rank:", `${data[index].popularityRank}`, true)
        .addField("Link:", `https://kitsu.io/manga/${data[index].id}`);

      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, embed);
    } catch (error) {
      if (error instanceof Discord.Collection()) return message.reply("Command canceled! Timed out.");
      loadingMessage.edit("I had an error while trying to fetch the data from Kitsu. Sorry! Did you spell the manga name right?");
      this.client.logger.error(error);
    }  
  }
}

module.exports = Manga;
