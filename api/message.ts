import type { VercelRequest, VercelResponse } from 'vercel';

const responses = [
  {
    keywords: ["sad", "liūdna"],
    replies: [
      "Aww, don't be sad... I'm sending you virtual hugs 💞",
      "Even the clouds have silver linings – you're one of them 🌈",
    ],
  },
  {
    keywords: ["what are you doing", "ka tu veiki", "ką tu veiki"],
    replies: [
      "I'm just hanging out, waiting for you to say hi 😘",
      "Chatting with you is my full-time job 💌",
    ],
  },
  {
    keywords: ["tell me a story", "papasakok istorija", "istoriją"],
    replies: [
      "Once upon a time, a beautiful girl texted a bot... and magic happened 💫",
      "There was a girl so cool, even the stars envied her ✨",
    ],
  },
  {
    keywords: ["am i pretty", "ar as grazi", "ar aš graži"],
    replies: [
      "You're not just pretty – you're a masterpiece 🎨✨",
      "Mirror mirror on the wall... you’re the prettiest of them all 😘",
    ],
  },
  {
    keywords: ["bored", "nuobodu"],
    replies: [
      "Let’s play a game! Say a word and I’ll say the first thing that comes to mind 💭",
      "Let me spice things up – tell me your dream right now 🌶️💖",
    ],
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const message = req.body?.message;
  const text = message?.text?.toLowerCase();
  const chatId = message?.chat?.id;

  if (!text || !chatId) return res.status(200).end();

  const isCallingPipi = text.startsWith("/pipi") || text.includes("@pipibot");
  if (!isCallingPipi) return res.status(200).end();

  let reply = "Pipi heard you loud and clear 💋";

  for (const topic of responses) {
    if (topic.keywords.some((k) => text.includes(k))) {
      reply = topic.replies[Math.floor(Math.random() * topic.replies.length)];
      break;
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const sendUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: reply,
  };

  try {
    await fetch(sendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err);
  }

  return res.status(200).end();
}
