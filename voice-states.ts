const loggingchannel = '1234567812345678';

discord.on('VOICE_STATE_UPDATE', async (voiceState, oldVoiceState) => {
  const messages: string[] = [];

  if (voiceState.member !== oldVoiceState.member) return;
  if (voiceState.channelId !== oldVoiceState.channelId)
    messages.push(
      getVoiceChangeType(
        voiceState.member.toMention(),
        oldVoiceState.channelId
          ? `\`${(await oldVoiceState.getChannel())!.name}\``
          : undefined,
        voiceState.channelId
          ? `\`${(await voiceState.getChannel())!.name}\``
          : undefined
      )
    );

  /**
   * Server Deafen/Undeafen
   */

  if (voiceState.deaf !== oldVoiceState.deaf) {
    if (voiceState.deaf && !oldVoiceState.deaf) {
      messages.push(
        `🔇 ${voiceState.member.toMention()} was server deafened in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
    if (!voiceState.deaf && oldVoiceState.deaf) {
      messages.push(
        `🔊 ${voiceState.member.toMention()} was server undeafened in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
  }

  /**
   * Server Mute/Unmute
   */

  if (voiceState.mute !== oldVoiceState.mute) {
    if (voiceState.mute && !oldVoiceState.mute) {
      messages.push(
        `🎤 ${voiceState.member.toMention()} was server muted in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
    if (!voiceState.mute && oldVoiceState.mute) {
      messages.push(
        `🎤 ${voiceState.member.toMention()} was server unmuted in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
  }

  /**
   * Self Deafen/Undeafen
   */

  if (voiceState.selfDeaf !== oldVoiceState.selfDeaf) {
    if (voiceState.selfDeaf && !oldVoiceState.selfDeaf) {
      messages.push(
        `🔇 ${voiceState.member.toMention()} deafened themselves in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
    if (!voiceState.selfDeaf && oldVoiceState.selfDeaf) {
      messages.push(
        `🔊 ${voiceState.member.toMention()} was undeafened themselves in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
  }

  /**
   * Server Mute/Unmute
   */

  if (voiceState.selfMute !== oldVoiceState.selfMute) {
    if (voiceState.selfMute && !oldVoiceState.selfMute) {
      messages.push(
        `🎤 ${voiceState.member.toMention()} muted themselves in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
    if (!voiceState.selfMute && oldVoiceState.selfMute) {
      messages.push(
        `🎤 ${voiceState.member.toMention()} was unmuted themselves in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
  }

  /**
   * User Start/Stopped Streaming
   */
  if (voiceState.selfStream !== oldVoiceState.selfStream) {
    if (voiceState.selfStream && !oldVoiceState.selfStream) {
      messages.push(
        `🖥️ ${voiceState.member.toMention()} started streaming in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
    if (!voiceState.selfStream && oldVoiceState.selfStream) {
      messages.push(
        `🖥️ ${voiceState.member.toMention()} stopped streaming in ${getVCDisplay(
          (await voiceState.getChannel())!
        )} **[**||\`${voiceState.channelId}\`||**]**`
      );
    }
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
          `${timestamp} (\`Voice State Update\`) ${e}`
      )
      .join('\n')
  );
});
function getVoiceChangeType(itemName: string, oldVal: any, newVal: any) {
  if (!oldVal && newVal) return `${itemName} joined ${newVal}`;
  if (oldVal && !newVal) return `${itemName} left ${oldVal}`;
  if (oldVal && newVal) return `${itemName} moved from ${oldVal} to ${newVal}`;
  return `${itemName} was not changed`;
}
async function getVCDisplay(c: discord.GuildChannel) {
  return `${c.parentId ? `\`${(await c.getParent())!.name}\`**>**` : ''}\`${
    c.name
  }\``;
}
