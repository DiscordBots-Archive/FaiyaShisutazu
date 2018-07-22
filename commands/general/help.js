const Command = require(`${process.cwd()}/base/Command.js`);

class Help extends Command {

  constructor(client) {
    super(client, {
      name: "help",
      description: "Trả về thông tin về mọi commands của em!",
      category: "1. General",
      usage: "help [command]",
      extended: "Trả về mọi commands mà senpai có thể dùng, nếu cần thêm nhiều chi tiết về 1 command nào đó thì senpai có thể dùng 'help <command name>'.",
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
    if (!args[0]) {
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true && cmd.conf.guildOnly !== true);

      let currentCategory = "";
      let output = `{"color": 4886754, "fields": [`;

      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);

      sorted.forEach(c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          if (cat !== "1. General")
            output += `"},`;
          output += `{"name": "${cat}","value": "`;
          currentCategory = cat;
        }
        output += ` ${c.help.name} `;
      });

      output += `"}],"footer": {"icon_url": "${message.author.displayAvatarURL({ format: "png", size: 32 })}", "text": "Requested by ${message.author.tag} | REmibot by @Jjeuweiii"}}`;
      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content} | Cùng tìm hiểu về mọi commands của em nha **${message.author.tag}-san**! `, {
        "embed": JSON.parse(output)
      });

    } else {
      let command = args[0];

      if (this.client.commands.has(command)) command = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) command = this.client.commands.get(this.client.aliases.get(command));
      else return;

      if (!message.guild && command.conf.guildOnly === true) return;
      if (level < this.client.levelCache[command.conf.permLevel]) return;

      message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, {
        "embed": {
          "title": `${command.help.name}`,
          "description": `${command.help.description}`,
          "color": 0x8000ff,
          "footer": {
            "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
            "text": `Requested by ${message.author.tag} | REmibot by @Jjeuweiii`
          },
          "fields": [{
              "name": "Category",
              "value": `${command.help.category}`,
              "inline": true
            },
            {
              "name": "Usage",
              "value": `${settings.prefix}${command.help.usage}`,
              "inline": true
            },
            {
              "name": "Cost",
              "value": `💎 ${parseInt(command.help.cost)}`,
              "inline": true
            },
            {
              "name": "Aliases",
              "value": `${command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "None!"}`
            },
            {
              "name": "Details",
              "value": `${command.help.extended}`
            }
          ]
        }
      });
    }
  }
}
module.exports = Help;