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
let currentListId = null; // We'll set this when sharing or if URL param is present

const params = new URLSearchParams(window.location.search);
const urlListId = params.get('list_id');

// If we have a list_id in the URL, fetch it from the server
if (urlListId) {
  currentListId = urlListId;
  fetchListFromServer(currentListId)
    .then(data => {
      currentListTitle = data.title || '';
      currentList = data.books || [];
      bookListTitle.textContent = currentListTitle || "Viewing a shared list";
      renderList();
    })
    .catch(() => {
      bookListTitle.textContent = "List not found";
      currentList = [];
      renderList();
    });
} else {
  // No list_id: empty list until user shares
  currentList = [];
  currentListTitle = '';
  bookListTitle.textContent = "Your Book List";
  renderList();
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
        showNotification('Book added successfully! 📚', 'success');
        bookInputEl.value = '';
      }
    } else {
      showNotification('No book found. Please try a different title or URL.', 'error');
    }
  } catch (error) {
    console.error(error);
    showNotification('Error adding book. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
});

shareListBtn.addEventListener('click', async () => {
  if (currentList.length === 0) {
    showNotification('Add some books to your list first! 📚');
    return;
  }

  currentListTitle = listTitleEl.value.trim() || "Untitled List";
  
  // If we don't have a list_id yet, generate one and store the entire list
  if (!currentListId) {
    currentListId = generateUniqueId();
  }

  try {
    await saveListToServer(currentListId, currentListTitle, currentList);
    bookListTitle.textContent = currentListTitle;
    const shareURL = `${window.location.origin}${window.location.pathname}?list_id=${currentListId}`;
    shareLinkEl.value = shareURL;
    shareLinkContainer.style.display = 'block';
    shareLinkEl.select();
    try {
      await navigator.clipboard.writeText(shareURL);
      showNotification('Link copied to clipboard! 🔗');
    } catch (err) {
      showNotification('Click to copy the link');
    }
  } catch (err) {
    console.error(err);
    showNotification('Error sharing list. Please try again.', 'error');
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
  // Check if this book already exists
  const isbn = (book.isbn || '').replace(/[^0-9Xx]/g,'');
  if (isbn && currentList.some(item => item.isbn === isbn)) {
    showNotification('This book is already in your list 📚');
    return false;
  }

  currentList.push(book);
  renderList();

  // If we already have a list_id (shared list), update the server
  if (currentListId) {
    saveListToServer(currentListId, currentListTitle, currentList)
      .catch(err => {
        console.error(err);
        showNotification('Error updating list on server', 'error');
      });
  }

  return true;
}

function renderList() {
  bookListEl.innerHTML = '';
  if (currentList.length === 0) {
    return; 
  }

  for (const data of currentList) {
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
        removeBookFromList(data.isbn);
      }, 300);
    });
    
    actionsDiv.appendChild(removeBtn);

    itemEl.appendChild(coverImg);
    itemEl.appendChild(detailsDiv);
    itemEl.appendChild(actionsDiv);
    bookListEl.appendChild(itemEl);
  }
}

function removeBookFromList(isbn) {
  currentList = currentList.filter(book => book.isbn !== isbn);
  renderList();
  showNotification('Book removed from your list');

  // If we have a list_id, update the server
  if (currentListId) {
    saveListToServer(currentListId, currentListTitle, currentList)
      .catch(err => {
        console.error(err);
        showNotification('Error updating list on server', 'error');
      });
  }
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
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (data.totalItems > 0) {
    return parseBookData(data.items[0], isbn);
  }
  return null;
}

async function fetchBookDataByTitle(title) {
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

async function fetchListFromServer(listId) {
  const res = await fetch(`/api/saveList?listId=${encodeURIComponent(listId)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch list');
  }
  return res.json();
}

async function saveListToServer(listId, title, books) {
  const res = await fetch('/api/saveList', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listId, title, books })
  });
  if (!res.ok) {
    throw new Error('Failed to save list');
  }
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
