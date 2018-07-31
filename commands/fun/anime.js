/*

  All credits for the core of this command go to Yukine <@184632227894657025>
  You can find his repo here; https://github.com/Dev-Yukine

*/
const Command = require(`${process.cwd()}/base/Command.js`);
const Discord = require("discord.js");
const Kitsu = require("kitsu");
const kitsu = new Kitsu();

class Anime extends Command {
  constructor(client) {
    super(client, {
      name: "anime",
      description: "Tìm kiếm về 1 anime bất kỳ trên Kitsu~",
      category: "4. Fun",
      usage: "anime attack on titan",
      extended: "",
      cooldown: 10,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    function filter(msg) {
      if (msg.author.id !== message.author.id) return false;
      return ["1", "2", "3", "4", "5"].includes(msg.content);
    }
    if (args.length < 1) return message.reply("You must add an anime to search for");
    let msg = await message.channel.send("*fetching information from kitsu!*");
    try {
      const { data } = await kitsu.fetch("anime", { filter: { text: args.join("-") } });
      msg = await msg.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)${this.makeTitles(data)}`);
      const collected = await message.channel.awaitMessages(filter, { max: 20, maxProcessed: 1, time: 60000, errors: ["time"] });
      const returnMessage = collected.first();
      const index = Number(returnMessage.content) - 1;
      await returnMessage.delete(); 

      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`${data[index].titles.en_jp} (${data[index].titles.en})`)
        .setColor(0x9575cd)
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .setDescription(`**Synopsis:** ${data[index].synopsis}`)
        .addField("Start & end date:", `${data[index].startDate} > ${data[index].endDate || "In progress..."}`, true)
        .addField("Type:", `${data[index].subtype}`, true)
        .addField("Popularity rank:", `${data[index].popularityRank}`, true)
        .addField("Link:", `https://kitsu.io/anime/${data[index].id}`);

      await msg.delete();
      await message.channel.send(embed);
      
    } catch (error) {
      if (error instanceof Discord.Collection()) return message.reply("command canceled due timer");
      await msg.edit("I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Anime name right?");
      await message.react("❓");
    }
  }
}

module.exports = Anime;