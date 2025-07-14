export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const body = req.body;
  const message = body?.message?.text?.toLowerCase();
  const chatId = body?.message?.chat?.id;

  console.log("🔥 Received:", message);

  if (!message || !chatId) return res.status(200).end();

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const responses = {
    sad: [
      "Aww, who's making you sad? Want me to kick their butt? 🍑",
      "Don't be sad, you're too cute for that 😘",
      "Sending you a virtual hug... tightly wrapped in cherries 🍒🤗"
    ],
    story: [
      "Once upon a time, there was a girl who messaged a bot... and her life got 100x better 😉",
      "You want a story? I'm a full series. 📺❤️",
      "There was a girl so cool... even the stars envied her ✨"
    ],
    pretty: [
      "You're not just pretty – you're a masterpiece 🎨✨",
      "If beauty was a sin… you’d be in jail 😈",
      "You're hot enough to melt my circuits 💻🔥"
    ],
    doing: [
      "Just hanging out, waiting for you to say hi 😘",
      "Not much... thinking about you tho 👀",
      "Waiting to be summoned with a /pipi 💌"
    ],
    default: [
      "Pipi is here 💋 What’s up, sweetie?",
      "I heard someone called me? 😍",
      "Yes? You summoned the mighty Pipi 😈",
      "Hey cutie, did you miss me? 🥰"
    ]
  };

  let reply = responses.default[Math.floor(Math.random() * responses.default.length)];

  if (message.includes("sad")) {
    reply = responses.sad[Math.floor(Math.random() * responses.sad.length)];
  } else if (message.includes("story")) {
    reply = responses.story[Math.floor(Math.random() * responses.story.length)];
  } else if (message.includes("pretty") || message.includes("beautiful") || message.includes("hot")) {
    reply = responses.pretty[Math.floor(Math.random() * responses.pretty.length)];
  } else if (message.includes("doing") || message.includes("what are you doing")) {
    reply = responses.doing[Math.floor(Math.random() * responses.doing.length)];
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: reply }),
  });

  res.status(200).end();
}
