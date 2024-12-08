import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { listId, title, books } = req.body;
    
    if (!listId || !title || !Array.isArray(books)) {
      return res.status(400).json({ error: "Missing or invalid fields. 'listId', 'title', and 'books' (array) are required." });
    }

    // Store the list data under a key that includes the listId
    await kv.set(`booklist:${listId}`, { title, books });

    return res.status(200).json({ message: 'List saved successfully!' });
    
  } else if (req.method === 'GET') {
    const { listId } = req.query;
    if (!listId) {
      return res.status(400).json({ error: "The 'listId' query parameter is required." });
    }

    // Retrieve the list data from KV
    const data = await kv.get(`booklist:${listId}`);
    if (!data) {
      return res.status(404).json({ error: "List not found." });
    }

    return res.status(200).json(data);
    
  } else {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET or POST.' });
  }
}
