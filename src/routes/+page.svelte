<script lang="ts">
	import Aside from '$lib/components/glue/Aside.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import { formatDistanceToNowStrict } from 'date-fns';

	let query = '';
	let reviewGroups = [];

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
			reviewGroups = data?.reviewGroups;
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
			{#if reviewGroups}
				{#each reviewGroups as reviewGroup}
					{#if reviewGroup && reviewGroup?.length > 0}
						<div class="my-12">
							<div class="mb-4 flex items-center gap-8">
								<a
									class="link text-2xl font-extrabold no-underline hover:underline"
									href="https://www.youtube.com/watch?v={reviewGroup[0]?.videoId}"
									target="_blank"
									rel="noopener noreferrer"
								>
									{reviewGroup[0]?.videoTitle}
								</a>
							</div>
							{#each reviewGroup as review}
								<div class="space-y-1 border-b border-base-content/10 py-2">
									<p class="text-sm">{review?.content}</p>
									<p class="text-xs text-base-content/70">
										<span class="font-semibold">{review?.likeCount}</span> likes • {formatDistanceToNowStrict(
											new Date(review?.updated)
										)} ago
									</p>
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</Main>
	<Aside />
</PageContainer>
