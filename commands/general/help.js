const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Help extends Command {

  constructor(...args) {
    super(...args, {
      name: "help",
      description: "Displays information on all commands",
      category: "1. General",
      usage: "help [category/command/setting] [page num]",
      extended: "This displays all supported commands. It also returns specific help text when run help [command name].",
      cost: 0,
      cooldown: 5,
      aliases: ["h", "halp", "help"],
      botPerms: ["EMBED_LINKS"]
    });
  }
  
  async run(message, args, level) {
    const settings = message.settings;

    if (!args[0]) {
      const myCommands = this.client.commands;

      let currentCategory = "";
      let output = `{"color": ${this.client.config.colors.random()}, "fields": [`;

      const sorted = myCommands.array()
        .filter(c => this.client.levelCache[c.permLevel] <= level && c.hidden !== true)
        .sort((p, c) => p.category > c.category ? 1 : p.name > c.name && p.category === c.category ? 1 : -1);

      sorted.forEach(command => {
        const category = command.category;
        if (currentCategory !== category) {
          if (category !== "1. General")
            output += "\"},";
          output += `{"name": "${category}","value": "`;
          currentCategory = category;
        } else {
          output += ",";
        }
        output += ` ${command.name}`;
      });

      output += `"}],"footer": {"icon_url": "${message.client.user.displayAvatarURL({ format: "png", size: 32 })}", "text": "FaiyaShisutazu"}}`;
      
      await message.channel.send(`Requested by **${message.author.tag}**`, { "embed": JSON.parse(output) });
    } else {
      let command = args[0];

      if (this.client.commands.has(command)) command = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) command = this.client.commands.get(this.client.aliases.get(command));
      else return;

      if (!message.guild && command.guildOnly === true) return;
      if (level < this.client.levelCache[command.permLevel]) return;

      const embed = new MessageEmbed();
      embed
        .setTitle(`${command.name}`)
        .setColor(this.client.config.colors.random())
        .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .addField("Category", `${command.category}`, true)
        .addField("Usage", `${settings.prefix}${command.usage}`, true)
        .addField("Cost", `🍩 ${parseInt(command.cost)}`, true)
        .addField("Aliases", `${command.aliases.join(", ") ? command.aliases.join(", ") : "None!"}`, true)
        .addField("Details", `${command.extended}`);
      
      await message.channel.send(`Requested by **${message.author.tag}**`, embed);
    }
  }
}
  
module.exports = Help;