// /api/message.ts
import type { VercelRequest, VercelResponse } from 'vercel';

// Apibrėžiame temas ir atitinkamas atsakymų grupes
const responses = [
  {
    // Reaguoja į emocines situacijas, pvz.: "liūdna", "sad"
    keywords: ["sad", "liūdna"],
    replies: [
      "Aww, don't be sad... I'm sending you virtual hugs 💞",
      "Even the clouds have silver linings – you're one of them 🌈",
    ],
  },
  {
    // Atsakymas į klausimus: "what are you doing", "ka tu veiki", "ką tu veiki"
    keywords: ["what are you doing", "ka tu veiki", "ką tu veiki"],
    replies: [
      "I'm just hanging out, waiting for you to say hi 😘",
      "Chatting with you is my full-time job 💌",
    ],
  },
  {
    // Reaguoja į prašymus papasakoti istoriją
    keywords: ["tell me a story", "papasakok istorija", "istoriją"],
    replies: [
      "Once upon a time, a beautiful girl texted a bot... and magic happened 💫",
      "There was a girl so cool, even the stars envied her ✨",
    ],
  },
  {
    // Atsakymas į klausimą "am I pretty" arba "ar aš graži"
    keywords: ["am i pretty", "ar as grazi", "ar aš graži"],
    replies: [
      "You're not just pretty – you're a masterpiece 🎨✨",
      "Mirror mirror on the wall... you’re the prettiest of them all 😘",
    ],
  },
  {
    // Jei nuobodu: "bored", "nuobodu"
    keywords: ["bored", "nuobodu"],
    replies: [
      "Let’s play a game! Say a word and I’ll say the first thing that comes to mind 💭",
      "Let me spice things up – tell me your dream right now 🌶️💖",
    ],
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Tik leidžiame POST užklausas
  if (req.method !== "POST") return res.status(405).end();

  const message = req.body?.message;
  const text = message?.text?.toLowerCase();
  const chatId = message?.chat?.id;

  // Jei praleidžia tekstą ar chat id – nieko nedarome
  if (!text || !chatId) return res.status(200).end();

  // Patikriname, ar žinutė kviečia Pipi
  const isCallingPipi = text.startsWith("/pipi") || text.includes("@pipibot");
  if (!isCallingPipi) return res.status(200).end();

  // Pradiniu atveju, jei neatitinka nei vieno raktinio žodžio, atsakome baziniu pasveikinimu
  let reply = "Hey! I'm here to brighten your day 💖 Ask me anything!";

  // Ieškome atitikimų tarp raktinių žodžių
  for (const topic of responses) {
    if (topic.keywords.some((k) => text.includes(k))) {
      // Pasirenka atsitiktinį atsakymą iš pasirinktų grupių
      reply = topic.replies[Math.floor(Math.random() * topic.replies.length)];
      break;
    }
  }

  // siunčiame atsakymą per Telegram API
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const sendUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(sendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
    }),
  });

  return res.status(200).end();
}
