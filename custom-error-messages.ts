async function errorFn(
  context: discord.command.ICommandContextDeprecated,
  error: Error
) {
  console.error(error);
  if (error.name !== 'ArgumentError') {
    const error_message = `something stupid happened (${error.name}: ${error.message})`;
    await context.message.reply(
      `${error_message}\n\`\`\`\n${error.stack}\`\`\``
    );
  } else {
    const missing_args_message = `i need correct arguments dumbass (${error.name}: ${error.message})`;
    const usage = (context.command as any).argumentConfigList
      .map((e: any) => {
        const optional = (e[1].type as string).endsWith('Optional');
        const brackets = {
          left: optional ? '(' : '<',
          right: optional ? ')' : '>'
        };
        return `${brackets.left}${e[0]}: ${e[1].type}${brackets.right}`;
      })
      .join(' ');
    await context.message.reply(
      `${missing_args_message}
\`\`\`
${usage}
\`\`\``
    );
  }
}
commands.on(
  {
    name: 'testcmd',
    onError: errorFn
  },
  (args) => ({
    number: args.integer(),
    string: args.string(),
    optional: args.textOptional()
  }),
  async function(message, { number, string, optional }) {
    throw new Error('hi');
    await message.reply('how does this even happen');
  }
);
