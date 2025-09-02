import express from 'express';
import { recommendHandler, feedbackHandler, profileHandler } from './web.js';
import { ensureDataDirs } from './storage.js';
import 'dotenv/config';


const app = express();
app.use(express.json());


ensureDataDirs();


app.post('/recommend', recommendHandler);
app.post('/feedback', feedbackHandler);
app.get('/profile/:userId', profileHandler);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Movie Agent listening on :${port}`));
