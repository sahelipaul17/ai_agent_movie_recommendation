import axios from 'axios';
import 'dotenv/config';


const instance = axios.create({
baseURL: 'https://api.themoviedb.org/3',
headers: { 'Authorization': `Bearer ${process.env.TMDB_API_KEY}` }
});


export async function tmdbGet(path, params={}){
const { data } = await instance.get(path, { params });
return data;
}