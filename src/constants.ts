export const GithubUrl = 'https://github.com/overextended';

export const GithubApi = 'https://api.github.com/repos/overextended';

export const DocsUrl = 'https://overextended.dev';

export const Resources = ['ox_lib', 'ox_inventory', 'oxmysql', 'ox_core', 'ox_fuel', 'ox_target', 'ox_doorlock'];

export const ResourceChoices = (() => {
  const arr: { name: string; value: string }[] = new Array(Resources.length);

  Resources.forEach((value, index) => {
    arr[index] = { name: value, value: value };
  });

  return arr;
})();
