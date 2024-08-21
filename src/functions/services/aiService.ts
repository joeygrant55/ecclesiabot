import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 'fallback-key',
  dangerouslyAllowBrowser: true
});

console.log('Anthropic client created with API key:', anthropic.apiKey ? anthropic.apiKey.substring(0, 5) + '...' : 'Not set');

export async function searchVersesWithAI(searchTerm: string): Promise<string> {
  try {
    const prompt = `Provide insights on the Bible verse or topic: "${searchTerm}". If it's not a specific verse, provide relevant Bible passages and brief explanations.`;
    
    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 300,
      prompt: `Human: ${prompt}\n\nAssistant:`,
    });
    return completion.completion;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    console.error('Full error object:', JSON.stringify(error));
    return 'Sorry, I encountered an error while processing your request.';
  }
}