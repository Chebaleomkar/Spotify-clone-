// pages/api/subscribe/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import webPush from 'web-push'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { body } = req; // Destructure the body from the request

      // Assuming the body contains the subscription data
      const newSubscription = body;

      const options = {
        vapidDetails: {
          subject: 'mailto:omkarchebale0@gmail.com',
          publicKey: 'BPdnSlV3i08SZSRb9mJi-olMvXvR4fzLGEWaLGUUjY3qq5OjF1pkrIx4xe6tGWIOoQzqq8hXdR6BRXjdUGI8TwA',
          privateKey: 'd6NPdhYrYjKhQ0C4eQBLi3hLe2kn5fn9cNJ7FeyRYuU'
        },
      };

      const res2 = await webPush.sendNotification(
        newSubscription,
        JSON.stringify({
          title: 'Hello from server',
          description: 'This message is coming from the server',
          image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
        }),
        options
      );

      return res.status(200).end();
      
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
