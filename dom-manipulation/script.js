let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit is the one you set yourself.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Tech" },
    { text: "Simplicity is the soul of efficiency.", category: "Productivity" }
  ];


  const lastCategory = localStorage.getItem('lastCategory') || 'all';




  const quoteDisplay = document.getElementById('quoteDisplay');
  const categoryFilter = document.getElementById('categoryFilter');


 


  function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);


    if (filteredQuotes.length === 0) {
      quoteDisplay.innerText = "No quotes in this category.";
      return;
    }


    const random = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.innerText = filteredQuotes[random].text;
  }


  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();


    if (!text || !category) {
      alert('Please enter both quote text and category.');
      return;
    }


    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    postQuoteToServer(newQuote);
    alert('Quote added successfully!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }


  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }


  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];


    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });


    categoryFilter.value = lastCategory;
  }


  function filterQuotes() {
    localStorage.setItem('lastCategory', categoryFilter.value);
    showRandomQuote();
  }


  function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    container.innerHTML = '';


    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';


    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';


    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.addEventListener('click', addQuote);


    container.appendChild(quoteInput);
    container.appendChild(categoryInput);
    container.appendChild(addButton);
  }


  function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);


    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();


    URL.revokeObjectURL(url);
  }


  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;


    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON file.');
        }
      } catch (error) {
        alert('Error parsing JSON.');
      }
    };
    reader.readAsText(file);
  }


  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();


      const serverQuotes = data.slice(0, 5).map(item => ({
        text: item.title,
        category: 'Server'
      }));


      return serverQuotes;
    } catch (error) {
      console.error('Error fetching from server:', error);
      return [];
    }
  }


  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();


    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    alert('Quotes synced with server!');


  }


  async function postQuoteToServer(quote) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-Type': 'application/json' }
      });


      const result = await response.json();
      console.log('Posted to server:', result);
    } catch (error) {
      console.error('Error posting to server:', error);
    }
  }


 
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  document.getElementById('syncButton').addEventListener('click', syncQuotes);
  document.getElementById('exportButton').addEventListener('click', exportToJson);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);


 
  populateCategories();
  filterQuotes();
  createAddQuoteForm();
  setInterval(syncQuotes, 60000);
