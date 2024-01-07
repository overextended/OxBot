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

// ignored role IDs for onMessageCreate.ts
export const ignoredRoles = [
  '814181424840179733', // Admin
  '819891382114189332', // Shrimp Supreme
  '933681479878324234', // Dictator
  '892853647950618675', // Overextended
  '831961060314972170', // Senior Moderator
  '945991885783175189', // Moderator
  '906292806098759750', // Contributor
  '1120932120056057926', // Affiliate
  '816709868764921876', // Coffee Drinker
  '842456416019021895', // Recognized Member
  '1140367518230397029', // GitHub
];

// channel ID for support-guidelines
export const guidelines = '<#1114827068337815612>';

export const whitelistedChannels = [
  '829915571394052176', // coffee-club
  '906294817678590012', // nerd-club
];