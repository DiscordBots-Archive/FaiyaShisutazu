const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/setup_base.txt", "utf8");

const defaultSettings = `{
  "prefix": "!",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "welcomeEnabled": "true",
  "welcomeChannel": "general",
  "socialNotice": "true",
  "socialSystem": "true",
  "socialInventory": "true",
  "scoreTime": "5",
  "dailyTime": "24",
  "pointsReward": "200",
  "minPoints": "1",
  "maxPoints": "50",
  "costMulti": "2"
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "discordKey",
    message: "[Required] Please enter your bot token from the application page."
  },
  {
    type: "input",
    name: "steamKey",
    message: "[Optional] Please enter your Steam API key."
  },
  {
    type: "input",
    name: "googleKey",
    message: "[Optional] Please enter your Google API key."
  },
  {
    type: "input",
    name: "githubUser",
    message: "[Optional] Please enter your Github's username."
  },
  {
    type: "password",
    name: "githubPass",
    message: "[Optional] Please enter your Github's password."
  },
  {
    type: "input",
    name: "githubRepo",
    message: "[Optional] Please enter a Github's repo URL to push to."
  },
  {
    type: "input",
    name: "githubCommitAuthor",
    message: "[Optional] Please enter the author you want your commits to be commited as, i.e: Some Author <some@author.com>."
  },
  {
    type: "input",
    name: "statsChannel",
    message: "[Optional] Please enter the channel you want the bot to post stats to."
  },
  {
    type: "input",
    name: "leaderboardChannel",
    message: "[Optional] Please enter the channel you want the bot to post the server's leaderboard rankings to."
  }
];

(async function() {
  console.log("Setting up your bot's configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }
  
  // Start to comment out this section and edit setup_base.txt 
  // directly if hosting on Heroku
  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig.replace("{{discordKey}}", `"${answers.discordKey}"`);
  baseConfig = baseConfig.replace("{{steamKey}}", `"${answers.steamKey}"`);
  baseConfig = baseConfig.replace("{{googleKey}}", `"${answers.googleKey}"`);
  baseConfig = baseConfig.replace("{{githubUser}}", `"${answers.githubUser}"`);
  baseConfig = baseConfig.replace("{{githubPass}}", `"${answers.githubPass}"`);
  baseConfig = baseConfig.replace("{{githubRepo}}", `"${answers.githubRepo}"`);
  baseConfig = baseConfig.replace("{{githubCommitAuthor}}", `"${answers.githubCommitAuthor}"`);
  baseConfig = baseConfig.replace("{{statsChannel}}", `"${answers.statsChannel}"`);
  baseConfig = baseConfig.replace("{{leaderboardChannel}}", `"${answers.leaderboardChannel}"`);
  // End
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN & API KEYS WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());
