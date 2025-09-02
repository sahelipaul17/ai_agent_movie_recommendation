import { tmdbGet } from './tmdb_client.js';


export async function similarMovies({ id, page=1 }){
if(!id) return [];
const data = await tmdbGet(`/movie/${id}/similar`, { page });
return data.results || [];
}