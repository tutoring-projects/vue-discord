/* eslint-disable camelcase */
const axios = require('axios');
const btoa = require('btoa');
const discord = require('discord.js');

let guild;
let client;

const credentials = {
  id: '', /* Client ID */
  secret: '', /* Client Secret */
  token: '', /* Application's Bot Token, used for obtaining user info */
  server_id: '',
  role: '',
};

const api = async (path, Authorization, options = {}) => (await axios(
  Object.assign({
    url: `https://discordapp.com/api/${path}`,
    headers: {
      Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }, options),
)).data;

const user = async ({ id, token }) => {
  const data = await (await api(
    // eslint-disable-next-line prefer-template
    'users/' + (token ? '@me' : id),
    token ? `Bearer ${token}` : `Bot ${credentials.token}`,
  ));

  if (data.error) throw data.error;

  return {
    ...data,
    avatar_url: `https://cdn.discordapp.com/${
      data.avatar
        ? `avatars/${data.id}/${data.avatar}`
        : `embed/avatars/${data.discriminator % 5}`
    }.png`,
  };
};

// eslint-disable-next-line no-shadow
const code = async ({ code, redirect_uri, client_id }) => {
  const token = await api(
    `oauth2/token?grant_type=authorization_code&code=${code}&client_id=${client_id}&redirect_uri=${redirect_uri}`,
    `Basic ${btoa(`${credentials.id}:${credentials.secret}`)}`,
    { method: 'POST' },
  );

  if (token.error) throw token.error_description;

  return {
    success: true,
    token,
    user: await user({
      token: token.access_token,
    }),
  };
};

const refresh = async ({ refresh_token, redirect_uri }) => {
  const token = await api(
    `oauth2/token?grant_type=refresh_token&refresh_token=${refresh_token}&redirect_uri=${redirect_uri}`,
    `Basic ${btoa(`${credentials.id}:${credentials.secret}`)}`,
    { method: 'POST' },
  );

  if (token.error) throw token.error_description;

  return {
    success: true,
    token,
    user: await user({
      token: token.access_token,
    }),
  };
};

const add_to_guild = async ({ id, access_token: accessToken }) => {
  const member = await guild.addMember(
    await client.fetchUser(id),
    { accessToken },
  );

  await member.addRole(credentials.role);
};

const remove_from_guild = async ({ id }) => {
  const member = await guild.members.get(id);

  try {
    await member.send(`You have been kicked from **${guild.name}** because your subscription to **Supscript** has ended.`);
  } catch (error) { console.log(error); }

  await member.kick();
};

const is_present = ({ id }) => Boolean(
  guild.members.get(id)
);

const has_role = async ({ id, guild_id, role_id }) => {
  const member = await client.guilds.get(guild_id).members.get(id);

  return Boolean(
    member.roles.find(
      role => role.id === role_id
    )
  );
};

const init = (_credentials) => {
  Object.assign(credentials, _credentials);
  client = new discord.Client();
  client.login(credentials.token);
  client.on('ready', async () => {
    // guild = client.guilds.get(credentials.server_id);
    console.log(`Discord Client ready, logged in as ${client.user.tag}.`);
  });
};

module.exports = {
  api,
  user,
  code,
  refresh,
  credentials,
  init,
  add_to_guild,
  remove_from_guild,
  is_present,
  has_role,
};
