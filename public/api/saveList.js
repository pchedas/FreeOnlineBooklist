import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { listId, title, books } = req.body;
    if (!listId || !title || !Array.isArray(books)) {
      return res.status(400).json({ error: "Missing fields: listId, title, and books are required." });
    }

    // Save the list as a single JSON object
    await kv.set(`booklist:${listId}`, { title, books });

    return res.status(200).json({ message: 'List saved successfully!' });
  } else if (req.method === 'GET') {
    const { listId } = req.query;
    if (!listId) {
      return res.status(400).json({ error: "listId query parameter is required." });
    }

    const data = await kv.get(`booklist:${listId}`);
    if (!data) {
      return res.status(404).json({ error: "List not found." });
    }

    return res.status(200).json(data);
  } else {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
  }
}