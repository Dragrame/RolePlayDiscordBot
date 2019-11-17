const Discord = require('discord.js');
const config = require('./config/config.json');
const { token } = require('./config/config.private.json');

const QueryModule = require('./src/util/Query');

const bot = require('./src/bot');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on('message', msg => {
    // Ignore message if its not stating with prefix (avoid spam)
    if (!msg.content.startsWith(config.prefix)) return;
    // Ignore message if its from another bot (avoid bot messaging loops)
    if (msg.member.user.bot) return;

    const c = new QueryModule.Query(msg.content);

    console.log(bot.findMatch(c.typedQuery));
});

client.login(token);