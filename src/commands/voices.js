const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { HasApiKey } = require('../db.js')

const url = "https://api.elevenlabs.io/v1/voices"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voices')
        .setDescription('Replies with the possible voices to synthesize with.'),
    async execute(interaction) {
        hasApiKey = await HasApiKey(interaction.user.id);
        if (!hasApiKey)
            await interaction.replay("No API KEY is set. Please set one using the command `/setkey`");

        const resp = await axios.get(url);
        const voices = resp.data.voices.slice(0, 25);
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('ElevenLabs.io available voices')
            .setDescription('All voices from elevenlabs');

        voices.forEach(voice => {
            embed.addFields({
                name: `Voice ${voice.name}`,
                value: `**Id:** ${voice.voice_id}\n**Gender:** ${voice.labels.gender}\n**Accent:** ${voice.labels.accent}`,
                inline: false
            }
            );
        });

        await interaction.user.send({ embeds: [embed] });
        await interaction.reply("A list of voices is privately send.");
    },
};