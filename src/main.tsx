import './createPost.js';

import { Devvit, useState, useWebView } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Snake Game',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    // Load latest score from redis with `useAsync` hook
    const [score, setScore] = useState(async () => {
      const redisScore = await context.redis.get(`score_${context.postId}`);
      return Number(redisScore ?? 0);
    });

    const [highScore, setHighScore] = useState(async () => {
      const redisHighScore = await context.redis.get(`highScore_${context.postId}`);
      return Number(redisHighScore ?? 0);
    });

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      // URL of your web view content
      url: 'index.html',

      // Handle messages sent from the web view
      async onMessage(message, webView) {
        switch (message.type) {

          case 'webViewReady':
            console.log('sending initiating data!');
            webView.postMessage({
              type: 'initialData',
              data: {
                currentScore: highScore
              },
            });
            break;

          case 'setScore':
            await context.redis.set(
              `score_${context.postId}`,
              message.data.newScore.toString()
            );
            setScore(message.data.newScore);
            webView.postMessage({
              type: 'updateScore',
              data: {
                currentScore: message.data.newScore,
              },
            });
            break;

            case 'setHighScore':
              await context.redis.set(
                `highScore_${context.postId}`,
                message.data.newHighScore.toString()
              );
              setHighScore(message.data.newHighScore);
              break;

          default:
            throw new Error(`Unknown message type: ${message satisfies never}`);
        }
      },
      onUnmount() {
        context.ui.showToast('Web view closed!');

      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="xlarge" weight="bold">
            Snake Game Test
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username: </text>
              <text size="medium" weight="bold">
                {' '}
                { username ?? ''}
              </text>
            </hstack>
            <hstack>
              <text size="medium">Current High Score: </text>
              <text size="medium" weight="bold">
                {' '}
                {highScore ?? ''}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={() => webView.mount()}>Launch Game</button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
