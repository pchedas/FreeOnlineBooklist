import { neon } from '@neondatabase/serverless';

// Create the SQL connection outside the handler to reuse it
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { listId, title, books } = req.body;
      console.log('POST request received:', { listId, title, booksLength: books?.length });
      
      if (!listId || typeof title !== 'string' || !Array.isArray(books)) {
        return res.status(400).json({ 
          error: "Missing or invalid fields. 'listId', 'title', and 'books' are required." 
        });
      }

      // Log the query we're about to execute
      console.log('Executing POST query for listId:', listId);

      // Upsert the book list
      const result = await sql`
        INSERT INTO book_lists (list_id, title, books, updated_at)
        VALUES (${listId}, ${title}, ${JSON.stringify(books)}::jsonb, CURRENT_TIMESTAMP)
        ON CONFLICT (list_id) 
        DO UPDATE SET 
          title = EXCLUDED.title,
          books = EXCLUDED.books,
          updated_at = CURRENT_TIMESTAMP
        RETURNING list_id, title;
      `;
      
      console.log('POST query result:', result);
      return res.status(200).json({ message: 'List saved successfully!', data: result[0] });
      
    } else if (req.method === 'GET') {
      const { listId } = req.query;
      console.log('GET request received for listId:', listId);
      
      if (!listId) {
        return res.status(400).json({ 
          error: "The 'listId' query parameter is required." 
        });
      }

      // Log the query we're about to execute
      console.log('Executing GET query for listId:', listId);

      // Query the book list
      const rows = await sql`
        SELECT list_id, title, books, updated_at
        FROM book_lists 
        WHERE list_id = ${listId};
      `;
      
      console.log('GET query result:', rows);

      if (!rows || rows.length === 0) {
        console.log('No list found for listId:', listId);
        return res.status(404).json({ error: "List not found." });
      }

      return res.status(200).json({
        title: rows[0].title,
        books: rows[0].books,
        updatedAt: rows[0].updated_at
      });
      
    } else {
      return res.status(405).json({ 
        error: 'Method Not Allowed. Use GET or POST.' 
      });
    }
  } catch (error) {
    console.error('Database error:', {
      message: error.message,
      stack: error.stack,
      details: error.details
    });
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
