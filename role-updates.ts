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
  'MANAGE_NICKNAMES',
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
  const ch = (await discord.getGuildTextChannel(logging_channel_id))!;
  const timestamp = `\`[${new Date()
    .toLocaleTimeString()
    .replace(/[^\d:]/g, '')}]\``;
  const formattedID = `**[**||\`${event.role.id}\`||**]**`;
  /**
   * Role Permission Updates
   */
  if (event.role.permissions !== old.permissions) {
    const diff = makePermissionDiff(event.role.permissions, old.permissions);

    const diffBlock = `\`\`\`diff
${diff.added.length ? diff.added.join('\n') : ''}${
      diff.removed.length ? '\n' + diff.removed.join('\n') : ''
    }󠁡
\`\`\``;
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} permissions edited: ${diffBlock}`
    );
  }
  /**
   * Role position changed
   */
  if (event.role.position !== old.position) {
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} position was changed: \`${
        old.position
      }\` ${discord.decor.Emojis.ARROW_RIGHT} \`${event.role.position}\``
    );
  }
  /**
   * Role hoist changed
   */
  if (event.role.hoist !== old.hoist) {
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} hoist state was changed to \`${capitalizeWords(
        `${event.role.hoist}`
      )}\``
    );
  }
  /**
   * Role mentionable changed
   */
  if (event.role.mentionable !== old.mentionable) {
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} mentionable state was changed to \`${capitalizeWords(
        `${event.role.mentionable}`
      )}\``
    );
  }
  /**
   * Role managed changed
   * NOTE: This should never fire.
   */
  if (event.role.managed !== old.managed) {
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} managed role status was changed to \`${capitalizeWords(
        `${event.role.managed}`
      )}\``
    );
  }
  /**
   * Role color changed
   */
  if (event.role.color !== old.color) {
    const oldColor = old.color.toString(16);
    const newColor = event.role.color.toString(16);
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} color was changed: \`#${oldColor}\` ➡️ \`${newColor}\``
    );
  }
  /**
   * Role name changed
   */
  if (event.role.name !== old.name) {
    ch.sendMessage(
      `${timestamp} ${
        discord.decor.Emojis.GEAR
      } (\`Guild Role Update\`) ${event.role.toMention()} ${formattedID} name was changed:  \n**•** __Before__: \`${
        old.name
      }\`\n**•** __After__:   \`${event.role.name}\``
    );
  }
});
