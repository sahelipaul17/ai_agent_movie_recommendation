import 'dotenv/config';


// Provider-agnostic chat wrapper. Falls back gracefully.
export async function llmChat(messages){
const provider = (process.env.PROVIDER||'ollama').toLowerCase();
// if(provider === 'openai') return openaiChat(messages);
if(provider === 'gemini') return geminiChat(messages);
// return ollamaChat(messages); // default
}


// async function openaiChat(messages){
// const { default: OpenAI } = await import('openai');
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const res = await client.chat.completions.create({
// model: 'gpt-4o-mini',
// messages
// });
// return res.choices[0]?.message?.content || '';
// }


async function geminiChat(messages){
const { GoogleGenerativeAI } = await import('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const text = messages.map(m=>`${m.role.toUpperCase()}: ${m.content}`).join('\n');
const res = await model.generateContent(text);
return res.response.text();
}


// async function ollamaChat(messages){
// const { default: ollama } = await import('ollama');
// const res = await ollama.chat({
// model: process.env.OLLAMA_MODEL || 'llama3.1',
// messages
// });
// return res.message?.content || '';
// }