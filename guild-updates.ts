/**
 *
 * Logging messages are from https://pyboat.i0.tf/i18n/source/base.json
 *
 */
const loggingchannel = '1234567812345678';
discord.on(discord.Event.GUILD_UPDATE, async (current, old) => {
  // for if multiple changes happen in one event
  const messages: string[] = [];
  if (current.name !== old.name)
    messages.push(
      `server name changed from \`${old.name}\` to \`${current.name}\``
    );

  if (current.region !== old.region)
    messages.push(
      `server region changed from **${old.region}** to **${current.region}**`
    );

  if (current.description !== old.description)
    messages.push(
      `server description changed from \`${old.description}\` to \`${current.description}\``
    );
  const dmnKeys = ['All Messages', 'Only Mentions'];
  if (current.defaultMessageNotifications !== old.defaultMessageNotifications)
    messages.push(
      `server default message notifications changed from **${
        dmnKeys[old.defaultMessageNotifications]
      }** to **${dmnKeys[current.defaultMessageNotifications]}**`
    );
  const nsfwLevelKeys = ['Disabled', 'Members Without Roles', 'All Members'];
  if (current.explicitContentFilter !== old.explicitContentFilter)
    messages.push(
      `server explicit content filter changed from **${
        nsfwLevelKeys[old.explicitContentFilter]
      }** to **${nsfwLevelKeys[current.explicitContentFilter]}**`
    );
  const verificationLevelKeys = ['None', 'Low', 'Medium', 'High', 'Very High'];
  if (current.verificationLevel !== old.verificationLevel)
    messages.push(
      `server verification level changed from **${
        verificationLevelKeys[old.verificationLevel]
      }** to **${verificationLevelKeys[current.verificationLevel]}**`
    );

  if (current.maxPresences !== old.maxPresences)
    messages.push(
      `server max presences changed from **${old.maxPresences}** to **${current.maxPresences}**`
    );
  const mfaLevelKeys = ['None', 'Elevated'];
  if (current.mfaLevel !== old.mfaLevel)
    messages.push(
      `server 2fa requirement for moderation changed from **${
        mfaLevelKeys[old.mfaLevel]
      }** to **${mfaLevelKeys[current.mfaLevel]}**`
    );
  if (current.ownerId !== old.ownerId)
    messages.push(
      `server ownership changed from <@!${old.ownerId}> to <@!${current.ownerId}>`
    );
  if (current.afkChannelId !== old.afkChannelId) {
    messages.push(
      getChangeType(
        `server afk channel`,
        old.afkChannelId ? `<#${old.afkChannelId}>` : undefined,
        current.afkChannelId ? `<#${current.afkChannelId}>` : undefined
      )
    );
  }

  if (current.afkTimeout !== old.afkTimeout)
    messages.push(
      `server voice afk timeout changed from **${old.afkTimeout}**s to **${current.afkTimeout}**s`
    );
  if (current.premiumTier !== old.premiumTier)
    messages.push(
      `server boost tier changed from **${old.premiumTier}** to **${current.premiumTier}**`
    );
  if (current.premiumSubscriptionCount !== old.premiumSubscriptionCount)
    messages.push(
      `server boost count changed from **${old.premiumSubscriptionCount}** to **${current.premiumSubscriptionCount}**`
    );
  if (current.systemChannelId !== old.systemChannelId)
    messages.push(
      getChangeType(
        `server system channel`,
        old.systemChannelId ? `<#${old.systemChannelId}>` : undefined,
        current.systemChannelId ? `<#${current.systemChannelId}>` : undefined
      )
    );
  if (current.vanityUrlCode !== old.vanityUrlCode)
    messages.push(
      getChangeType(
        `server vanity url`,
        old.vanityUrlCode,
        current.vanityUrlCode
      )
    );
  if (current.widgetEnabled !== old.widgetEnabled)
    messages.push(
      `server widget changed from **${old.widgetEnabled}** to **${current.widgetEnabled}**`
    );
  if (current.widgetChannelId !== old.widgetChannelId)
    messages.push(
      getChangeType(
        `server widget channel`,
        old.widgetChannelId ? `<#${old.widgetChannelId}>` : undefined,
        current.widgetChannelId ? `<#${current.widgetChannelId}>` : undefined
      )
    );
  // shittily check if arrays arent equal
  if (current.features.sort().toString() !== old.features.sort().toString()) {
    const diff = makeArrayDiff(current.features, old.features);
    const diffBlock = `\`\`\`diff
${diff.added.join('\n')}
${diff.removed.join('\n')}
\`\`\``;
    messages.push(`server features changed: ${diffBlock}`);
  }

  const ch = await discord.getGuildTextChannel(loggingchannel);
  if (!ch) throw new Error('invalid logging channel id');
  const timestamp = `\`[${new Date()
    .toLocaleTimeString()
    .replace(/[^\d:]/g, '')}]\``;
  ch.sendMessage(
    messages
      .map(
        (e) =>
          `${timestamp} ${discord.decor.Emojis.MAP} (\`Guild Update\`) ${e}`
      )
      .join('\n')
  );
});
function getChangeType(itemName: string, oldVal: any, newVal: any) {
  if (!oldVal && newVal) return `${itemName} added: ${newVal}`;
  if (oldVal && !newVal) return `${itemName} removed: ${oldVal}`;
  if (oldVal && newVal)
    return `${itemName} changed from ${oldVal} to ${newVal}`;
  return `${itemName} was not changed`;
}
export function makeArrayDiff(current: any[], old: any[]) {
  return {
    added: current.filter((e) => !old.includes(e)).map((e) => `+ ${e}`),
    removed: old.filter((e) => !current.includes(e)).map((e) => `- ${e}`)
  };
}
