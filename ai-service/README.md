# 🌾 AI Microservice for Crop Q&A Platform

This microservice delivers the AI capabilities for a crop issue Q&A platform. Users can submit images and descriptions of their crop problems, and the service generates AI-powered responses using a large language model (LLM). Redis is used both as a message queue (Streams) and for in-memory storage.

## 📌 Features

- Accepts crop-related problem requests via HTTP from the main service
- Utilizes Redis Streams for asynchronous messaging
- Stores user prompts, image links, comments, and more in Redis
- Sends queries to an LLM and retrieves suggested solutions
- Delivers responses back to the main service via HTTP
- Fully Dockerized for straightforward deployment

## 🐳 Build & Run

### 1. Create a `.env` File

Create a `.env` file in the project root and populate it as shown below (replace example values with your actual configuration, but **never commit real secrets**):


.env.example

```dotenv
# Redis connection
# REDIS_URL=redis://localhost:6379
REDIS_URL=redis://redis:6379

# Service port
PORT=3002

# Main service webhook endpoint (replace with your actual URL)
MAIN_SERVICE_URL=https://your-main-service-url.com

# Gemini API key (replace with your actual key)
GEMINI_API_KEY=your-gemini-api-key
```


### 2. Build and Run the Microservice

```bash
docker-compose up --build
```

This command will start both the Redis server and the AI microservice, making it available at `http://localhost:3002`.

## 🧠 Future Work

- Fine-tune the LLM with agriculture-specific data to improve answer quality
- Connect the LLM to a product database to recommend specific crop treatments (e.g., Bayer solutions)
- Add a user feedback loop to refine AI suggestions based on real-world outcomes
- Implement caching and analytics for enhanced performance and insights
