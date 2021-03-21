export namespace RoleUtil {
  /**
   * Union type between Role and Snowflake
   */
  type roleFlake = discord.Role | discord.Snowflake;
  /**
   * Gets a user's highest role.
   * @param {discord.GuildMember} user
   */
  export async function getHighest(user: discord.GuildMember) {
    const guild = await discord.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null)
      .sort((a, b) => b!.position - a!.position)[0];
  }
  /**
   * Gets a user's hoist role (highest role that is hoisted)
   * @param {discord.GuildMember} user
   */
  export async function getHoist(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.hoist)
      .sort((a, b) => b!.position - a!.position)
      .reverse()[0];
  }
  /**
   * Gets a user's member list color (highest role with a color)
   * @param {discord.GuildMember} user
   */
  export async function getColor(user: discord.GuildMember) {
    const guild = await user.getGuild();
    const roles = [];
    for (const role of user.roles) roles.push(await guild.getRole(role));
    return roles
      .filter((e) => e !== null && e.color)
      .sort((a, b) => b!.position - a!.position)[0];
  }
  /**
   * Sets a users roles.
   * Note: This will remove all the users roles!
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function set(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: ids
    });
  }
  /**
   * Adds roles to a user.
   * @param {roleFlake[]} roles
   */
  export async function add(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: user.roles.concat(ids)
    });
  }
  /**
   * Removes roles from a user.
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function remove(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    await user.edit({
      roles: user.roles.filter((e) => !ids.includes(e))
    });
  }
  /**
   * Get a user's roles.
   * @param {discord.GuildMember} user
   */
  export async function get(user: discord.GuildMember) {
    const guild = await discord.getGuild();
    const r = await Promise.all(user.roles.map((id) => guild.getRole(id)));
    return r
      .filter((e) => e !== null)
      .sort((a, b) => b!.position - a!.position);
  }
  /**
   * Removes **every** role from a user.
   */
  export async function clear(user: discord.GuildMember) {
    await user.edit({
      roles: []
    })
  }
  /**
   * Check if the user has any of the roles
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function has(user: discord.GuildMember, roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    return ids.every((i) => user.roles.includes(i));
  }
  /**
   * Check if the user does not have any of the roles
   * @param {discord.GuildMember} user
   * @param {roleFlake[]} roles
   */
  export async function doesNotHave(user: discord.GuildMember, roles: roleFlake[]) {
    return !has(user, roles);
  }
  /**
   * Returns an array of members that have this role.
   * @param {roleFlake} role
   */
  export async function members(role: roleFlake) {
    const id = role instanceof discord.Role ? role.id : role;
    const mem = [];
    const guild = await discord.getGuild();
    for await (const e of guild.iterMembers()) {
      if (e.roles.includes(id)) mem.push(e);
    }
    return mem;
  }
  /**
   * Returns a collective array of members that have any of the roles
   * @param {roleFlake[]} roles
   */
  export async function membersCollective(roles: roleFlake[]) {
    const ids = roles.map((e) => (e instanceof discord.Role ? e.id : e));
    const mem = [];
    const guild = await discord.getGuild();
    for (const r of ids) {
      for await (const e of guild.iterMembers()) {
        if (e.roles.includes(r)) mem.push(e);
      }
    }
    return mem;
  }
  /**
   * Returns the role for @everyone (same as the guild ID)
   */
  export async function everyone() {
    return (await discord.getGuild()).id;
  }
}
