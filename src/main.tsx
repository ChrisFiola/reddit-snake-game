import { Devvit, useState, useWebView, type UseWebViewResult } from '@devvit/public-api';
Devvit.configure({
  redditAPI: true,
  redis: true,
});

import './app/blocks/addMenuItem.js';

import { RedisService } from './app/services/RedisService.js';
import { devvitLogger } from './shared/TODOlogger.js';
import { SplashScreen } from './app/SplashScreen.js'
import type { PostMessageMessages } from './shared/message.js';

/*
* Add a custom post type to Devvit
*/
Devvit.addCustomPostType({
  name: 'Snake Game',
  height: 'regular',
  render: (context: Devvit.Context) => {

    const redisService = new RedisService(context);
    
    /*
    ** Resets user Highscore
    *
    redisService.saveScore({
      highscore: 0,
      score: 0,
      isNewHighScore: true
    })*/

      
    //const to handle the message sent from the webview
    const handleMessage = async (ev: PostMessageMessages, _hook: UseWebViewResult) => {
      // Different case depending on the message sent from the webview
      switch (ev.type) {

        // saveStats was sent from the webview
        case 'saveStats': {

          // Stores the score received from the webview in a constant
          const newScore = Number(ev.data.personal);

          // Fetch the current player stats from redis
          let currentPersonalStats = await redisService.getCurrentPlayerStats()

          // Check if the user has a score saved in redis, if not create a new one
          if (!currentPersonalStats) {
            currentPersonalStats = { highscore: 0, attempts: 0 }
          }

          // Check if the new score is greater than the current highscore
          const isNewHighScore = newScore > currentPersonalStats.highscore

          await redisService.saveScore({
            // If the new score is greater than the current highscore, save it to redis
            highscore: isNewHighScore ? newScore : currentPersonalStats.highscore,
            score: newScore,
            isNewHighScore,
          })

          // if the new score is greater than the current highscore, show a toast message
          if (isNewHighScore) {
            context.ui.showToast({
              text: `Saved new personal Highscore ${newScore}!`,
              appearance: 'success',
            })
          }

          break
        }

        default: {
          devvitLogger.info(`Unknown message type "${(ev as unknown as any).type}" !`)
        }
      }
  }

  // This is the function that will be called when the user presses the button to start the game
  const { mount } = useWebView({
    url: 'index.html',
    onMessage: handleMessage,
    onUnmount: () => context.ui.showToast('Thanks for playing! See you soon!'),
  })

  const username = useState(async () => {
    return (await context.reddit.getCurrentUsername()) ?? 'anon';
  });

  const highScore = useState(async () => {
    return (await redisService.getCurrentUserHighscore()) ?? 0;
  });

  const topPlayer = useState(async () => {
    return (await redisService.getCurrentCommunityHighScoreUsername()) ?? 'anon';
  });
  
  const highscore = useState(async () => {
    return (await redisService.getCurrentCommunityHighScore()) ?? 0;
  });

  return <SplashScreen context={context} onPress={mount} username={username[0]} highScore={highScore[0]} topPlayer={topPlayer[0]} topScore={Number(highscore[0])}/>
},
});

export default Devvit;
