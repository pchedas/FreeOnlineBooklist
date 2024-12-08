import { sql } from '../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { listId, title, books } = req.body;
      
      if (!listId || typeof title !== 'string' || !Array.isArray(books)) {
        return res.status(400).json({ 
          error: "Missing or invalid fields. 'listId', 'title', and 'books' are required." 
        });
      }

      // Upsert the book list using Neon's tagged template literal syntax
      await sql`
        INSERT INTO book_lists (list_id, title, books, updated_at)
        VALUES (${listId}, ${title}, ${JSON.stringify(books)}, CURRENT_TIMESTAMP)
        ON CONFLICT (list_id) 
        DO UPDATE SET 
          title = EXCLUDED.title,
          books = EXCLUDED.books,
          updated_at = CURRENT_TIMESTAMP
      `;

      return res.status(200).json({ message: 'List saved successfully!' });
      
    } else if (req.method === 'GET') {
      const { listId } = req.query;
      
      if (!listId) {
        return res.status(400).json({ 
          error: "The 'listId' query parameter is required." 
        });
      }

      // Query the book list using Neon
      const rows = await sql`
        SELECT title, books 
        FROM book_lists 
        WHERE list_id = ${listId}
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: "List not found." });
      }

      return res.status(200).json(rows[0]);
      
    } else {
      return res.status(405).json({ 
        error: 'Method Not Allowed. Use GET or POST.' 
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
}
