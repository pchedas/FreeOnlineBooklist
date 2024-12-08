<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Book List Creator</title>
<style>
    @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .shake {
        animation: shake 0.4s ease;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f5f6f7;
        margin: 0;
        padding: 0;
        color: #333;
        line-height: 1.6;
    }

    header {
        background: linear-gradient(135deg, #4e54c8, #8f94fb);
        color: #fff;
        text-align: center;
        padding: 60px 20px 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
    }

    header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%);
        pointer-events: none;
    }

    header h1 {
        margin: 0 0 15px;
        font-weight: 700;
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        animation: fadeIn 0.8s ease-out;
    }

    .subtitle {
        margin: 0;
        font-size: 1.2em;
        opacity: 0.9;
        animation: fadeIn 1s ease-out 0.2s backwards;
    }

    .input-section {
        max-width: 700px;
        margin: -25px auto 0;
        display: flex;
        align-items: stretch;
        justify-content: center;
        gap: 12px;
        padding: 0 20px;
        position: relative;
        z-index: 1;
    }

    .input-container {
        flex: 1;
        position: relative;
        animation: slideIn 0.6s ease-out;
    }

    .input-section input {
        width: 100%;
        padding: 15px 20px;
        font-size: 1.1em;
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .input-section input:focus {
        outline: none;
        box-shadow: 0 4px 20px rgba(78,84,200,0.2);
    }

    .input-section button {
        padding: 0 25px;
        min-width: 120px;
        font-size: 1.1em;
        border: none;
        background: #4e54c8;
        color: #fff;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.6s ease-out 0.1s backwards;
        white-space: nowrap;
        z-index: 2;
    }

    .input-section button:hover {
        background: #3e44a0;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(78,84,200,0.2);
    }

    .input-section button:active {
        transform: translateY(1px);
    }
    
    .input-section button:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .book-list-container {
        max-width: 700px;
        margin: 40px auto;
        padding: 0 20px;
    }

    .book-list-title {
        text-align: center;
        font-size: 1.8em;
        margin-bottom: 30px;
        color: #333;
        font-weight: 600;
    }

    .book-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .book-item {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        gap: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
        animation: slideIn 0.5s ease-out;
    }

    .book-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .book-item img {
        width: 80px;
        height: 120px;
        object-fit: cover;
        border-radius: 6px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }

    .book-item:hover img {
        transform: rotate(-2deg);
    }

    .book-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .book-details h3 {
        margin: 0;
        font-size: 1.3em;
        font-weight: 600;
        color: #333;
    }

    .book-details p {
        margin: 8px 0 0;
        font-size: 1em;
        color: #666;
    }

    .book-actions {
        display: flex;
        align-items: flex-start;
    }

    .book-actions button {
        background: none;
        border: none;
        color: #ff4757;
        cursor: pointer;
        font-size: 0.95em;
        padding: 8px 12px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .book-actions button:hover {
        background: #fff1f1;
        transform: translateY(-1px);
    }

    .share-section {
        text-align: center;
        max-width: 700px;
        margin: 50px auto;
        padding: 0 20px;
    }
    
    .share-section button {
        background: linear-gradient(135deg, #4e54c8, #8f94fb);
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 8px;
        font-size: 1.1em;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(78,84,200,0.2);
    }
    
    .share-section button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(78,84,200,0.3);
        background: linear-gradient(135deg, #3e44a0, #7f84eb);
    }

    .share-link-container {
        display: none;
        margin-top: 25px;
        padding: 20px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        animation: slideIn 0.5s ease-out;
    }

    .share-link-container p {
        margin: 0 0 15px;
        color: #666;
    }

    .share-link-container input {
        width: 90%;
        padding: 12px 15px;
        border: 2px solid #eee;
        border-radius: 6px;
        font-size: 1em;
        text-align: center;
        margin: 0 auto;
        display: block;
        transition: all 0.3s ease;
    }

    .share-link-container input:focus {
        outline: none;
        border-color: #4e54c8;
    }

    .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
        animation: fadeIn 0.8s ease-out;
        display: none;
    }

    footer {
        text-align: center;
        padding: 40px 10px;
        font-size: 0.95em;
        color: #888;
        background: #fff;
        border-top: 1px solid #eee;
        margin-top: 60px;
    }

    footer a {
        color: #4e54c8;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    footer a:hover {
        color: #3e44a0;
        text-decoration: underline;
    }

    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: #4e54c8;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    }
    
    .error-notification {
        background: #ff4757;
    }
    
    .success-notification {
        background: #2ed573;
    }

    #book-list:empty + .empty-state {
        display: block;
        padding: 40px 20px;
        text-align: center;
        color: #666;
    }
    
    #book-list:empty + .empty-state::before {
        content: "📚";
        font-size: 3em;
        display: block;
        margin-bottom: 15px;
    }
    
    @media (max-width: 600px) {
        header h1 {
            font-size: 2em;
        }
        
        .subtitle {
            font-size: 1em;
            padding: 0 20px;
        }
        
        .input-section {
            flex-direction: column;
            gap: 15px;
            margin-top: -15px;
        }

        .input-section button {
            width: 100%;
            height: 50px;
        }
        
        .input-section input {
            text-align: center;
        }

        .book-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 15px;
        }
        
        .book-item img {
            width: 100px;
            height: 150px;
            margin-bottom: 10px;
        }

        .book-actions {
            justify-content: center;
            width: 100%;
            margin-top: 15px;
        }
        
        .share-section button {
            width: 100%;
            max-width: 300px;
        }
        
        .notification {
            width: 90%;
            max-width: none;
            font-size: 0.9em;
            padding: 10px 20px;
        }
    }
