import { Devvit, type MenuItemOnPressEvent } from '@devvit/public-api'

const addMenuItem = async (_: MenuItemOnPressEvent, context: Devvit.Context) => {
	const { reddit, ui } = context
	const subreddit = await reddit.getCurrentSubreddit()
	await reddit.submitPost({
		title: `Let's play Snake!`,
		subredditName: subreddit.name,
		preview: (
			<vstack height="100%" width="100%" alignment="middle center">
				<text size="large">Loading ...</text>
			</vstack>
		),
	})
	ui.showToast({ text: 'Created game!' })
};

Devvit.addMenuItem({
	label: 'Create Snake Post',
	location: 'subreddit',
	forUserType: 'moderator',
	onPress: addMenuItem,
});
