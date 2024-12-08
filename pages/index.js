export default function Home() {
  return (
<title>Book List Creator</title>
<link rel="stylesheet" href="./styles.css">
</head>
<body>
<header>
    <h1>📚 Book List Creator</h1>
    <p class="subtitle">Create and share your reading list with ease</p>
</header>

<section class="input-section">
    <div class="input-container">
        <input type="text" id="book-input" placeholder="Enter a book title or paste an Amazon URL..." />
    </div>
    <button id="add-book-btn" class="primary-btn">Add Book</button>
</section>

<section class="book-list-container">
    <h2 id="book-list-title" class="book-list-title"></h2>
    <div id="book-list" class="book-list"></div>
    <div class="empty-state">
        <p>Your book list is empty!</p>
        <p>Start by adding your favorite books above.</p>
    </div>
</section>

<section class="share-section">
    <input type="text" id="list-title-input" placeholder="Enter your list title..." style="display:block;width:100%;max-width:400px;margin:0 auto 20px;padding:15px;border-radius:8px;border:1px solid #ccc;font-size:1.1em;text-align:center;" />
    <button id="share-list-btn" class="primary-btn">Share My List</button>
    <div id="share-link-container" class="share-link-container">
        <p>Copy this link to share your book list:</p>
        <input type="text" id="share-link" readonly />
    </div>
</section>

<div id="notification" class="notification"></div>

<footer>
    <p>Made with 📚 | Powered by <a href="https://developers.google.com/books" target="_blank">Google Books API</a></p>
</footer>
)
<script src="./script.js"></script>
</body>
</html>
