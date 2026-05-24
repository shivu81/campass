# Smart Career Recommendation Chatbot

A full-stack career recommendation web app with a ChatGPT-style conversational interface. It collects interests, skill ratings, and personality signals, then scores career matches using a weighted recommendation engine.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, hooks, local storage
- Backend: Node.js, Express
- Recommendation weights: interests 30%, skills 40%, personality 30%

## Project Structure

```txt
client/
  src/
    components/
      ChatWindow.jsx
      InputBox.jsx
      MessageBubble.jsx
      RecommendationCard.jsx
      Sidebar.jsx
    data/
      questionFlow.js
    utils/
      chatFlow.js
    api.js
    App.jsx
    main.jsx
    styles.css
  index.html
  package.json
  tailwind.config.js
  postcss.config.js
server/
  src/
    data/
      careers.json
    index.js
    recommendationEngine.js
  package.json
package.json
```

## Run Locally

Install dependencies:

```bash
npm run install:all
```

Start both frontend and backend:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:5173
```

Build and run as one production app:

```bash
npm run build
npm start
```

In production, Express serves the React build and the API from the same domain, so users see one clean public URL.

Backend API:

```txt
GET  http://localhost:5000/api/health
GET  http://localhost:5000/api/careers
POST http://localhost:5000/api/recommend
```

## Notes

- Chat progress and results are stored in local storage.
- The PDF button uses the browser print dialog, so users can choose "Save as PDF".
- No watermark, generated-by text, or branding from any development tool is included.
- `render.yaml` is included so this can be deployed on Render as a single web service with a unique URL.
