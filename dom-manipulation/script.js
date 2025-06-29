// ---------------------
// QUOTES STORAGE
// ---------------------
let quotes = [
  { text: "Keep moving forward!", category: "motivation" },
  { text: "Eat. Sleep. Code. Repeat.", category: "coding" }
];

// ---------------------
// INIT - Load on Page Load
// ---------------------
window.onload = function () {
  loadQuotes();
  populateCategories();
  restoreLastCategory();
};

// ---------------------
// SHOW RANDOM QUOTE
// ---------------------
function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quote found!";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerText = `${random.text} (${random.category})`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ---------------------
// ADD NEW QUOTE
// ---------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    alert("✅ Quote added!");
  } else {
    alert("❌ Please enter both quote and category.");
  }
}

// ---------------------
// SAVE & LOAD FROM LOCAL STORAGE
// ---------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  }
}

// ---------------------
// POPULATE CATEGORY FILTER
// ---------------------
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const selectedValue = select.value;

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });

  select.value = selectedValue;
}

// ---------------------
// FILTER QUOTES BY CATEGORY
// ---------------------
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  showRandomQuote();
}

// ---------------------
// RESTORE LAST SELECTED CATEGORY
// ---------------------
function restoreLastCategory() {
  const last = localStorage.getItem("lastCategory");
  if (last) {
    document.getElementById("categoryFilter").value = last;
    showRandomQuote();
  }
}

// ---------------------
// EXPORT QUOTES TO JSON FILE
// ---------------------
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// ---------------------
// IMPORT QUOTES FROM JSON FILE
// ---------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("✅ Quotes imported successfully!");
      } else {
        alert("❌ Invalid JSON format.");
      }
    } catch (err) {
      alert("❌ Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
