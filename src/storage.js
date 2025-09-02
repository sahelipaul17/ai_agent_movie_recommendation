import fs from 'fs';
import path from 'path';
import 'dotenv/config';


const DATA_DIR = process.env.DATA_DIR || './data';
const USERS_DIR = path.join(DATA_DIR, 'users');


export function ensureDataDirs(){
fs.mkdirSync(USERS_DIR, { recursive: true });
}


export async function loadProfile(userId){
const p = path.join(USERS_DIR, `${userId}.json`);
if(!fs.existsSync(p)) return { userId, likes: [], dislikes: [], watched: [], genres: {} };
return JSON.parse(fs.readFileSync(p,'utf-8'));
}


export async function saveProfile(profile){
const p = path.join(USERS_DIR, `${profile.userId}.json`);
fs.writeFileSync(p, JSON.stringify(profile, null, 2));
return profile;
}


export async function saveFeedback(userId, movieId, action){
const profile = await loadProfile(userId);
const setField = action === 'like' ? 'likes' : action === 'dislike' ? 'dislikes' : 'watched';
const arr = new Set(profile[setField] || []);
arr.add(movieId);
profile[setField] = Array.from(arr);


// Update genre prefs lightly when liking/disliking
if(action === 'like' || action === 'dislike'){
// noop here: in a full build, fetch movie genres and adjust weights
}


return saveProfile(profile);
}