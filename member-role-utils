export namespace GuildMemberRole {
  export async function highest(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== undefined)
      .sort((a, b) => b!.position - a!.position)[0];
  }
  export async function hoist(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.hoist)
      .sort((a, b) => b!.position - a!.position)
      .reverse()[0];
  }
  export async function color(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.color)
      .sort((a, b) => b!.position - a!.position)[0];
  }
}
