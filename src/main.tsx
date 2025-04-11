import { Devvit, useState, useWebView, type UseWebViewResult } from '@devvit/public-api';
Devvit.configure({
  redditAPI: true,
  redis: true,
});

import './app/blocks/addMenuItem.js';

import { RedisService } from './app/services/RedisService.js';
import { devvitLogger } from './shared/TODOlogger.js';
import { SplashScreen } from './app/SplashScreen.js'
import type { DevvitMessage, WebViewMessage, PostMessageMessages } from './shared/message.js';

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Snake Game',
  height: 'regular',
  render: (context: Devvit.Context) => {

    const redisService = new RedisService(context);

    const handleMessage = async (ev: PostMessageMessages, _hook: UseWebViewResult) => {
      switch (ev.type) {
        case 'saveStats': {
          console.log('receiving new score!');
          const newScore = Number(ev.data.personal);
          console.log('new score = ' + newScore);
          let currentPersonalStats = await redisService.getCurrentPlayerStats()

          if (!currentPersonalStats) {
            currentPersonalStats = { highscore: 0, attempts: 0 }

            if (!context.userId) return
            try {
              const username = (await context.reddit.getUserById(context.userId))?.username
            } catch (e) {
              devvitLogger.error(`Error sending user welcome job. ${e}`)
            }
          }

          const isNewHighScore = newScore > currentPersonalStats.highscore
          await redisService.saveScore({
            highscore: isNewHighScore ? newScore : currentPersonalStats.highscore,
            score: newScore,
            isNewHighScore,
          })
          if (isNewHighScore) {
            context.ui.showToast({
              text: `Saved new personal Highscore ${newScore}!`,
              appearance: 'success',
            })
          }
          postMessage({
            type: 'gameOver',
            data: {
              isNewHighScore,
              newScore,
              highscore: isNewHighScore ? newScore : currentPersonalStats.highscore,
              attempts: currentPersonalStats.attempts + 1,
            },
          })
          break
        }

        default: {
          devvitLogger.info(`Unknown message type "${(ev as unknown as any).type}" !`)
        }
      }
  }
  const { mount, postMessage } = useWebView({
    url: 'index.html',
    onMessage: handleMessage,
    onUnmount: () => context.ui.showToast('Thanks for playing! See you soon!'),
  })

  const [username, usernameid] = useState(async () => {
    return (await context.reddit.getCurrentUsername()) ?? 'anon';
  });

  const [highScore, userid] = useState(async () => {
    return (await redisService.getCurrentUserHighscore()) ?? 0;
  });


  return <SplashScreen context={context} onPress={mount} username={username} highScore={highScore}/>
},
});

export default Devvit;
