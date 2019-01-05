# What is it?

wako is a mobile app (for now) build with [ionic](https://github.com/ionic-team/ionic) to sync what you're watching with [trakt.tv](https://trakt.tv).
It also provides a simple remote control for Kodi and allow you to play any movies or tv shows (using [providers](https://github.com/JumBay/wako/blob/master/README.md#provider))
via [Elementum](https://github.com/elgatito/plugin.video.elementum) addon

# Installation

## Android

Go on the [release](https://github.com/JumBay/wako/releases/) page, download and install the latest apk for your device.

## iOS

You have to build by yourself the app and running it on your device using xcode.

# How it works?

Launch the app, sign in with trakt.tv and there you go.

## Kodi

If you want to use wako as a kodi remote control you need to allow **remote control via HTTP**
in Kodi > Settings > Services > Control. Then configure the host on wako > Settings > Kodi

## Provider

When you navigate to a movie or tv show, wako is trying to find some sources for this media by using the **providers** you set.
wako doesn't provide any providers, it has to be added manually in Settings > Providers.
You need to add a list of providers in a JSON format:

```json
{
  "my_first_provider": {
    "name": "MyProvider",
    "enabled": true,
    "enabled_in_list": true,
    "languages": ["en"],
    "base_url": "https://www.my-provider.com/search/",
    "response_type": "text",
    "movie": {
      "query": "{query}/Movies/1/",
      "keywords": "{title} {year}"
    },
    "episode": {
      "query": "{query}/TV/1/",
      "keywords": "{title} {episodeCode}"
    },
    "html_parser": {
      "row": "doc.querySelectorAll('tbody > tr')",
      "title": "row.querySelector('a:nth-child(2)').innerHTML",
      "peers": "row.querySelector('.leeches').innerHTML",
      "seeds": "row.querySelector('.seeds').innerHTML",
      "size": "row.querySelector('tbody > tr .size').textContent.split('B')[0] + 'B'",
      "url": "'https://www.my-provider.com/'+ row.querySelector('a:nth-child(2)').getAttribute('href')"
    }
  }
}
```

Here are all the properties that can be set:

```TS
export interface Provider {
 name: string;
 enabled: boolean;
 enabled_in_list: boolean;
 languages: string[];
 base_url: string;
 response_type: 'json' | 'text';
 time_to_wait_between_each_request_ms?: number;
 time_to_wait_on_too_many_request_ms?: number;
 token?: {
   query: string;
   token_validity_time_ms?: number;
   token_format: {
     token: string;
   };
 };
 movie?: {
   query: string;
   keywords: string;
 };
 episode?: {
   query: string;
   keywords: string;
 };
 json_format?: {
   results: string;
   sub_results?: string;
   url: string;
   title: string;
   seeds: string;
   peers: string;
   size: string;
   quality?: string;
 };
 html_parser?: {
   row: string;
   url: string;
   title: string;
   seeds: string;
   peers: string;
   size: string;
 };
}

```

# Screenshots

![](https://github.com/JumBay/wako/blob/master/resources/github/screen1.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen2.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen3.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen4.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen5.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen6.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen7.png?raw=true)
![](https://github.com/JumBay/wako/blob/master/resources/github/screen8.png?raw=true)
