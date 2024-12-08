import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { listId, title, books } = req.body;
      
      if (!listId || typeof title !== 'string' || !Array.isArray(books)) {
        return res.status(400).json({ 
          error: "Missing or invalid fields. 'listId', 'title', and 'books' are required.",
          received: { listId, title, hasBooks: Array.isArray(books) }
        });
      }

      // First check if the table exists, create if it doesn't
      await sql`
        CREATE TABLE IF NOT EXISTS book_lists (
          list_id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          books JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Upsert the book list
      const result = await sql`
        INSERT INTO book_lists (list_id, title, books)
        VALUES (${listId}, ${title}, ${JSON.stringify(books)}::jsonb)
        ON CONFLICT (list_id) 
        DO UPDATE SET 
          title = EXCLUDED.title,
          books = EXCLUDED.books,
          updated_at = CURRENT_TIMESTAMP
        RETURNING list_id, title, books;
      `;

      return res.status(200).json({ 
        message: 'List saved successfully!', 
        savedData: result[0],
        debug: { listId, title, booksCount: books.length }
      });
      
    } else if (req.method === 'GET') {
      const { listId } = req.query;
      
      if (!listId) {
        return res.status(400).json({ 
          error: "The 'listId' query parameter is required." 
        });
      }

      // First verify table exists
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_name = 'book_lists'
        );
      `;

      if (!tableExists[0].exists) {
        return res.status(404).json({ 
          error: "Table does not exist yet",
          debug: { tableExists: false }
        });
      }

      // Query the book list
      const rows = await sql`
        SELECT title, books 
        FROM book_lists 
        WHERE list_id = ${listId};
      `;

      if (rows.length === 0) {
        return res.status(404).json({ 
          error: "List not found",
          debug: { 
            queriedId: listId,
            tableExists: true,
            foundRows: 0
          }
        });
      }

      return res.status(200).json({
        title: rows[0].title,
        books: rows[0].books,
        debug: { 
          queriedId: listId,
          tableExists: true,
          foundRows: rows.length
        }
      });
      
    } else {
      return res.status(405).json({ 
        error: 'Method Not Allowed. Use GET or POST.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: 'Database error occurred',
      details: error.message,
      debug: {
        code: error.code,
        where: error.where,
        hint: error.hint
      }
    });
  }
}
