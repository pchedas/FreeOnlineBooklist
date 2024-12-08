import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // Test the database connection
    const result = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'book_lists'
      );
    `;
    
    // Get count of existing lists
    const countResult = await sql`
      SELECT COUNT(*) as count 
      FROM book_lists;
    `;

    return res.status(200).json({
      success: true,
      tableExists: result[0].exists,
      listCount: countResult[0].count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
