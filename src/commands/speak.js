const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { pipeline } = require('node:stream/promises');
const fs = require('fs');
const path = require('node:path');
const axios = require('axios');
const { v4 } = require('uuid');
const { HasApiKey, GetApiKey } = require('../db.js')
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const voicesurl = "https://api.elevenlabs.io/v1/voices"
const generateurl = "https://api.elevenlabs.io/v1/text-to-speech/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Generates and plays the clip in a sound channel.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to speak')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('voicename')
                .setDescription('The name of the voice to speak as')
                .addChoices(
                    { name: 'Adam', value: 'Adam' },
                    { name: 'Emily', value: 'Emily' },
                    { name: 'Mimi', value: 'Mimi' },
                ))
        .addStringOption(option =>
            option.setName('voiceid')
                .setDescription('The id of the voice to speak as')),
    async execute(interaction) {
        hasApiKey = await HasApiKey(interaction.user.id);
        if (!hasApiKey)
            await interaction.replay("No API KEY is set. Please set one using the command `/setkey`");

        apikey = await GetApiKey(interaction.user.id);

        await interaction.reply("Working."); // TEMP: Need quick response for timeout.

        let voiceid = interaction.options.getString('voiceid');

        if (voiceid == null) {
            const resp = await axios.get(voicesurl);
            const voiceoptions = resp.data.voices.find((e) => e.name == interaction.options.getString('voicename'));
            voiceid = voiceoptions.voice_id;
        }

        const data = {
            text: interaction.options.getString('text'),
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.5,
                use_speaker_boost: true
            }
        }

        const headers = {
            'Accept': 'audio/mpeg',
            'xi-api-key': apikey,
            'Content-Type': 'application/json',
        }

        const response = await axios.post(generateurl + voiceid + "/stream", JSON.stringify(data), { headers: headers, responseType: 'stream' })
            .catch(error => {
                console.error('Error:', error);
            });

        const genid = v4();

        //await interaction.reply("You message is queued.");
        await pipeline(response.data, fs.createWriteStream(`clips/${genid}.mp3`));
        //await interaction.user.send({ content: data.text, files: [`./clips/${genid}.mp3`] });

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        console.log(path.join(process.cwd(),`clips/${genid}.mp3`));
        const resource = createAudioResource(path.join(process.cwd(), `clips/${genid}.mp3`));
        const player = createAudioPlayer();
        connection.subscribe(player);
        player.play(resource) // Need a queue here
    },
};