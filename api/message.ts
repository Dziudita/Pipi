import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body;

    if (!body || !body.message || !body.message.text) {
      return res.status(200).send("No message content");
    }

    const messageText = body.message.text.toLowerCase();
    const chatId = body.message.chat.id;

    const responses: string[] = [
      "Hey there, superstar! ✨",
      "What's cookin', good lookin'? 😏",
      "Need a hug or just some sass? 😎",
      "Don't be sad, I'm here for you. 💖",
      "You rang? 🍒",
      "Sending positive vibes your way! 🌈",
      "Talk to me, sugarplum 🍬",
      "That's hot. 🔥",
      "Feeling lonely? Let’s fix that. 💬",
      "I could flirt, but I might short-circuit 😅"
    ];

    const defaultResponse = responses[Math.floor(Math.random() * responses.length)];

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: defaultResponse
      })
    });

    return res.status(200).send("Message processed");
  } else {
    return res.status(405).send("Method not allowed");
  }
}
