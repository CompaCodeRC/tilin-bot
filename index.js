// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const scrape = require('@web-master/node-web-scraper');
const gis = require('g-i-s');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let prefix = '-';

const get_img = async (search) => {
    const search_img =  new Promise((resolve, reject) => {
        gis(search, (e, results) => {
            let number = Math.floor(Math.random() * 10) + 1;
            resolve(results[number].url);
        })
    })

    return await search_img;
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async (msg) => {
	if(msg.content.startsWith(prefix)) {
        let command = (msg.content.split(' ')[0]).replace(prefix, '');
        let search = () => {
            let split_msg = msg.content.split(' ');
            let message = split_msg.slice(1, split_msg.lenght);
            return message.join(' ');
        }

        if(command === 'rule'){
            if (search()) {
                let file_img = await get_img(search() + 'rule34');
                msg.channel.send({
                    files: [{
                      attachment: file_img,
                      name: 'tilinsearch.jpg'
                    }]
                });
            } else {
                let embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription('Ya pero que busco?')

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