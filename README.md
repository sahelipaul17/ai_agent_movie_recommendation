# ai_agent_movie_recommendation

# how to run

1. clone the repository
2. install dependencies
3. set environment variables
4. run the server

# environment variables

TMDB_API_KEY
GEMINI_API_KEY

# api

POST /recommend
POST /feedback
GET /profile/:userId

# request body

POST /recommend
{
    "userId": "u1",
    "query": "funny space adventure",
    "limit": 8
}

POST /feedback
{
    "userId": "u1",
    "movieId": 12345,
    "action": "watched"
}

GET /profile/:userId

# response

POST /recommend
{
    "plan": "The user wants a funny space adventure movie. I will use the movie search tool to find movies with keywords like 'space', 'adventure', and 'comedy'. I will prioritize movies that are well-regarded and not too similar to each other to provide a diverse selection.",
    "count": 0,
    "items": []
}

POST /feedback
{
    "userId": "u1",
    "movieId": 12345,
    "action": "watched"
}

GET /profile/:userId
{
    "userId": "u1",
    "likes": [
        286217
    ],
    "dislikes": [],
    "watched": [
        12345
    ],
    "genres": {}
}
    
# stack
nodejs , express , zod , llm model(gemini)  

# 1. Memory swapped to MongoDB (mongoose model)
# 2. Added /chat endpoint for multi-turn refining
# 3. Embeddings reranker using Gemini text-embedding-004
# 4. Added streaming availability tool (JustWatch RapidAPI placeholder)
# 5. Ready to plug into LangGraph/LangChain if needed
