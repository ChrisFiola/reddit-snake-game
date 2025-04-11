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
}
