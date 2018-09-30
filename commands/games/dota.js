const Social = require("../../structures/Social.js");
const config = require("../../config.js");
const { MessageEmbed } = require("discord.js");
const steamID64 = require("steamidconvert")(config.steamKey);
const steamID3 = require("steamid");
const request = require("request");

class Dota extends Social {

  constructor(...args) {
    super(...args, {
      name: "dota",
      description: "Returns information an selected Dota2 tag",
      category: "5. Games",
      usage: "dota [stats customURL]",
      extended: "This returns information about the Dota2 tag selected.",
      cost: 15,
      cooldown: 10,
      aliases: ["dota2", "doto"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const response = await message.channel.send(`${message.client.responses.loadingMessages.random().replaceAll("{{user}}", message.member.displayName)}`);

    try {
      const suffix = args[0];
      const input = args[1];
      if (suffix == "stats")
        await this.stats(message, input, response);
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }

  async stats(message, input, response) {
    try {
      const customURL = input;
      steamID64.convertVanity(customURL, function(err, res) {
        if (err) {
          response.edit("I'm only supporting Steam's customURL as input!");
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
              response.edit("Error with initial request! This might be a problem with OpenDota API!");
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
                    response.edit("Error with wins/losses request! This might be a problem with OpenDota API!");
                  }
                  const data = JSON.parse(res.body);
                  if (data.lose === null || data.win === null) {
                    response.edit("Error with wins/losses request! This might be a problem with OpenDota API!");
                  }
                  output.winLoss.losses = data.lose;
                  output.winLoss.wins = data.win;
                  output.winLoss.totalGames = data.lose + data.win;
                  output.winLoss.winrate = (data.win / (data.lose + data.win)) * 100;

                  const embed = new MessageEmbed();
                  embed
                    .setTitle(`${output.name}'s Dota 2 Stats`)
                    .setColor(this.config.colors.random())
                    .setFooter("FaiyaShisutazu", message.client.user.displayAvatarURL({ format: "png", size: 32 }))
                    .setThumbnail(`${output.profileImage}`)
                    .addField("Account Status", `\`${output.status}\``, true)
                    .addField("Estimated MMR", `\`${output.estMMR}\``, true)
                    .addField("Total games", `\`${output.winLoss.totalGames}\``, true)
                    .addField("Winrate", `\`${parseInt(output.winLoss.winrate).toPrecision(3)}%\``, true)
                    .addField("Wins", `\`${output.winLoss.wins}\``, true)
                    .addField("Losses", `\`${output.winLoss.losses}\``, true)
                    .addField("Details", `${output.profileURL}`)
                    .setTimestamp();
                  
                  response.edit(`Requested by **${message.author.tag}** ❯ \`${message.content}\` | Powered by OpenDota API`, embed);
                });
              }
            }
          });
        }
      });
    } catch (error) {
      await response.edit(`${message.client.responses.errorMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      message.client.console.error(error);
    }
  }
}


module.exports = Dota;
