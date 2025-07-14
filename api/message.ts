import { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = '7632195722:AAHnFl1Kb1sCJM9ni3XxvODpiALB4aEhg_I';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const responses = {
  sad: [
    "Aww, who's making you sad? Want me to kick their butt? 🍑",
    "Don't be sad, you're too cute for that 😘",
    "Sending you a virtual hug... tightly wrapped in cherries 🍒🤗",
    "Sad? That’s illegal around me 😤 Smile, babe 🌈"
  ],
  story: [
    "Once upon a time, there was a girl who messaged a bot... and her life got 100x better 😉",
    "A long time ago... in a Telegram far far away... someone typed /pipi 😏",
    "You want a story? I'm a full series. 📺❤️",
    "Once there was a beautiful soul... and guess what? It's you. 🌟"
  ],
  pretty: [
    "Are you pretty? Please, you're GORGEOUS. The mirror is jealous. 🪞✨",
    "You? Pretty? Nah... You're STUNNING. 💃💥",
    "The question isn’t if you’re pretty… it’s how can the world handle this level of beauty? 🔥",
    "If beauty was a sin… you’d be in trouble 😇😈"
  ],
  doing: [
    "Just hanging out… waiting for gorgeous girls to message me like you 😘",
    "Not much. Thinking about you tho 👀",
    "Waiting to be summoned with a /pipi 💌",
    "Daydreaming about cherries and you 🍒😌"
  ],
  default: [
    "Pipi is here 💋 What’s up, sweetie?",
    "I heard someone called me? 😍",
    "Yes? You summoned the mighty Pipi 😈",
    "Hey cutie, did you miss me? 🥰"
  ]
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = req.body;

  if (!body?.message?.text || !body?.message?.chat?.id) {
    return res.status(200).send('No message');
  }

  const chatId = body.message.chat.id;
  const message = body.message.text.toLowerCase();

  let reply: string;

  if (message.includes("sad")) {
    reply = pick(responses.sad);
  } else if (message.includes("story")) {
    reply = pick(responses.story);
  } else if (message.includes("pretty") || message.includes("beautiful") || message.includes("hot")) {
    reply = pick(responses.pretty);
  } else if (message.includes("doing") || message.includes("what are you doing")) {
    reply = pick(responses.doing);
  } else if (message.includes("/pipi")) {
    reply = pick(responses.default);
  } else {
    reply = "Pipi doesn’t understand, but still loves you 😘";
  }

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply
    })
  });

  res.status(200).send('OK');
}

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
