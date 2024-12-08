import Head from 'next/head'
import { useEffect } from 'react'
import Script from 'next/script'

export default function Home() {
  useEffect(() => {
    // Client-side code will run here
  }, [])

  return (
    <>
      <Head>
        <title>Book List Creator</title>
        <meta name="description" content="Create and share your reading list with ease" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <header>
          <h1>📚 Book List Creator</h1>
          <p className="subtitle">Create and share your reading list with ease</p>
        </header>

        <section className="input-section">
          <div className="input-container">
            <input 
              type="text" 
              id="book-input" 
              placeholder="Enter a book title or paste an Amazon URL..." 
            />
          </div>
          <button id="add-book-btn">Add Book</button>
        </section>

        <section className="book-list-container">
          <h2 id="book-list-title" className="book-list-title">Your Book List</h2>
          <div id="book-list" className="book-list"></div>
          <div className="empty-state">
            <p>Your book list is empty!</p>
            <p>Start by adding your favorite books above.</p>
          </div>
        </section>

        <section className="share-section">
          <input 
            type="text" 
            id="list-title-input" 
            placeholder="Enter your list title..."
            className="list-title-input"
          />
          <button id="share-list-btn">Share My List</button>
          <div id="share-link-container" className="share-link-container">
            <p>Copy this link to share your book list:</p>
            <input type="text" id="share-link" readOnly />
          </div>
        </section>

        <div id="notification" className="notification"></div>

        <footer>
          <p>Made with 📚 | Powered by <a href="https://developers.google.com/books" target="_blank" rel="noopener noreferrer">Google Books API</a></p>
        </footer>
      </div>

      <Script 
        src="/js/script.js"
        strategy="afterInteractive"
      />
    </>
  )
}
