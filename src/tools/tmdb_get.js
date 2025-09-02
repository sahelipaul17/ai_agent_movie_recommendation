import { tmdbGet } from './tmdb_client.js';


export async function getMovie({ id }){
if(!id) return null;
const data = await tmdbGet(`/movie/${id}`, { append_to_response: 'credits' });
return data;
}