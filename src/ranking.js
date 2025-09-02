import { loadProfile } from './storage.js';


// Simple taste-based reranker using user likes/dislikes and genre skew.
export function rerankByTastes(movies, profile){
const liked = new Set(profile?.likes || []);
const disliked = new Set(profile?.dislikes || []);
const genreBoost = genreVector(profile?.genres || {});


const scored = movies.map(m => {
const base = (m.vote_average || 0) * 10 + (m.popularity || 0);
const likeBonus = liked.has(m.id) ? 100 : 0;
const dislikePenalty = disliked.has(m.id) ? -200 : 0;
const gScore = (m.genre_ids||[]).reduce((acc,g)=> acc + (genreBoost[g]||0), 0);
return { m, score: base + likeBonus + dislikePenalty + gScore };
});
scored.sort((a,b)=> b.score - a.score);
return scored.map(s => s.m);
}


function genreVector(pref){
// pref: { genreId: weight }
const out = {};
for(const k of Object.keys(pref)) out[k] = pref[k]*50; // scale
return out;
}