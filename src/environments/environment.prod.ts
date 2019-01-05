export const environment = {
  production: true,
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
  omdb: {
    baseUrl: 'http://www.omdbapi.com',
    tokenUrl: 'http://www.omdbapi.com/src/application.js'
  },
  kodi: {
    storageHostsKey: 'kodi_hosts',
    storageCurrentHostKey: 'kodi_current_host'
  }
};
