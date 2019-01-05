// import { Injectable } from '@angular/core';
// import { MusicControls } from '@ionic-native/music-controls/ngx';
// import { KodiService } from './kodi.service';
// import { KodiPropertiesStructure } from '../kodi/structures/kodi-properties.structure';
// import { KodiSeekToCommand } from '../kodi/commands/kodi-seek-to.command';
// import { KodiExcuteActionCommand } from '../kodi/commands/kodi-excute-action.command';
// import { Subscription } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class PlayerControlNativeService {
//
//   private musicCtrl = null;
//   private musicSubscriber: Subscription;
//
//   constructor(private musicControls: MusicControls, private kodiService: KodiService) {
//
//     this.kodiService.kodiProperties$.subscribe(properties => this.refresh(properties));
//   }
//
//   private refresh(props: KodiPropertiesStructure) {
//
//     console.log({props});
//
//     if (!props.player.isPlaying) {
//
//
//       this.musicControls.destroy();
//       this.musicCtrl = null;
//       this.musicSubscriber.unsubscribe();
//
//       return;
//     }
//
//
//     // playing
//     if (!this.musicCtrl) {
//       this.musicCtrl = true;
//
//       this.musicControls.create({
//         track       : 'Time is Running Out',		// optional, default : ''
//         artist      : 'Muse',						// optional, default : ''
//         cover       : 'albums/absolution.jpg',		// optional, default : nothing
//         // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
//         //			 or a remote url ('http://...', 'https://...', 'ftp://...')
//         isPlaying   : true,							// optional, default : true
//         dismissable : true,							// optional, default : false
//
//         // hide previous/next/close buttons:
//         hasPrev   : false,		// show previous button, optional, default: true
//         hasNext   : false,		// show next button, optional, default: true
//         hasClose  : true,		// show close button, optional, default: false
//
//         // iOS only, optional
//         album       : 'Absolution',     // optional, default: ''
//         duration : 60, // optional, default: 0
//         elapsed : 10, // optional, default: 0
//         hasSkipForward : true, //optional, default: false. true value overrides hasNext.
//         hasSkipBackward : true, //optional, default: false. true value overrides hasPrev.
//         skipForwardInterval : 15, //optional. default: 0.
//         skipBackwardInterval : 15, //optional. default: 0.
//         hasScrubbing : false, //optional. default to false. Enable scrubbing from control center progress bar
//
//         // Android only, optional
//         // text displayed in the status bar when the notification (and the ticker) are updated
//         ticker	  : 'Now playing "Time is Running Out"',
//         //All icons default to their built-in android equivalents
//         //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
//         playIcon: 'media_play',
//         pauseIcon: 'media_pause',
//         prevIcon: 'media_prev',
//         nextIcon: 'media_next',
//         closeIcon: 'media_close',
//         notificationIcon: 'notification'
//       }).then(a => {
//         console.log('create ok ', a);
//       }, err => {
//         console.log('create err ', err);
//       });
//
//       console.log('Create');
//
//       this.musicSubscriber = this.musicControls.subscribe().subscribe(action => {
//         let actionToExecute = null;
//
//         console.log('action', action);
//         const message = JSON.parse(action).message;
//         switch (message) {
//           case 'music-controls-pause':
//             actionToExecute = 'pause';
//             break;
//           case 'music-controls-play':
//             actionToExecute = 'play';
//             break;
//           case 'music-controls-skip-backward':
//             actionToExecute = 'stepback';
//             break;
//           case 'music-controls-skip-forward':
//             actionToExecute = 'stepforward';
//             break;
//
//           // External controls (iOS only)
//           case 'music-controls-toggle-play-pause' :
//             actionToExecute = props.player.isPaused ? 'play' : 'pause';
//             break;
//           case 'music-controls-seek-to':
//             const seekToInSeconds = JSON.parse(action).position;
//             KodiSeekToCommand.handle(seekToInSeconds).subscribe();
//             break;
//           default:
//             break;
//         }
//         console.log({actionToExecute});
//
//         if (actionToExecute) {
//           KodiExcuteActionCommand.handle(actionToExecute).subscribe();
//         }
//       });
//
//       this.musicControls.listen();
//       this.musicControls.updateIsPlaying(true);
//     } else {
//       this.musicControls.updateElapsed({
//         elapsed: props.player.media.currentSeconds.toString(),
//         isPlaying: !props.player.isPaused
//       });
//     }
//
//   }
// }
