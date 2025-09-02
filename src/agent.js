import { llmChat } from './llm.js';
import { tools } from './tools/index.js';
import { rerankByTastes } from './ranking.js';


const SYSTEM = `You are a helpful movie recommendation agent.
- Always use tools to fetch real movies.
- Clarify user mood/constraints by planning silently.
- Prefer diverse, relevant picks.
- Output strictly JSON matching the schema.
- Include brief_reason per pick (one sentence).`;


// JSON schema we want the LLM to emit
const OUTPUT_SCHEMA = {
type: 'object',
properties: {
plan: { type: 'string' },
tool_calls: {
type: 'array',
items: {
type: 'object',
properties: {
tool: { type: 'string' },
args: { type: 'object' }
}, required: ['tool','args']
}
}
},
required: ['plan','tool_calls']
};


function schemaHint(schema){
return `Return JSON only. Schema: ${JSON.stringify(schema)}.`;
}


export async function runAgent({ userId, query, limit, profile }){
// 1) Ask LLM to propose tool calls
const planMsg = await llmChat([
{ role: 'system', content: SYSTEM },
{ role: 'user', content: `${schemaHint(OUTPUT_SCHEMA)}\nUser query: ${query}` }
]);


// 2) Parse JSON
let plan;
try { plan = JSON.parse(extractJson(planMsg)); } catch (e){
// fallback: single search
plan = { plan: 'fallback', tool_calls: [{ tool: 'searchMovies', args: { query, page: 1 } }] };
}


// 3) Execute tools sequentially, accumulate movies
const bag = new Map(); // movieId -> movieObject
for(const call of plan.tool_calls){
const tool = tools[call.tool];
if(!tool) continue;
try{
const out = await tool(call.args);
const list = Array.isArray(out) ? out : (out?.results || []);
for(const m of list){ if(m && m.id) bag.set(m.id, m); }
}catch(err){
console.warn('tool error', call.tool, err.message);
}
}


// 4) Convert to array, re-rank with tastes, limit
let movies = Array.from(bag.values());
movies = rerankByTastes(movies, profile).slice(0, limit);


// 5) Summarize recommendations with short reasons
const titles = movies.map(m => `${m.title} (${(m.release_date||'').slice(0,4)})`).join(', ');
const reasons = await llmChat([
{ role: 'system', content: 'You condense lists of movies into brief reasons per title. Return JSON: { items: [{id, brief_reason}] }' },
{ role: 'user', content: `Make it punchy. Movies: ${JSON.stringify(movies.map(m=>({id:m.id,title:m.title,overview:m.overview,genres:m.genre_ids})))} `}
]);


let reasonMap = new Map();
try{
const parsed = JSON.parse(extractJson(reasons));
for(const it of parsed.items||[]){ reasonMap.set(it.id, it.brief_reason); }
}catch{}


const items = movies.map(m => ({
id: m.id,
title: m.title,
year: (m.release_date||'').slice(0,4),
poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
vote_average: m.vote_average,
overview: m.overview,
brief_reason: reasonMap.get(m.id) || 'Fits your tastes and query.'
}));


return { plan: plan.plan, count: items.length, items };
}


function extractJson(text){
const start = text.indexOf('{');
const end = text.lastIndexOf('}');
if(start === -1 || end === -1) throw new Error('No JSON');
return text.slice(start, end+1);
}