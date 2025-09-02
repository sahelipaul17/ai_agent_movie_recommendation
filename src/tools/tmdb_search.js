import { tmdbGet } from './tmdb_client.js';


export async function searchMovies({ query, page=1 }){
if(!query) return [];
const data = await tmdbGet('/search/movie', { query, page, include_adult: false });
return data.results || [];
}

