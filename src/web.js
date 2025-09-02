import { z } from 'zod';
import { runAgent } from './agent.js';
import { loadProfile, saveFeedback } from './storage.js';


const RecommendReq = z.object({
userId: z.string().min(1),
query: z.string().min(1),
limit: z.number().int().min(1).max(20).optional()
});


export async function recommendHandler(req, res){
try{
const { userId, query, limit = 10 } = RecommendReq.parse(req.body);
const profile = await loadProfile(userId);
const result = await runAgent({ userId, query, limit, profile });
res.json(result);
}catch(err){
console.error(err);
res.status(400).json({ error: err.message });
}
}


const FeedbackReq = z.object({
userId: z.string(),
movieId: z.number(),
action: z.enum(['like','dislike','watched'])
});


export async function feedbackHandler(req, res){
try{
const { userId, movieId, action } = FeedbackReq.parse(req.body);
const updated = await saveFeedback(userId, movieId, action);
res.json(updated);
}catch(err){
res.status(400).json({ error: err.message });
}
}


export async function profileHandler(req, res){
const profile = await loadProfile(req.params.userId);
res.json(profile);
}