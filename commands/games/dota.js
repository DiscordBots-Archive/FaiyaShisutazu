const Social = require(`${process.cwd()}/base/Social.js`);
const config = require(`${process.cwd()}/config.js`);
const Discord = require("discord.js");
const steamID64 = require("steamidconvert")(config.steamKey);
const steamID3 = require("steamid");
const request = require("request");

class Dota extends Social {

  constructor(client) {
    super(client, {
      name: "dota",
      description: "Returns information an selected Dota2 tag",
      category: "07. Games",
      usage: "dota [stats customURL] | [builds heroName]",
      extended: "This returns information about the Dota2 tag selected.",
      cost: 15,
      cooldown: 10,
      hidden: false,
      guildOnly: true,
      aliases: ["dota2", "doto"],
      permLevel: "User"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const suffix = args[0];
      const input = args[1];
      if (suffix == "stats")
        await this.stats(message, input);
      else if (suffix == "builds")
        await this.builds(message, input);
    } catch (e) {
      console.log(e);
    }
  }

  async stats(message, input) {
    const loadingMessage = await message.channel.send(`${this.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const customURL = input;
      steamID64.convertVanity(customURL, function(err, res) {
        if (err) {
          loadingMessage.edit("I'm only supporting Steam's customURL as input!");
        } else {

          const playerID = new steamID3(res)
            .getSteam3RenderedID()
            .slice(5)
            .replace("]", "");

          const output = {
            status: "",
            daysSinceLastMatch: "",
            estMMR: "",
            name: "",
            winLoss: {
              wins: "",
              losses: "",
              winrate: "",
              totalGames: ""
            },
            mostPlayed: [],
            recentGames: [],
            profileURL: "https://opendota.com/players/" + playerID,
            profileImage: "",
            isPrime: ""
          };

          const apiBase = "https://api.opendota.com/api/players/" + playerID;

          request(apiBase, function(err, res) {
            if (err) {
              output.status = "Error";
              loadingMessage.edit("Error with initial request! This might be a problem with OpenDota API!");
            } else {
              const data = JSON.parse(res.body);
              if (data.error) {
                output.status = "Invalid";
              } else {
                output.status = "Valid Account";
                output.estMMR = data.mmr_estimate.estimate;
                if (data.profile != undefined) {
                  output.name = data.profile.personaname;
                  output.profileImage = data.profile.avatarfull;
                } else {
                  output.name = "Undefined";
                  output.estMMR = 0;
                }
                request(apiBase + "/wl", function(err, res) {
                  if (err) {
                    output.status = "Error";
                    loadingMessage.edit("Error with wins/losses request! This might be a problem with OpenDota API!");
                  }
                  const data = JSON.parse(res.body);
                  if (data.lose === null || data.win === null) {
                    loadingMessage.edit("Error with wins/losses request! This might be a problem with OpenDota API!");
                  }
                  output.winLoss.losses = data.lose;
                  output.winLoss.wins = data.win;
                  output.winLoss.totalGames = data.lose + data.win;
                  output.winLoss.winrate = (data.win / (data.lose + data.win)) * 100;

                  const embed = new Discord.MessageEmbed();
                  embed
                    .setTitle(`${output.name}'s Dota 2 Stats @ OpenDota`)
                    .setColor(config.colors.random())
                    .setFooter(`Requested by ${message.author.tag} | REmibot by @Jjeuweiii`, message.author.displayAvatarURL({ format: "png", size: 32 }))
                    .setTimestamp()
                    .setThumbnail(`${output.profileImage}`)
                    .addField("Account Status", `\`${output.status}\``, true)
                    .addField("Estimated MMR", `\`${output.estMMR}\``, true)
                    .addField("Total games", `\`${output.winLoss.totalGames}\``, true)
                    .addField("Winrate", `\`${parseInt(output.winLoss.winrate).toPrecision(3)}%\``, true)
                    .addField("Wins", `\`${output.winLoss.wins}\``, true)
                    .addField("Losses", `\`${output.winLoss.losses}\``, true)
                    .addField("Details", `${output.profileURL}`);
                  
                  loadingMessage.delete();
                  message.channel.send(`🌺 **${message.author.tag}** ❯ ${message.content}`, { embed });
                });
              }
            }
          });
        }
      });
    } catch (error) {
      loadingMessage.edit(`${this.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.logger.error(error);
    }
  }
}


module.exports = Dota;
