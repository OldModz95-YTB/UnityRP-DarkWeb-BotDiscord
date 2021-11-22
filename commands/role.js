// require Nuggies
const Nuggies = require('nuggies');
const Discord = require('discord.js');
const language1 = require('../language/fr/buttonrole.json');
/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {String[]} args
 */

module.exports.run = async (client, message, args) => {
	const brmanager = new Nuggies.buttonroles();
	message.channel.send(`${language1.text8}\n\n**${language1.text32}:** 858079768439029791 red Premium Role 😁\n\n${language1.text9}.`);

	/**
	 * @param {Discord.Message} m
	 */
	const filter = m => m.author.id === message.author.id;
	const collector = message.channel.createMessageCollector(filter, { max: Infinity });

	collector.on('collect', async (msg) => {
		if (!msg.content) return message.channel.send(`${language1.text10}`);
		if (msg.content.toLowerCase() == 'done') return collector.stop('DONE');
		const colors = ['grey', 'gray', 'red', 'blurple', 'green'];
		if (!msg.content.split(' ')[0].match(/[0-9]{18}/g) || !colors.includes(msg.content.split(' ')[1])) return message.channel.send(`${language1.text10}`);

		const role = msg.content.split(' ')[0];
		// const role = message.guild.roles.cache.get(roleid);
		if (!role) return message.channel.send(`${language1.text11}`);

		const color = colors.find(color => color == msg.content.split(' ')[1]);
		if (!color) return message.channel.send(`${language1.text12}`);

		const label = msg.content.split(' ').slice(2, msg.content.split(' ').length - 1).join(' ');

		const reaction = (await msg.react(msg.content.split(' ').slice(msg.content.split(' ').length - 1).join(' ')).catch(/*() => null*/console.log));

		const final = {
			role, color, label, emoji: reaction ? reaction.emoji.id || reaction.emoji.name : null,
		};
		brmanager.addrole(final);
	})

	collector.on('end', async (msgs, reason) => {
		if (reason == 'DONE') {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${language1.text13}`)
				.setDescription(`${language1.text14}`)
				.setColor('RANDOM')
				.setTimestamp();
			Nuggies.buttonroles.create({ message, content: embed, role: brmanager, channelID: message.channel.id })
		}
	})
};

module.exports.config = {
	name: 'role',
	description: 'Creates button role!',
	usage: '?role',
	botPerms: [],
	userPerms: ['MANAGE_GUILD'],
	aliases: [],
};

//Developed By OldModz95#3105
// https://discord.gg/MS6TMgRfqB



//====CREDIT====

// System Button created by AngeloCore

// https://www.npmjs.com/package/discord-buttons


// System Button nuggies by Nuggies-bot

//https://github.com/Nuggies-bot/nuggies-npm
//https://www.npmjs.com/package/nuggies


//============

// La base des plugins ont étais développer par leur créateur.
// J'ai apporté beaucoup de modification par apport au bot que je voulais faire.

// The basis of the plugins were developed by their creator.
// I made a lot of changes for the bot I wanted to do.