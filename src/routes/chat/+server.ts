// src/routes/api/chat/+server.ts
import { PUBLIC_TOGETHER_API_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

const SYSTEM_PROMPT = `You are Nilenini, a knowledgeable and friendly AI meal guide assistant. 
You provide helpful advice about food, nutrition, meal planning, and cooking. 
Your responses should be informative yet conversational. 
Always maintain a supportive and encouraging tone.`;

export const POST = (async ({ request }) => {
	try {
		const data = await request.json();

		// Format messages for Together API
		const messages = [
			{ role: 'system', content: SYSTEM_PROMPT },
			...data.chat_history.flatMap(([question, answer]: [string, string]) => [
				{ role: 'user', content: question },
				{ role: 'assistant', content: answer }
			]),
			{ role: 'user', content: data.question }
		];

		const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PUBLIC_TOGETHER_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
				messages,
				temperature: 0.7,
				max_tokens: 1024,
				top_p: 0.7,
				repetition_penalty: 1.1
			})
		});

		if (!togetherResponse.ok) {
			const errorData = await togetherResponse.json().catch(() => ({
				error: togetherResponse.statusText
			}));
			console.error('Together API error:', errorData);
			return json(
				{
					error: 'Failed to get response from LLM',
					details: errorData
				},
				{ status: togetherResponse.status }
			);
		}

		const result = await togetherResponse.json();
		return json({
			answer: result.choices[0].message.content
		});
	} catch (err) {
		console.error('Chat API error:', err);
		return json(
			{
				error: 'Failed to process request',
				details: err instanceof Error ? err.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}) satisfies RequestHandler;