</style>
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

<script>
    const bookListEl = document.getElementById('book-list');
    const bookInputEl = document.getElementById('book-input');
    const addBookBtn = document.getElementById('add-book-btn');
    const shareListBtn = document.getElementById('share-list-btn');
    const shareLinkContainer = document.getElementById('share-link-container');
    const shareLinkEl = document.getElementById('share-link');
    const notificationEl = document.getElementById('notification');
    const listTitleEl = document.getElementById('list-title-input');
    const bookListTitle = document.getElementById('book-list-title');

    let currentList = [];
    let currentListTitle = '';
    let isLoading = false;

    const params = new URLSearchParams(window.location.search);
    let currentListId = params.get('list_id');

    // Load the list and title based on local storage
    const stored = localStorage.getItem('bookList');
    if (stored) {
        currentList = JSON.parse(stored);
        // If we have a list_id, try to load the title from localStorage
        if (currentListId) {
            const titleKey = `listTitle:${currentListId}`;
            const storedTitle = localStorage.getItem(titleKey);
            if (storedTitle) {
                currentListTitle = storedTitle;
            }
        }
        renderList();
    }

    // If we have a list_id and title not found, show a default message
    if (currentListId && !currentListTitle) {
        bookListTitle.textContent = "Viewing a shared list";
    } else {
        bookListTitle.textContent = currentListTitle || "Your Book List";
    }

    function showNotification(message, type = 'info', duration = 3000) {
        notificationEl.textContent = message;
        notificationEl.className = 'notification';
        
        if (type === 'error') {
            notificationEl.classList.add('error-notification');
        } else if (type === 'success') {
            notificationEl.classList.add('success-notification');
        }
        
        notificationEl.style.display = 'block';
        
        setTimeout(() => {
            notificationEl.style.display = 'none';
        }, duration);
    }

    function setLoading(loading) {
        isLoading = loading;
        if (loading) {
            addBookBtn.innerHTML = '<span class="loading"></span>';
            addBookBtn.disabled = true;
        } else {
            addBookBtn.innerHTML = 'Add Book';
            addBookBtn.disabled = false;
        }
    }

    bookInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isLoading) {
            addBookBtn.click();
        }
    });

    addBookBtn.addEventListener('click', async () => {
        const userInput = bookInputEl.value.trim();
        if (!userInput) {
            bookInputEl.classList.add('shake');
            setTimeout(() => bookInputEl.classList.remove('shake'), 500);
            return;
        }

        setLoading(true);
        let isbn = null;
        let titleSearch = null;
        
        if (isAmazonURL(userInput)) {
            isbn = extractISBNFromAmazonURL(userInput);
        } else {
            titleSearch = userInput;
        }

        try {
            let bookData = null;
            if (isbn) {
                bookData = await fetchBookDataByISBN(isbn);
            } else if (titleSearch) {
                bookData = await fetchBookDataByTitle(titleSearch);
            }

            if (bookData) {
                if (addBookToList(bookData)) {
                    localStorage.setItem('bookList', JSON.stringify(currentList));
                    renderList();
                    showNotification('Book added successfully! 📚', 'success');
                    bookInputEl.value = '';
                }
            } else {
                showNotification('No book found. Please try a different title or URL.', 'error');
            }
        } catch (error) {
            showNotification('Error adding book. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    shareListBtn.addEventListener('click', () => {
        if (currentList.length === 0) {
            showNotification('Add some books to your list first! 📚');
            return;
        }

        currentListTitle = listTitleEl.value.trim() || "Untitled List";
        
        if (!currentListId) {
            currentListId = generateUniqueId();
        }

        // Store the list title in localStorage with a key referencing the list_id
        localStorage.setItem(`listTitle:${currentListId}`, currentListTitle);
        
        // Update heading on current page
        bookListTitle.textContent = currentListTitle;

        const shareURL = `${window.location.origin}${window.location.pathname}?list_id=${currentListId}`;
        shareLinkEl.value = shareURL;
        shareLinkContainer.style.display = 'block';
        shareLinkEl.select();
        
        try {
            navigator.clipboard.writeText(shareURL);
            showNotification('Link copied to clipboard! 🔗');
        } catch (err) {
            showNotification('Click to copy the link');
        }
    });

    shareLinkEl.addEventListener('click', function() {
        this.select();
        try {
            navigator.clipboard.writeText(this.value);
            showNotification('Link copied to clipboard! 🔗');
        } catch (err) {
            showNotification('Click to copy the link');
        }
    });

    function addBookToList(book) {
        const isbn = (book.isbn || '').replace(/[^0-9Xx]/g,''); 
        if (isbn && currentList.some(id => {
            const dataStr = localStorage.getItem(`bookData:${id}`);
            if (dataStr) {
                const d = JSON.parse(dataStr);
                return d.isbn === isbn;
            }
            return false;
        })) {
            showNotification('This book is already in your list 📚');
            return false;
        }

        const id = isbn || Math.random().toString(36).substr(2,9);
        currentList.push(id);
        localStorage.setItem(`bookData:${id}`, JSON.stringify(book));
        return true;
    }

    function renderList() {
        bookListEl.innerHTML = '';
        if (currentList.length === 0) {
            return; 
        }

        for (const id of currentList) {
            const dataStr = localStorage.getItem(`bookData:${id}`);
            if (!dataStr) continue;
            const data = JSON.parse(dataStr);

            const itemEl = document.createElement('div');
            itemEl.className = 'book-item';

            const coverImg = document.createElement('img');
            coverImg.src = data.cover || '';
            coverImg.alt = data.title || 'No Cover';

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'book-details';

            const titleEl = document.createElement('h3');
            titleEl.textContent = data.title || 'Unknown Title';

            const authorEl = document.createElement('p');
            authorEl.textContent = data.authors && data.authors.length > 0 
                ? 'By ' + data.authors.join(', ') 
                : 'Unknown Author';

            if (data.isbn) {
                const isbnEl = document.createElement('p');
                isbnEl.textContent = `ISBN: ${data.isbn}`;
                isbnEl.style.color = '#888';
                isbnEl.style.fontSize = '0.9em';
                detailsDiv.appendChild(isbnEl);
            }

            detailsDiv.appendChild(titleEl);
            detailsDiv.appendChild(authorEl);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'book-actions';
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '🗑️ Remove';
            removeBtn.addEventListener('click', () => {
                itemEl.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => {
                    removeBookFromList(id);
                    localStorage.setItem('bookList', JSON.stringify(currentList));
                    renderList();
                    showNotification('Book removed from your list');
                }, 300);
            });
            
            actionsDiv.appendChild(removeBtn);

            itemEl.appendChild(coverImg);
            itemEl.appendChild(detailsDiv);
            itemEl.appendChild(actionsDiv);
            bookListEl.appendChild(itemEl);
        }
    }

    function removeBookFromList(id) {
        currentList = currentList.filter(item => item !== id);
        localStorage.removeItem(`bookData:${id}`);
    }

    function isAmazonURL(url) {
        return url.toLowerCase().includes('amazon.');
    }

    function extractISBNFromAmazonURL(url) {
        const match = url.match(/([0-9Xx]{10,13})/);
        if (match) return match[1];
        return null;
    }

    async function fetchBookDataByISBN(isbn) {
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`;
            const resp = await fetch(url);
            const data = await resp.json();
            if (data.totalItems > 0) {
                return parseBookData(data.items[0], isbn);
            }
            return null;
        } catch (error) {
            console.error('Error fetching book by ISBN:', error);
            return null;
        }
    }

    async function fetchBookDataByTitle(title) {
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`;
            const resp = await fetch(url);
            const data = await resp.json();
            if (data.totalItems > 0) {
                const volume = data.items[0];
                let isbn = '';
                if (volume.volumeInfo.industryIdentifiers) {
                    const isbnObj = volume.volumeInfo.industryIdentifiers.find(i => i.type.includes('ISBN'));
                    if (isbnObj) {
                        isbn = isbnObj.identifier;
                    }
                }
                return parseBookData(volume, isbn);
            }
            return null;
        } catch (error) {
            console.error('Error fetching book by title:', error);
            return null;
        }
    }

    function parseBookData(volume, isbn) {
        const info = volume.volumeInfo;
        return {
            title: info.title || 'Unknown Title',
            authors: info.authors || [],
            isbn: isbn || '',
            cover: info.imageLinks ? info.imageLinks.thumbnail : '',
        };
    }

    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
</script>
</body>
</html>
