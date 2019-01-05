// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  trakt: {
    baseUrl: 'https://api.trakt.tv',
    oauth2AuthorizeUrl: 'https://trakt.tv/oauth/authorize',
    client_id: '5228f6d979840fe8f98e49371a5e9e76b9d67ac9cddde2c377504ffe35d3ede5',
    client_secret: '890476ae53cb66ace4cc57d93215a927f3d2da4c3627b249d8c908b431771181',
    version: '2',
    storageTokenKey: 'trakt_token'
  },
  tmdb: {
    baseUrl: 'https://api.themoviedb.org/3',
    api_key: '4f0d500599005839404a81de7e99e9ba'
  },
  kodi: {
    storageHostsKey: 'kodi_hosts',
    storageCurrentHostKey: 'kodi_current_host'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
