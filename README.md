# ElevenLabs-DiscordTTS
<blockquote>
<p>A Simple bot for joining voice channels and playign ElevenLabs TTS lines over voice channels.</p>
</blockquote>

This is a very simple bot you can host yourself. Using the `/speak` command speaking can be triggered. <i>Made in an hour but improvements are planned.</i>

### Config.js
To run the bot a `config.json` file is required in the working directory.

<b>config.js</b>
```
{
	"token": "<secret token>",
    "clientId": "<client id>"
}
```

### Running the bot
<b>To run the bot: </b><br>
```npm run start```

<b>To run the bot in dev mode:</b> <br>
```npm run dev```

### TODO List:
- Proper voice line queue.
- Better speak command.
- Better feedback to users.
- User settings
- Speak command include style settings etc.