export type PostMessageMessages = SaveStatsMessage | RequestAppData
export type SaveScoreData = {
	highscore: number
}

export type RequestAppData = {
	type: 'requestAppData'
}

export type SaveStatsMessage = {
	type: 'saveStats'
	data: {
		personal: Pick<SaveScoreData, 'highscore'>
	}
}

export type StartGameMessage = {
	type: 'startGame'
	data: {
		personal: SaveScoreData
	}
}

export type RedisPlayer = {
	userId: string
	userName: string
	score: number
}

/** Message from Devvit to the web view. */
export type DevvitMessage =
  | { type: 'initialData'; data: { currentScore: number } }
  | { type: 'updateScore'; data: { currentScore: number } };

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | { type: 'setScore'; data: { newScore: number } }
  | { type: 'setHighScore'; data: { newHighScore: number } };

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
  type?: 'devvit-message' | string;
};
