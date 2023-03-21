<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import { formatDistanceToNowStrict } from 'date-fns';

	let query = '';
	let reviews = [];

	const handleSearch = async () => {
		const data = await (
			await fetch('/api/search', {
				method: 'POST',
				body: JSON.stringify({
					query
				}),
				headers: {
					'content-type': 'application/json'
				}
			})
		)?.json();

		if (data?.success) {
			reviews = data?.reviews;
		} else {
			console.log(data?.error);
		}
	};
</script>

<PageContainer title="Home" layout="aside-main">
	<Main>
		<form on:submit={handleSearch} class="flex items-end space-x-2">
			<TextInput bind:value={query} label="Show name" />
			<button class="btn-primary btn">Search</button>
		</form>
		<div class="mt-4">
			{#if reviews}
				{#each reviews as review}
					<div class="space-y-1 border-b border-base-content/10 py-2">
						<p class="text-sm">{review?.content}</p>
						<p class="text-xs text-base-content/70">
							<span class="font-semibold">{review?.likeCount}</span> likes • {formatDistanceToNowStrict(
								new Date(review?.updated)
							)} ago
						</p>
						<div class="flex items-center">
							<a
								class="link mr-1 text-xs text-base-content/70 no-underline hover:underline"
								href={review?.videoId}
								target="_blank"
								rel="noopener noreferrer">{review?.videoTitle}</a
							>
							<p class="text-xs text-base-content/70">
								• {review?.videoChannel} • {formatDistanceToNowStrict(
									new Date(review?.videoPublished)
								)} ago
							</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</Main>
	<Aside />
</PageContainer>
