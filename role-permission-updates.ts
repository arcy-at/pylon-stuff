const permissions = [
  'CREATE_INSTANT_INVITE',
  'KICK_MEMBERS',
  'BAN_MEMBERS',
  'ADMINISTRATOR',
  'MANAGE_CHANNELS',
  'MANAGE_GUILD',
  'ADD_REACTIONS',
  'VIEW_AUDIT_LOG',
  'PRIORITY_SPEAKER',
  'STREAM',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
  'VIEW_GUILD_ANALYTICS',
  'CONNECT',
  'SPEAK',
  'MUTE_MEMBERS',
  'DEAFEN_MEMBERS',
  'MOVE_MEMBERS',
  'USE_VAD',
  'CHANGE_NICKNAME',
  'CHANGE_NICKNAMES',
  'MANAGE_ROLES',
  'MANAGE_WEBHOOKS',
  'MANAGE_EMOJIS'
];

function bitfieldToArray(bitfield: number) {
  return permissions.filter((_, i) => {
    const current = 1 << i;
    return (bitfield & current) === current;
  });
}
export function capitalizeWords(s: string) {
  return s.replace(/(^|[ ])./g, (e) => e.toUpperCase());
}
export function makePermissionDiff(
  newPermissions: number,
  oldPermissions: number
) {
  // i can barely read this code lol
  return {
    added: bitfieldToArray(newPermissions)
      .filter((e) => !bitfieldToArray(oldPermissions).includes(e))
      .map((e) => `+ ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`),
    removed: bitfieldToArray(oldPermissions)
      .filter((e) => !bitfieldToArray(newPermissions).includes(e))
      .map((e) => `- ${capitalizeWords(e.toLowerCase().replace(/_/g, ' '))}`)
  };
}
const logging_channel_id = '811678324391804968';
discord.on('GUILD_ROLE_UPDATE', async (event, old) => {
  if (event.role.permissions !== old.permissions) {
    const ch = (await discord.getGuildTextChannel(logging_channel_id))!;
    const diff = makePermissionDiff(event.role.permissions, old.permissions);
    const timestamp = `\`[${new Date()
      .toLocaleTimeString()
      .replace(/[^\d:]/g, '')}]\``;
    const formattedID = `**[**||\`${event.role.id}\`||**]**`;
    const diffBlock = `\`\`\`diff
${diff.added.length ? diff.added.join('\n') : ''}${
      diff.removed.length ? '\n' + diff.removed.join('\n') : ''
    }
\`\`\``;
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} permissions edited: ${diffBlock}`
    );
  }
});
