import { Devvit, type RedisClient } from '@devvit/public-api'
import type { SaveScoreData } from '../types/redis.js'

export class RedisService {
	context: Devvit.Context
	redis: RedisClient

	subredditId: string
	postId: string
	userId: string

	constructor(context: Devvit.Context) {
		this.context = context
		this.redis = context.redis

		this.subredditId = context.subredditId

		this.postId = context.postId!
		this.userId = context.userId!
	}

	async savePlayerHighscore(score: number) {
		return this.redis.zAdd(`community:${this.subredditId}:highscores`, { member: this.userId, score })
	}
	async incrementPlayerAttemptsCount() {
		return this.redis.hIncrBy(`community:${this.subredditId}:attempts`, this.userId, 1)
	}

	async savePlayerStats(score: number) {
		return Promise.all([this.savePlayerHighscore(score), this.incrementPlayerAttemptsCount()])
	}

	async saveScore(stats: SaveScoreData) {
		await this.savePlayerStats(stats.highscore)
	}


	/** COMMUNITY:USER */
	async getCurrentUserHighscore() {
		return this.redis.zScore(`community:${this.subredditId}:highscores`, this.userId)
	}

	async getCurrentUserAttempts() {
		return this.redis.hGet(`community:${this.subredditId}:attempts`, this.userId)
	}

	async getCurrentPlayerStats() {
		const [highscore, attempts] = await Promise.all([
			this.getCurrentUserHighscore(),
			this.getCurrentUserAttempts(),
		])

		return {
			highscore: Number(highscore ?? 0),
			attempts: Number(attempts ?? 0)
		}
	}

	/** COMMUNITY */

	async getCommunityLeaderBoard(limit: number = 10) {
		const communityLeaderboard = await this.redis.zRange(`community:${this.subredditId}:highscores`, 0, limit - 1, {
			by: 'score',
			reverse: true,
		})

		const mappedLeaderboard = await Promise.all(
			communityLeaderboard.map(async ({ member, score }) => {
				try {
					const [userNameResponse, attempts] = await Promise.all([
						this.context.reddit.getUserById(member),
						this.redis.hGet(`community:${this.subredditId}:attempts`, member),
					])

					return {
						userId: member,
						userName: userNameResponse ? userNameResponse.username : 'Anonymous',
						score,
						attempts: Number(attempts ?? 0),
					}
				} catch (e) {
					console.log(`Error creating communityLeaderboard. ${e}`)

					try {
						console.info(`${member} does not exist anymore. Deleting member from highscores`)
						// await this.redis.zRem(`community:${this.subredditId}:highscores`, [member])
						// devvitLogger.info(`Successfully removed ${member}`)
					} catch (e) {
						console.error(`Error deleting member from highscores. ${e}`)
					}
					return null
				}
			})
		)

		return mappedLeaderboard.filter((el) => el !== null)
	}

	async getCurrentCommunityHighScoreUsername() {
		const currentTopPlayer = await this.getCurrentCommunityTopPlayer()

		if (currentTopPlayer.length < 1 || !currentTopPlayer[0]) return `???`
		try {
			const topPlayerUser = await this.context.reddit.getUserById(currentTopPlayer[0].member)
			if (!topPlayerUser) return `No top player ???`

			return topPlayerUser.username
		} catch (e) {
			console.log(`Error fetching topPlayerUsername ${e}`)
			return `???`
		}
	}

	async getCurrentCommunityHighScore() {
		const currentTopPlayer = await this.getCurrentCommunityTopPlayer()

		if (currentTopPlayer.length < 1 || !currentTopPlayer[0]) return `???`
		try {
			const topPlayerScore = currentTopPlayer[0].score
			if (!topPlayerScore) return `???`

			return topPlayerScore
		} catch (e) {
			console.log(`Error fetching topPlayerScore ${e}`)
			return `???`
		}
	}

	async getCurrentCommunityTopPlayer() {
		return this.redis.zRange(`community:${this.subredditId}:highscores`, 0, 0, {
			by: 'rank',
			reverse: true
		})
	}
}
