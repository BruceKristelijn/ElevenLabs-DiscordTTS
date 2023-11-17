const { SlashCommandBuilder } = require('discord.js');
const { SetApiKey, GetApiKey } = require('../db.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setkey')
		.setDescription('Sets your personal apikey.')
		.addStringOption(option =>
			option.setName('key')
				.setDescription('The apikey to save.')
				.setRequired(true)),
	async execute(interaction) {
		await SetApiKey(interaction.user.id, interaction.options.getString('key'))
		await interaction.reply('Elevenlabs API Key saved.');
	},
};