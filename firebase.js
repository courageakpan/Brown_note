// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
}
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyCRDvTN9TDu1Xid1KIDcIsIEpx6qsrM-1k",

  authDomain: "brown-note-36097.firebaseapp.com",

  projectId: "brown-note-36097",

  storageBucket: "brown-note-36097.firebasestorage.app",

  messagingSenderId: "454366918834",

  appId: "1:454366918834:web:b79449cb02e8ffd411b1ab"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };

export const db = getFirestore(app);


// LOAD PRODUCTS
export async function loadProducts() {

  const snapshot = await getDocs(
    collection(db, "products")
  );

  const products = [];

  snapshot.forEach((docItem) => {

    products.push({
      id: Number(docItem.id),
      ...docItem.data()
    });

  });

  return products;
}


// SAVE PRODUCT
export async function saveProductToFirebase(product) {

  await setDoc(
    doc(db, "products", String(product.id)),
    product
  );

}


// DELETE PRODUCT
export async function deleteProductFromFirebase(id) {

  await deleteDoc(
    doc(db, "products", String(id))
  );

}