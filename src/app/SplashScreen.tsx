import { Devvit, type Context } from '@devvit/public-api'

/**
 * Function disguised as a constant to get the splashscreen view separated from the main.tsx file
 * @param props 
 * @param context 
 * @returns the view for the block in reddit
 */
export const SplashScreen = (props: SplashScreenProps, context: Context) => {
	const { onPress } = props				// get the mount function from main.tsx
	const username = props.username;		// Get the username from main.tsx
	const highScore = props.highScore;		// Get the highscore from main.tsx
	const topPlayerUser = props.topPlayer;		// Get the top player from main.tsx
	const topPlayerScore = props.topScore;	// Get the top player score from main.tsx

	return (

		/**
		 * SplashScreen devvit block visual component
		 * @param context - The devvit context
		 * @param onPress - The function to call when the button is pressed
		 * @param username - The username of the user
		 * @param highScore - The highscore of the user
		 */
		<zstack grow height="100%" width="100%" alignment="middle center">

																																		/// Container for the background image (background)
			<zstack>
			/// Adds the background image to the splashcreen
				<image
					url="thumbnail.jpg"
					height="100%"
					width="100%"
					imageWidth={`${context.dimensions?.width ?? 1080}px`}
					imageHeight={`${context.dimensions?.height ?? 1920}px`}
					resizeMode="cover"
				/>
			</zstack>

																																		/// Starts the zstack for the text and button in front of the background
			<zstack grow padding="small">

																				/// Starts the vertical stack for the text and button
				<vstack grow alignment="top">

					/// Adds the title text to the splashscreen (will be on the top center of the page)
					<text size="xlarge" weight="bold">
						The Snake Game
					</text>

					<spacer />

																				/// Starts the vstack for the username and highscore including one imbricked for the button (under the title)
						<vstack alignment="start middle">

							/// Username in horizontal stack (in first)
							<hstack>
								<text size="medium"> Welcome : </text>
								<spacer size='xsmall' />
								<text size="medium" weight="bold">
									{'u/'+((username) ?? '')}
								</text>
							</hstack>

							/// Highscore in horizontal stack (in second)
							<hstack>
							<text size="medium">Your highscore : </text>
							<spacer size='xsmall'/>
							<text size="medium" weight="bold">
								{ highScore.toString() ?? ''}
							</text>
							</hstack>
							<spacer />
							
							/// Top Player in horizontal stack (in third)
							<hstack>
							<text size="medium">Top player : </text>
							<spacer size='xsmall' />
							<text size="medium" weight="bold">
								{ 'u/'+ (topPlayerUser ?? '')}
							</text>
							</hstack>
							<hstack>
							<text size="medium">Top Highscore : </text>
							<spacer size='xsmall' />
							<text size="medium" weight="bold">
							{ topPlayerScore.toString() ?? ''}
							</text>
							</hstack>

							<spacer />

							/// Button in horizontal stack (in fourth)
							<hstack>
							
								/// Adds the button to start the game
								<button icon="play-fill" appearance="primary" size="large" onPress={onPress}>
									PLAY GAME
								</button>
							</hstack>
						</vstack>												/// Ends the vstack for the username and highscore including one imbricked for the button (under the title)

				</vstack>														/// Ends the vertical stack for the text and button

			</zstack>																													/// Ends the zstack for the background image (background)
		</zstack>
	);
}

/**
 * SplashScreen type to get the information from main.tsx
 * @param context - The devvit context
 * @param onPress - The function to call when the button is pressed
 * @param username - The username of the user
 * @param highScore - The highscore of the user
 */
type SplashScreenProps = {
	context: Devvit.Context
	onPress: () => void
	username: string
	highScore: Number
	topPlayer: string
	topScore : Number
}
