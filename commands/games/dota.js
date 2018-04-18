const Social = require(`${process.cwd()}/base/Social.js`);
const api = require(`${process.cwd()}/api.js`);
const steamID64 = require('steamidconvert')(api.steam);
const steamID3 = require('steamid');
const moment = require('moment');
const request = require('request');

class Dota extends Social {
    constructor(client) {
        super(client, {
            name: "dota",
            description: "All you need to know about Dota 2",
            usage: "dota",
            aliases: ["dota2", "doto"],
            category: "7. Games"
        });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        try {
            const suffix = args[0];
            const input = args[1];
            if (suffix == "stats")
                await this.stats(message, input);
        } catch (e) {
            console.log(e);
        }
    }

    async stats(message, input) {
        try {
            const customURL = input;
    
            steamID64.convertVanity(customURL, function (err, res) {
                if (err) {
                    message.channel.send("I'm only supporting Steam's customURL as input!");
                } else {
    
                    const playerID = new steamID3(res).getSteam3RenderedID().slice(5).replace("]", "");
    
                    const output = {
                        status: '',
                        daysSinceLastMatch: '',
                        estMMR: '',
                        name: '',
                        winLoss: {
                            wins: '',
                            losses: '',
                            winrate: '',
                            totalGames: ''
                        },
                        mostPlayed: [],
                        recentGames: [],
                        profileURL: 'https://opendota.com/players/' + playerID,
                        profileImage: '',
                        isPrime: ''
                    };
    
                    const apiBase = 'https://api.opendota.com/api/players/' + playerID;
    
                    request(apiBase, function (err, res) {
                        if (err) {
                            output.status = 'Error';
                            message.channel.send("Error with initial request! This might be a problem with OpenDota API!");
                        } else {
                            const data = JSON.parse(res.body);
                            if (data.error) {
                                output.status = 'Invalid';
                            } else {
                                output.status = 'Valid Account';
                                output.estMMR = data.mmr_estimate.estimate;
                                if (data.profile != undefined) {
                                    output.name = data.profile.personaname;
                                    output.profileImage = data.profile.avatarfull;
                                } else {
                                    output.name = "Undefined";
                                    output.estMMR = 0;
                                }
                                request(apiBase + '/wl', function (err, res) {
                                    if (err) {
                                        output.status = 'Error';
                                        message.channel.send("Error with wins/losses request! This might be a problem with OpenDota API!");
                                    }
                                    const data = JSON.parse(res.body);
                                    if (data.lose === null || data.win === null) {
                                        message.channel.send("Error with wins/losses request! This might be a problem with OpenDota API!");
                                    }
                                    output.winLoss.losses = data.lose;
                                    output.winLoss.wins = data.win;
                                    output.winLoss.totalGames = data.lose + data.win;
                                    output.winLoss.winrate = (data.win / (data.lose + data.win)) * 100;
                                    message.channel.send({
                                        "embed": {
                                            "title": `${output.name}'s Dota 2 Stats @ OpenDota`,
                                            "color": 0x8000ff,
                                            "footer": {
                                                "text": "Hosted by @Jjeuweiii senpai"
                                            },
                                            "thumbnail": {
                                                "url": `${output.profileImage}`
                                            },
                                            "fields": [{
                                                "name": "Account Status",
                                                "value": `\`${output.status}\``,
                                                "inline": true
                                                },
                                                {
                                                "name": "Estimated MMR",
                                                "value": `\`${output.estMMR}\``,
                                                "inline": true
                                                },
                                                {
                                                    "name": "Total games",
                                                    "value": `\`${output.winLoss.totalGames}\``,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Winrate",
                                                    "value": `\`${parseInt(output.winLoss.winrate).toPrecision(3)}%\``,
                                                    "inline": true
                                                    },
                                                {
                                                    "name": "Wins",
                                                    "value": `\`${output.winLoss.wins}\``,
                                                    "inline": true
                                                },
                                                {
                                                    "name": "Losses",
                                                    "value": `\`${output.winLoss.losses}\``,
                                                    "inline": true
                                                },
                                                {
                                                "name": "Details",
                                                "value": `${output.profileURL}`
                                                }
                                            ]
                                        }
                                    });
                                });
                            }
                        }
                    });   
                }     
            });
        } catch (e) {
            console.log(e);
            message.channel.send("An error occured! Please check your input and refer the command's help!");
        }
    }    
}


module.exports = Dota;