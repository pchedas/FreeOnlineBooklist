import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Book List Creator</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <header>
        <h1>📚 Book List Creator</h1>
        <p className="subtitle">Create and share your reading list with ease</p>
      </header>

      <section className="input-section">
        <div className="input-container">
          <input type="text" id="book-input" placeholder="Enter a book title or paste an Amazon URL..." />
        </div>
        <button id="add-book-btn" className="primary-btn">Add Book</button>
      </section>

      <section className="book-list-container">
        <h2 id="book-list-title" className="book-list-title"></h2>
        <div id="book-list" className="book-list"></div>
        <div className="empty-state">
          <p>Your book list is empty!</p>
          <p>Start by adding your favorite books above.</p>
        </div>
      </section>

      <section className="share-section">
        <input type="text" 
               id="list-title-input" 
               placeholder="Enter your list title..."
               style={{display:'block',width:'100%',maxWidth:'400px',margin:'0 auto 20px',padding:'15px',borderRadius:'8px',border:'1px solid #ccc',fontSize:'1.1em',textAlign:'center'}} 
        />
        <button id="share-list-btn" className="primary-btn">Share My List</button>
        <div id="share-link-container" className="share-link-container">
          <p>Copy this link to share your book list:</p>
          <input type="text" id="share-link" readOnly />
        </div>
      </section>

      <div id="notification" className="notification"></div>

      <footer>
        <p>Made with 📚 | Powered by <a href="https://developers.google.com/books" target="_blank">Google Books API</a></p>
      </footer>

      {/* Include script with next/script or from _document.js if needed. For now, you can just add it in Head or at the bottom of the page */}
      <script src="/script.js"></script>
    </>
  );
}
