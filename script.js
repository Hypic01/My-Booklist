'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxbm75J-eq5qXAt6N2bGRvEQM5SUXlI9U",
  authDomain: "joons-booklist.firebaseapp.com",
  projectId: "joons-booklist",
  storageBucket: "joons-booklist.appspot.com",
  messagingSenderId: "852499729534",
  appId: "1:852499729534:web:665b491c94a276438b5c2f",
  measurementId: "G-P004QYKF02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);


//////////////////////////////////////////////////
//////////////////////////////////////////////////

// google books apikey
const apikey = 'AIzaSyCxbm75J-eq5qXAt6N2bGRvEQM5SUXlI9U';

let bookNum = 0;

const container = document.querySelector('.container'); 
const booksRead = document.querySelector('#bookNum');

const displayBooks = function(cover, title, author){
  const html = `
      <div class='book'>
        <div class='book_cover'><img src=${cover}></div>
        <div class='book_title'>${title}</div>
        <div class='book_author'>${author}</div>
        
      </div>
    `;

  container.insertAdjacentHTML('afterbegin', html);
}

const addBook = async function(title, author){

  let bookTitle = '';
  let bookAuthor = '';
  let bookCover = '';
  
  title = title.replace(' ', '');
  author = author.split(' ').pop();
  
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=${apikey}`);
    const json = await response.json();
    const bookData = json.items[0].volumeInfo;
    console.log(bookData);    
    
    bookCover = bookData['imageLinks']['thumbnail'];
    bookTitle = bookData['title'];
    bookAuthor = bookData['authors'][0];
    
    
  } catch(err) {    
    container.insertAdjacentHTML('afterbegin', "Can't find the book! Try again.");
    console.error(err);
    return;
  } 

  try {
    const docData = await setDoc(doc(db, "books", bookTitle), {
      title: bookTitle,
      author: bookAuthor,
      cover: bookCover,
    });
    console.log("book added!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// addBook('atomic habits', 'james clear');
// addBook('body keeps the score', 'Bessel van der Kolk');

const readBooks = async function(){
  const querySnapshot = await getDocs(collection(db, "books"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    displayBooks(doc.data().cover, doc.data().title, doc.data().author);
    bookNum++;
  });
  booksRead.innerHTML = bookNum;
}


// Default
readBooks();

