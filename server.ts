import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/item-info', async (req, res) => {
    try {
      const { item } = req.body;
      if (!item) return res.status(400).json({ error: 'Item is required' });

      const prompt = `
أنت مساعد في لعبة "خمن من؟" أو "مين أنا؟".
اللاعب يريد معلومات عن العنصر التالي لتساعده في اللعبة.
اسم العنصر: ${item.name}
الفئة: ${item.categoryId}
الفئة الفرعية: ${item.subcategoryId}

قم بكتابة 3 نقاط مختصرة ومفيدة حول هذا العنصر، وما هي أبرز الأسئلة (نعم/لا) التي يمكن أن تُسأل عنه في اللعبة.
يجب أن تكون الإجابة باللغة العربية، قصيرة، ومباشرة. لا تستخدم مقدمات طويلة.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ info: response.text });
    } catch (error) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Failed to generate info' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
