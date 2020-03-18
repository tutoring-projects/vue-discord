const express = require('express')

const router = express.Router()

const discord = require('./discord.js')

const { baseUrl, discord: discordConfig } = require('../config.json')
const { clientId, clientSecret, botToken } = discordConfig

discord.init({
  id: clientId,
  secret: clientSecret,
  token: botToken,
})

router.get('/helloworld', (req, res) => {
  res.send('hello world')
})

router.get('/user/:id', async (req, res) => {
  const user = await discord.user({
    id: req.params.id
  })

  res.json(user)
})

router.get('/code/:code', async (req, res) => {
  const response = await discord.code({
    code: req.params.code,
    redirect_uri: baseUrl + '/discord/code',
    client_id: clientId
  })
  
  res.json(response)
})

router.get('/login', (req, res) => {
  res.send(`https://discordapp.com/oauth2/authorize?client_id=${
    clientId
  }&scope=identify%20guilds.join&response_type=code&redirect_uri=${
    baseUrl + '/discord/code'
  }`)
})

module.exports = router