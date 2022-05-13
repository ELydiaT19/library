// SELECT ELEMENTS
const tableContainer = document.querySelector(".table__container");

// DECLARE VARS
let books = [];
let readBooks = [];
let counter = JSON.parse(localStorage.getItem("counter")) || 1;

// object constructor
function Book(bookId, title, author, pages, readStatus) {
  this.bookId = bookId;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
}

// FNs
// empty table state
function showEmptyTableState() {
  document
    .querySelector(".table__cell--empty")
    .classList.remove("table__cell--hidden");
}
function removeEmptyTableState() {
  document
    .querySelector(".table__cell--empty")
    .classList.add("table__cell--hidden");
}
function toggleEmptyTableState() {
  if (books.length === 0 || localStorage.getItem("storedBooks") === "[]") {
    showEmptyTableState();
  } else {
    removeEmptyTableState();
  }
}

// get localStorage books & generate table
function loadBooksFromStorage() {
  books = JSON.parse(localStorage.getItem("storedBooks"));

  if (
    books === null ||
    books.length === 0 ||
    localStorage.getItem("storedBooks") === "[]"
  ) {
    books = [];
    showEmptyTableState();
  } else {
    removeEmptyTableState();

    for (let i = 0; i < books.length; i++) {
      // define thisBook to make following steps easier
      const thisBook = books[i];
      createRow(thisBook);
    }
  }
}

function onReadStatusBtn(bookId) {
  // target this book
  thisBook = books.find((book) => book.bookId === bookId);

  if (thisBook.readStatus === "Unread") {
    thisBook.readStatus = "Read";
  } else if (thisBook.readStatus === "Read") {
    thisBook.readStatus = "Unread";
  }

  // target this row's readStatus btn
  thisReadStatusBtn = document
    .querySelector(`tr[data-id="${bookId}"]`)
    .querySelector(".btn__iconLabel");
  thisReadStatusBtn.innerHTML = thisBook.readStatus;

  updateToolbarCount();
  localStorage.setItem("storedBooks", JSON.stringify(books));
}

function deleteRowByBookId(bookId) {
  // target DOM row with same ID & delete row
  document.querySelector(`tr[data-id="${bookId}"]`).remove();

  // delete book object with same ID, from books array
  books = books.filter((book) => book.bookId !== bookId);

  localStorage.setItem("storedBooks", JSON.stringify(books));
  toggleEmptyTableState();
  updateToolbarCount();
}

function createRow(thisBook) {
  const tableRow = document.createElement("tr");
  tableRow.classList.add("table__row");
  tableContainer.append(tableRow);
  // set id data attribute for each tableRow
  tableRow.dataset.id = thisBook.bookId;

  const bookTitle = document.createElement("td");
  bookTitle.classList.add("table__row-item");
  bookTitle.innerHTML = thisBook.title;
  tableRow.append(bookTitle);

  const bookAuthor = document.createElement("td");
  bookAuthor.classList.add("table__row-item");
  bookAuthor.innerHTML = thisBook.author;
  tableRow.append(bookAuthor);

  const bookPages = document.createElement("td");
  bookPages.classList.add("table__row-item");
  bookPages.innerHTML = thisBook.pages;
  tableRow.append(bookPages);

  const readStatusBtnWrapper = document.createElement("td");
  const readStatusBtn = document.createElement("button");
  readStatusBtn.classList.add("btn__iconLabel");
  readStatusBtn.innerHTML = thisBook.readStatus;
  readStatusBtnWrapper.append(readStatusBtn);
  tableRow.append(readStatusBtnWrapper);

  const deleteBtnWrapper = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn__icon");
  deleteBtn.innerHTML = "🗑";
  deleteBtnWrapper.append(deleteBtn);
  tableRow.append(deleteBtnWrapper);
  // set id data attribute for each deleteBtn
  deleteBtn.dataset.id = thisBook.bookId;

  // add event listeners on readStatus btn & deleteBtn
  readStatusBtn.addEventListener("click", () =>
    onReadStatusBtn(thisBook.bookId)
  );
  deleteBtn.addEventListener("click", () => deleteRowByBookId(thisBook.bookId));
}

function createBook() {
  let bookId = counter++;
  let title = document.getElementById("book-title").value;
  let author = document.getElementById("book-author").value;
  let pages = document.getElementById("book-pages").value;
  let readStatus = document.getElementById("book-read-status").value;

  books.push(new Book(bookId, title, author, pages, readStatus));
  localStorage.setItem("counter", JSON.stringify(counter));
  localStorage.setItem("storedBooks", JSON.stringify(books));

  let thisBook = books[books.length - 1];

  toggleEmptyTableState();
  updateToolbarCount();
  createRow(thisBook);
}

function resetForm() {
  document.getElementById("book-title").value = "";
  document.getElementById("book-author").value = "";
  document.getElementById("book-pages").value = null;
  document.getElementById("book-read-status").value = "Unread";
}

function onSubmit(e) {
  // only create book if pass validity check
  if (e.target.checkValidity()) {
    createBook();
    resetForm();
    console.log(books);
  }
  // prevent form data being sent away
  e.preventDefault();
}

function updateToolbarCount() {
  readBooks = books.filter((book) => book.readStatus === "Read");
  document.getElementById("books-total").innerHTML = books.length;
  document.getElementById("books-read").innerHTML = readBooks.length;
}

// EVENT LISTENERS
document.getElementById("form").addEventListener("submit", onSubmit);

// FN CALLS
showEmptyTableState();
loadBooksFromStorage();
updateToolbarCount();
