import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'book_lists'
      );
    `;

    let lists = [];
    let totalCount = 0;

    if (tableExists[0].exists) {
      // Get all lists (limited to 10 for safety)
      lists = await sql`
        SELECT list_id, title, created_at, updated_at
        FROM book_lists
        LIMIT 10;
      `;

      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as count 
        FROM book_lists;
      `;
      totalCount = countResult[0].count;
    }

    return res.status(200).json({
      status: 'ok',
      databaseConnected: true,
      tableExists: tableExists[0].exists,
      totalLists: totalCount,
      recentLists: lists.map(list => ({
        id: list.list_id,
        title: list.title,
        created: list.created_at,
        updated: list.updated_at
      })),
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message,
      databaseConnected: false,
      serverTime: new Date().toISOString()
    });
  }
}
