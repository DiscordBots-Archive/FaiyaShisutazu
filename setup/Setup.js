const inquirer = require("inquirer");
const Enmap = require("enmap");
const fs = require("fs");

let baseConfig = fs.readFileSync("./setup/BaseSetup.txt", "utf8");

let defaultSettings = `{
  "prefix": "{{prefix}}",
  "language": "{{language}}",
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
  "minRewards": "100",
  "maxRewards": "200",
  "minPoints": "1",
  "maxPoints": "20",
  "costMulti": "2"
}`;

const settings = new Enmap({name: "settings"});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "list", 
    name: "language", 
    message: "Do you want to change the bot's language? Default is English.", 
    choices: ["No", "Tiếng Việt"]
  },
  {
    type: "input",
    name: "prefix",
    message: "[Required] Please enter your bot prefix! Enter ! to keep default."
  }
];

(async function() {
  console.log(" Setting up your bot's configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log(" First Start! Inserting default guild settings in the database...");
    defaultSettings = defaultSettings.replace("{{prefix}}", "!");
    await settings.set("default", defaultSettings);
  }
  
  // Start to comment out this section and edit setup_base.txt 
  // directly if hosting on Heroku
  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log(" Resetting default guild settings...");
    await settings.set("default", defaultSettings);
  }

  if (answers.language && answers.language === "Tiếng Việt") {
    console.log(" Changing default guide language...");
    defaultSettings = defaultSettings.replace("{{language}}", "vietnamese");
    baseConfig = baseConfig.replace("{{language}}", "vietnamese");
  } else {
    defaultSettings = defaultSettings.replace("{{language}}", "english");
    baseConfig = baseConfig.replace("{{language}}", "english");
  }

  console.log(" Setting default guide prefix...");
  defaultSettings = defaultSettings.replace("{{prefix}}", `${answers.prefix}`);
  baseConfig = baseConfig.replace("{{prefix}}", `${answers.prefix}`);
  await settings.set("default", defaultSettings);
  // End
  
  fs.writeFileSync("./config.js", baseConfig);
}());

