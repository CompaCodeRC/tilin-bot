// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const gis = require('g-i-s');
const alexa = require("alexa-bot-api-v4");
const ai = new alexa();
const translate = require('@vitalets/google-translate-api');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let prefix = '-';

const get_img = async (search) => {
    const search_img =  new Promise((resolve, reject) => {
        gis(search, (e, results) => {
            let number = Math.floor(Math.random() * 10) + 1;
            if (!results[number]) {
                resolve('https://imgur.com/tPmDInC.png');
            } else {
                let decode_img = decodeURIComponent(results[number].url)
                resolve(decode_img);
            }
        })
    })

    return await search_img;
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


var context = [];
client.on('messageCreate', async (msg) => {
	if(msg.content.startsWith(prefix)) {
        let command = (msg.content.split(' ')[0]).replace(prefix, '');
        let search_f = () => {
            let split_msg = msg.content.split(' ');
            let message = split_msg.slice(1, split_msg.lenght);
            return message.join(' ');
        }
        let search = search_f();

        if(command === 'rule'){
            if (search) {
                try {
                    let file_img = await get_img(search + 'rule34');
                    msg.channel.send(file_img);
                    /*
                    msg.channel.send({
                        files: [{
                        attachment: file_img,
                        name: search.replace(/\s/g, '')+ext_img
                        }]
                    }); */
                } catch {
                    let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription('Yara mano me cai, ya me levanto')

                    msg.channel.send({ embeds: [embed] });
                }
                
            } else {
                let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription('Ya pero que busco?')

                msg.channel.send({ embeds: [embed] });
            }
        } else if (command === 'tilin') {
            if (search) {
                ai.getReply(search, [], "spanish", "OwO").then(async (reply) => {
                    let {text} = await translate(reply, {from: 'en', to: 'es'})
                    msg.reply(text); // send the message
                    context.push(reply); // add the response to the context
                });
            } else {
                let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription('Go lolcito?')

                msg.channel.send({ embeds: [embed] });
            }
        } else {
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setDescription('Oe bro no conozco ese comando')

            msg.channel.send({ embeds: [embed] });
        }
    }
});

// Login to Discord with your client's token
client.login(token);