import { GOOGLE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { query } = await request.json();

	try {
		const url = `https://www.googleapis.com/youtube/v3/search?key=${GOOGLE_API_KEY}&part=snippet,id&order=relevance&maxResults=4&channelType=any&q=${encodeURIComponent(
			query
		)}`;

		const videoData = await (
			await fetch(url, {
				method: 'GET'
			})
		)?.json();

		const promises = videoData?.items?.map(async (video) => {
			const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${GOOGLE_API_KEY}&part=snippet,id&videoId=${video?.id?.videoId}&order=time`;
			const data = await (
				await fetch(url, {
					method: 'GET'
				})
			)?.json();
			return data?.items
				?.slice(0, 20)
				?.map((comment) => ({
					content: comment?.snippet?.topLevelComment?.snippet?.textOriginal,
					likeCount: comment?.snippet?.topLevelComment?.snippet?.likeCount,
					updated: comment?.snippet?.topLevelComment?.snippet?.updatedAt,
					videoId: video?.id?.videoId,
					videoTitle: video?.snippet?.title,
					videoChannel: video?.snippet?.channelTitle,
					videoPublished: video?.snippet?.publishTime
				}))
				?.filter((review) => review?.content);
		});

		const reviewGroups = await Promise.all(promises);

		return json({
			success: true,
			reviewGroups
		});
	} catch (error) {
		return json({
			success: false,
			error
		});
	}
}
