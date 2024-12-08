-- Drop the table if it exists
DROP TABLE IF EXISTS book_lists;

-- Create the book_lists table
CREATE TABLE book_lists (
  list_id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  books JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
