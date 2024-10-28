<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { fly } from 'svelte/transition';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4"
>
	<div class="w-full max-w-sm">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body items-center space-y-6 text-center">
				<!-- Echo Bot Avatar -->
				<div class="relative h-32 w-32" in:fly={{ y: 50, duration: 1000 }}>
					<div class="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
					<div class="relative h-full w-full">
						<div
							class="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary/80"
						>
							<img src="/foodicon.svg" class="size-32" alt="" />
						</div>
						<div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
							<div class="h-2 w-2 rounded-full bg-primary"></div>
						</div>
					</div>
				</div>

				<div class="space-y-2" in:fly={{ y: 50, duration: 1000, delay: 200 }}>
					<h1 class="text-2xl font-bold">Meet Nilenini!</h1>
					<h2 class="text-xl">Your Meal Guide <span class="text-primary">AI Assistant</span></h2>
				</div>

				<p class="text-base-content/70" in:fly={{ y: 50, duration: 1000, delay: 400 }}>
					All your questions will be answered by an AI assistant. Ask here!
				</p>

				<!-- svelte-ignore a11y_consider_explicit_label -->
				<a
					href="/chat"
					class="btn btn-circle btn-primary btn-lg mt-8"
					in:fly={{ y: 50, duration: 1000, delay: 600 }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 12h14M12 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</div>
