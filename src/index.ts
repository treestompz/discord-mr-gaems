require('dotenv').config()
import { Client, Intents, TextChannel } from 'discord.js'

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const YES_EMOTE = '✅'
const NO_EMOTE = '❌'
const MAYBE_EMOTE = '❔'

client.once('ready', () => {
  console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const { commandName } = interaction

  if (commandName === 'gaems') {
    handleGaemsCommand(interaction)
  }
})

function getStartMsg(channelName) {
  let START_MSG = `Hi **#${channelName}**, I'm MR. GAEMS v.0.0.1! I actually do take "No" for an answer. And "Yes," and "Maybe." What I don't take is being ignored! Do that and you'll really piss me off!\n\nPlease respond to all days using the emote key: (LIMIT 1 EMOTE PER DAY)\n`
  START_MSG += `\n${YES_EMOTE}: **Yes**, as of now, I definitely **CAN** GAEMS on this day.`
  START_MSG += `\n${NO_EMOTE}: **No**, as of now, I definitely can **NOT** GAEMS on this day.`
  START_MSG += `\n${MAYBE_EMOTE}: **Maybe**, as of now, I think I might be able to but not sure yet.\n`
  START_MSG += `--------------\n`

  return START_MSG
}

async function handleGaemsCommand(interaction) {
  let channelId = interaction.channelId
  let channel = client.channels.cache.get(channelId) as TextChannel
  let startMsg = getStartMsg(channel.name)
  const message = await interaction.reply({
    content: startMsg,
    fetchReply: true,
  })

  let days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]
  for (let i = 0; i < days.length; i++) {
    await sendDayMessage(channel, days[i])
  }
}

async function sendDayMessage(channel: TextChannel, dayName: string) {
  let msg = await channel.send(dayName)
  await addReacts(msg)
}

async function addReacts(message) {
  await message.react(YES_EMOTE)
  await message.react(NO_EMOTE)
  await message.react(MAYBE_EMOTE)
}

client.login(process.env.DISCORD_BOT_TOKEN)
