const commands = new discord.command.CommandGroup();
let messageId: string | null = null;
let authorId: string | null = null;
const defaultEmbedColor: number = 3092790; // 0x2f3136
interface IMenuItem {
  title: string; // The embed's title
  text: string; // The embed's text
  description?: string; // The embed's SUBTITLE, not the text
  asCancel?: boolean; // Whether to use the option to cancel the entire reaction menu or not
  color?: number; // The color on the side of the embed
  aliases?: string[];
}
const options = new Map<discord.decor.Emojis | string, IMenuItem>([
  [
    discord.decor.Emojis.A,
    {
      title: 'option a',
      text: 'hi',
      aliases: ['test']
    }
  ],
  [
    discord.decor.Emojis.B,
    {
      title: 'option b',
      text: 'hi number 2',
      description: 'this another option!'
    }
  ],
  [
    discord.decor.Emojis.X,
    {
      title: 'cancel menu',
      text: 'deleted menu',
      description: 'this will delete the current menu',
      asCancel: true
    }
  ]
]);

const optionKeys = Array.from(options.keys());
commands.on(
  {
    name: 'menu',
    aliases: ['help'],
    description: 'Displays help options'
  },
  (args) => ({
    optionalSelection: args.textOptional()
  }),
  async (msg, { optionalSelection }) => {
    if (optionalSelection) {
      // Get the data associated with the reaction
      const item =
        options.get(optionalSelection) ??
        options.get(
          Array.from(options.keys()).find((v) => {
            // what the fuck lol
            const value = options.get(v)!;
            const nameCheck =
              value.title.toLowerCase() === optionalSelection.toLowerCase();
            const aliasCheck = (value.aliases ?? [])
              .map((v) => v.toLowerCase())
              .includes(optionalSelection.toLowerCase());
            return nameCheck || aliasCheck;
          }) ?? ''
        );
      if (!item) return await msg.reply('❌ I could not find that menu');

      if (item.asCancel)
        return await msg.reply("❌ There isn't anything to cancel!");

      // Create the reaction embed
      const emb = new discord.Embed()
        .setColor(item.color ?? defaultEmbedColor)
        .setTitle(item.title)
        .setDescription(item.text)
        .setFooter({
          text: `${optionalSelection} Requested by ${msg.author.getTag()}`,
          iconUrl: msg.author.getAvatarUrl()
        });

      // Send the embed
      await msg.reply(emb);

      // Set the global message and author variables to null
      messageId = null;
      authorId = null;
    } else
      await msg
        .reply(
          new discord.Embed({
            color: defaultEmbedColor,
            title: 'Help Menu',
            description: `What do you need help with?
${optionKeys
  .map((v) => {
    const item = options.get(v)!;
    return `${v} - ${item.title}${
      item.aliases ? ` (${item.aliases.join(', ')})` : ''
    }${item.description ? `\n*${item.description}*` : ''}`;
  })
  .join('\n\n')}`
          })
        )
        .then(async (message) => {
          optionKeys.forEach(async (v) => await message.addReaction(v)); // Add all reactions

          // Set the stored objects
          messageId = message.id;
          authorId = msg.author.id;
        });
  }
);

discord.on(discord.Event.MESSAGE_REACTION_ADD, async (theReaction) => {
  // Get the reaction menu
  const reactionMenu = await (
    await discord.getGuildTextChannel(theReaction.channelId)
  )?.getMessage(theReaction.messageId);

  // If there somehow isn't a reaction menu then don't do anything.
  if (!reactionMenu) return;

  if (
    theReaction.emoji.type === discord.Emoji.Type.UNICODE &&
    options.has(theReaction.emoji.name!) && // Check if the reaction is in the embed's options
    theReaction.messageId == messageId && // Check if the reactions message is the same as the stored one
    theReaction.member && // Check if it even has a member associated with it (otherwise its a webhook)
    theReaction.member.user.id == authorId // Check if the member is the same as the stored one
  ) {
    // Get the data associated with the reaction
    const item = options.get(theReaction.emoji.name!);
    if (!item) return;

    // Create the reaction embed
    const emb = new discord.Embed()
      .setColor(item.color ?? defaultEmbedColor)
      .setTitle(item.title)
      .setDescription(item.text)
      .setFooter({
        text: `${
          theReaction.emoji.name
        } Requested by ${theReaction.member.user.getTag()}`,
        iconUrl: theReaction.member.user.getAvatarUrl()
      });

    // Send the embed
    const response = await reactionMenu.reply(emb);

    // Set the global message and author variables to null
    messageId = null;
    authorId = null;

    // Delete the reaction menu after sending the response
    await reactionMenu.delete();

    // If marked as a cancel option, delete it
    if (item.asCancel) setTimeout(() => response?.delete(), 5000);
  }
});
