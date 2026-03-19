import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------------------- LOAD RECIPE --------------------
const recipe = JSON.parse(localStorage.getItem("currentRecipe"));
if (!recipe) throw new Error("No recipe found!");

const container = document.getElementById("recipe-detail");
let currentServings = recipe.servings;

// -------------------- UI --------------------
container.innerHTML = `
<button onclick="closeDetail()">⬅ Back</button>

<h1>${recipe.name}</h1>
<img src="${recipe.img}">

<p>⏱ ${recipe.time} min</p>

<h3>⭐ Rate</h3>
<div id="stars">
  <span data-value="1">⭐</span>
  <span data-value="2">⭐</span>
  <span data-value="3">⭐</span>
  <span data-value="4">⭐</span>
  <span data-value="5">⭐</span>
</div>
<p id="rating-result"></p>

<h3>💬 Comments</h3>
<textarea id="comment-input"></textarea>
<button id="add-comment">Add</button>
<ul id="comments-list"></ul>
`;

// -------------------- RATINGS --------------------
const stars = document.querySelectorAll("#stars span");
const ratingResult = document.getElementById("rating-result");

let currentRating = 0;

async function getAverageRating() {
  const snapshot = await getDocs(collection(db, "ratings"));

  let total = 0;
  let count = 0;

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (d.recipeId === recipe.id) {
      total += d.value;
      count++;
    }
  });

  return count ? (total / count).toFixed(1) : 0;
}

async function updateStars() {
  const avg = await getAverageRating();

  stars.forEach(star => {
    star.style.opacity =
      star.dataset.value <= currentRating ? "1" : "0.3";
  });

  ratingResult.textContent =
    avg > 0 ? `Average: ${avg}/5` : "No rating";
}

stars.forEach(star => {
  star.addEventListener("click", async () => {
    currentRating = Number(star.dataset.value);

    await addDoc(collection(db, "ratings"), {
      recipeId: recipe.id,
      value: currentRating
    });

    updateStars();
  });
});

updateStars();

// -------------------- COMMENTS --------------------
const commentsList = document.getElementById("comments-list");
const commentInput = document.getElementById("comment-input");
const addCommentBtn = document.getElementById("add-comment");

async function loadComments() {
  commentsList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "comments"));

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    if (d.recipeId === recipe.id) {
      const li = document.createElement("li");

      li.textContent = d.text;

      const del = document.createElement("button");
      del.textContent = "×";

      del.onclick = async () => {
        await deleteDoc(doc(db, "comments", docSnap.id));
        loadComments();
      };

      li.appendChild(del);
      commentsList.appendChild(li);
    }
  });
}

addCommentBtn.addEventListener("click", async () => {
  const text = commentInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "comments"), {
    recipeId: recipe.id,
    text
  });

  commentInput.value = "";
  loadComments();
});

loadComments();