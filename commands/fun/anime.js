/*

  All credits for the core of this command go to Yukine <@184632227894657025>
  You can find his repo here; https://github.com/Dev-Yukine

*/
const Command = require("../../structures/Command.js");
const { MessageEmbed, Collection } = require("discord.js");
const Kitsu = require("kitsu");
const kitsu = new Kitsu();

class Anime extends Command {

  constructor(...args) {
    super(...args, {
      name: "anime",
      description: "Returns information about an anime",
      category: "4. Fun",
      usage: "anime [name/title of series/movie]",
      extended: "This returns information about the selected anime.",
      cost: 15,
      cooldown: 10,
      aliases: [],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    function filter(msg) {
      if (msg.author.id !== message.author.id) return false;
      return ["1", "2", "3", "4", "5"].includes(msg.content);
    }

    if (args.length < 1) return message.reply("You must input an anime title to search for");
    try {
      const { data } = await kitsu.fetch("anime", { filter: { text: args.join("-") } });
      await response.edit(`Okay I found 5 possible matches which do you want to see? Write the first number, this will be canceled after 20 seconds! ${this.makeTitles(data)}`);
      const collected = await message.channel.awaitMessages(filter, { max: 20, maxProcessed: 1, time: 20000, errors: ["time"] });
      const returnMessage = collected.first();
      const index = Number(returnMessage.content) - 1;
      returnMessage.delete(); 

      const embed = new MessageEmbed();
      embed
        .setTitle(`${data[index].titles.en_jp} (${data[index].titles.en})`)
        .setColor(message.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setDescription(`**Synopsis:** ${data[index].synopsis}`)
        .addField("Start & end date:", `${data[index].startDate} > ${data[index].endDate || "In progress..."}`, true)
        .addField("Type:", `${data[index].subtype}`, true)
        .addField("Popularity rank:", `${data[index].popularityRank}`, true)
        .addField("Link:", `https://kitsu.io/anime/${data[index].id}`)
        .setTimestamp();

      await response.edit(`Requested by **${message.author.tag}** ❯ \`${message.content}\` | Fetched from Kitsu...`, embed);
    } catch (error) {
      if (error instanceof Collection()) return message.reply(`Command timed out, please try again **${message.author.displayName}**!`);
      await response.edit(`I had an error while trying to fetch the data from Kitsu. Sorry! Did you spell the anime name right **${message.author.displayName}**?`);
      message.client.console.error(error);
    }
  }
}

module.exports = Anime;