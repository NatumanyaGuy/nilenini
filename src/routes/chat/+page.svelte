<!-- src/routes/chat/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import {
		PUBLIC_TOGETHER_API_KEY,
	} from '$env/static/public';

	interface ChatMessage {
		question: string;
		answer: string;
	}

	const SYSTEM_PROMPT = `You are Nilenini, a knowledgeable and friendly AI meal guide assistant. 
    You provide helpful advice about food, nutrition, meal planning, and cooking.
    Your responses should be informative yet conversational.
    Always maintain a supportive and encouraging tone.
	You are developed by the Nilenini team, you should let people know you are a work in progress and 
	you are continuing to be improved by the Nilenini Team when asked about what you are.
	Also, let them know you were trained off published nutritional documents from humanitarian organizations, and
	you try to disseminate nutritional guidance information in a conversational way.
	`;

	let messages: ChatMessage[] = [];
	let newMessage = '';
	let chatContainer: HTMLElement;
	let isLoading = false;
	let errorMessage = '';

	async function sendMessage() {
		if (!newMessage.trim()) return;

		const question = newMessage;
		newMessage = '';
		isLoading = true;
		errorMessage = '';

		try {
			// Format messages for Together API
			const apiMessages = [
				{ role: 'system', content: SYSTEM_PROMPT },
				...messages.flatMap((msg) => [
					{ role: 'user', content: msg.question },
					{ role: 'assistant', content: msg.answer }
				]),
				{ role: 'user', content: question }
			];

			const response = await fetch('https://api.together.xyz/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${PUBLIC_TOGETHER_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
					messages: apiMessages,
					temperature: 0.7,
					max_tokens: 1024,
					top_p: 0.7,
					repetition_penalty: 1.1
				})
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.statusText}`);
			}

			const data = await response.json();
			const answer = data.choices[0].message.content;

			messages = [...messages, { question, answer }];

			// Scroll to bottom after new message
			setTimeout(() => {
				chatContainer?.scrollTo({
					top: chatContainer.scrollHeight,
					behavior: 'smooth'
				});
			}, 100);
		} catch (error) {
			console.error('Error sending message:', error);
			errorMessage = 'Failed to send message. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Function to format messages with markdown (optional)
	function formatMessage(text: string) {
		return text.replace(/\n/g, '<br>');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
	<div class="mx-auto max-w-2xl">
		<div class="card min-h-[calc(100vh-2rem)] bg-base-100 shadow-xl">
			<!-- Header -->
			<div class="card-body flex h-full flex-col p-4">
				<div class="flex items-center space-x-4 border-b border-base-300 pb-4">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<a href="/" class="btn btn-circle btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</a>
					<div class="flex items-center space-x-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
							<img src="/foodicon.svg" class="size-8" alt="Food Icon" />
						</div>
						<div>
							<h2 class="text-lg font-bold">Chat with Nilenini</h2>
							<p class="text-sm text-base-content/70">
								Your Meal Guide <span class="text-primary">AI Assistant</span>
							</p>
						</div>
						
					</div>
				</div>

				<!-- Chat Messages -->
				<div class="flex-1 space-y-4 overflow-y-auto py-4" bind:this={chatContainer}>
					{#if errorMessage}
						<div class="alert alert-error shadow-lg">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 flex-shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{errorMessage}</span>
						</div>
					{/if}

					{#each messages as message, i}
						<!-- User Message -->
						<div class="chat chat-end" in:fly={{ y: 20, duration: 300, delay: i * 100 }}>
							<div class="chat-bubble chat-bubble-primary">
								{@html formatMessage(message.question)}
							</div>
						</div>

						<!-- AI Response -->
						<div class="chat chat-start" in:fly={{ y: 20, duration: 300, delay: i * 100 + 150 }}>
							<div class="chat-bubble bg-base-300">
								{@html formatMessage(message.answer)}
							</div>
						</div>
					{/each}

					{#if isLoading}
						<div class="chat chat-start" in:fly={{ y: 20, duration: 300 }}>
							<div class="chat-bubble bg-base-300">
								<div class="flex space-x-2">
									<div class="h-2 w-2 animate-bounce rounded-full bg-base-content/70" ></div>
									<div
										class="h-2 w-2 animate-bounce rounded-full bg-base-content/70"
										style="animation-delay: 0.2s"
									></div>
									<div
										class="h-2 w-2 animate-bounce rounded-full bg-base-content/70"
										style="animation-delay: 0.4s"
									></div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Message Input -->
				<div class="border-t border-base-300 pt-4">
					<div class="flex space-x-2">
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button class="btn btn-circle btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</button>
						<div class="relative flex-1">
							<!-- svelte-ignore element_invalid_self_closing_tag -->
							<textarea
								class="textarea textarea-bordered w-full resize-none pr-12"
								placeholder="Type your message..."
								rows="1"
								bind:value={newMessage}
								on:keydown={handleKeydown}
							/>
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button
								class="btn btn-circle btn-primary btn-sm absolute bottom-2 right-2"
								on:click={sendMessage}
								disabled={!newMessage.trim() || isLoading}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
