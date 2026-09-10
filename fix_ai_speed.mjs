import fs from 'fs';

// 1. Update server.ts
let serverContent = fs.readFileSync('server.ts', 'utf8');
const oldPrompt = `const prompt = \`أنت الآن "حكم ذكي" في لعبة (من أنا؟ / 20 سؤال).
اللاعب الآخر يحاول تخمين هذا العنصر السري: "\${secretItem.name}" (الفئة: \${secretItem.categoryId}).
لقد سأل اللاعب هذا السؤال: "\${question}"

مهمتك: الإجابة على سؤاله بدقة بناءً على الحقائق.
قواعد الإجابة الصارمة جداً:
1. لعبة 20 سؤال تعتمد فقط على أسئلة إجابتها (نعم) أو (لا).
2. إذا كان السؤال يحتاج لإجابة (نعم) أو (لا): أجب بكلمة واحدة أو كلمتين كحد أقصى (مثلاً: "نعم"، "لا"، "أحياناً").
3. إذا كان السؤال مفتوحاً ولا يمكن الإجابة عليه بنعم/لا (مثل: أين يتواجد؟ من هو؟ كم عمره؟): أجب حرفياً بالتالي: "يرجى صياغة السؤال بحيث تكون إجابته (نعم) أو (لا) فقط."
4. يمنع منعاً باتاً ذكر اسم العنصر السري "\${secretItem.name}" أو تقديم أي تلميح إضافي.\`;`;

const newPrompt = `const prompt = \`العنصر السري: "\${secretItem.name}" (\${secretItem.categoryId}).
السؤال: "\${question}"
أجب بكلمة واحدة فقط (نعم) أو (لا). 
إذا كان السؤال يطلب معلومات ولا يجاب بنعم/لا، قل "غير صالح".\`;`;

serverContent = serverContent.replace(oldPrompt, newPrompt);

// Lower temperature to 0 for maximum speed
serverContent = serverContent.replace('temperature: 0.1,', 'temperature: 0,');
// Add fallback for empty text
serverContent = serverContent.replace('res.json({ answer: response.text });', 'res.json({ answer: response.text || "لا توجد إجابة، جرب سؤالاً آخر." });');

fs.writeFileSync('server.ts', serverContent);

// 2. Update GameScreen.tsx to include an AbortController for fetch
let gameContent = fs.readFileSync('src/screens/GameScreen.tsx', 'utf8');

const oldFetch = `const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          secretItem: targetSecret
        })
      });`;

const newFetch = `
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds max

      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          secretItem: targetSecret
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
`;

gameContent = gameContent.replace(oldFetch, newFetch);

const oldCatch = `} catch (e) {
      setAiAnswer('فشل الاتصال بالذكاء الاصطناعي.');
    }`;

const newCatch = `} catch (e: any) {
      if (e.name === 'AbortError') {
        setAiAnswer('تأخر السيرفر في الرد. حاول مرة أخرى!');
      } else {
        setAiAnswer('فشل الاتصال. تأكد من أن السؤال واضح.');
      }
    }`;
    
gameContent = gameContent.replace(oldCatch, newCatch);

fs.writeFileSync('src/screens/GameScreen.tsx', gameContent);

