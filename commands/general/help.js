const Command = require(`${process.cwd()}/base/Command.js`);
const Discord = require("discord.js");

class Help extends Command {

  constructor(client) {
    super(client, {
      name: "help",
      description: "Displays information on all commands",
      category: "01. General",
      usage: "help [command]",
      extended: "This displays all supported commands. It also returns specific help text when run help [command name].",
      cost: 0,
      cooldown: 5,
      hidden: false,
      guildOnly: false,
      aliases: ["h", "halp", "help"],
      permLevel: "User"
    });
  }

  async run(message, args, level) {
    const settings = message.settings;
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
    
    if (!args[0]) {
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true && cmd.conf.guildOnly !== true);

      let currentCategory = "";
      let output = `{"color": ${this.client.config.colors.random()}, "fields": [`;

      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);

      sorted.forEach(command => {
        const category = command.help.category.toProperCase();
        if (currentCategory !== category) {
          if (category !== "01. General")
            output += "\"},";
          output += `{"name": "${category}","value": "`;
          currentCategory = category;
        } else {
          output += ",";
        }
        output += ` ${command.help.name}`;
      });

      output += `"}],"footer": {"icon_url": "${message.author.displayAvatarURL({ format: "png", size: 32 })}", "text": "Requested by ${message.author.tag} | REmibot by @Jjeuweiii"}}`;
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {
        "embed": JSON.parse(output)
      });

    } else {
      let command = args[0];

      if (this.client.commands.has(command)) command = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) command = this.client.commands.get(this.client.aliases.get(command));
      else return;

      if (!message.guild && command.conf.guildOnly === true) return;
      if (level < this.client.levelCache[command.conf.permLevel]) return;

      const embed = new Discord.MessageEmbed();
      embed
        .setTitle(`${command.help.name}`)
        .setColor(this.client.config.colors.random())
        .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
        .setTimestamp()
        .addField("Category", `${command.help.category}`, true)
        .addField("Usage", `${settings.prefix}${command.help.usage}`, true)
        .addField("Cost", `💎 ${parseInt(command.help.cost)}`, true)
        .addField("Aliases", `${command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "None!"}`, true)
        .addField("Details", `${command.help.extended}`);
      
      loadingMessage.delete();
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {embed});
    }
  }
}
module.exports = Help;