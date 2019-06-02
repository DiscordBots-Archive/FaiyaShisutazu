const { Client } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { createLogger, format, transports } = require('winston');
const idioticAPI = require('idiotic-api');

module.exports = class FaiyaClient extends Client {
  constructor (options) {
    super(options);
    this.responses = require('../assets/responses.js');
    this.colors = [16747146, 16746211, 16746178, 16681968, 15371774, 14518525, 11373566];
    this.logger = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize({ all: true }),
        format.simple()
      )
    });

    this.idiotAPI = new idioticAPI.Client(`${process.env.IDIOT_KEY}`, { dev: true });

    // Bot's collection of active music streams
    this.streams = new Collection();

    // Users' personal playlists
    this.playlists = new Keyv(`redis://root:${process.env.REDIS_KEY}@localhost:6379`, { namespace: 'playlists' });
  }
};
