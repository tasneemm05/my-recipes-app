// -------------------- LOAD RECIPE --------------------
const recipe = JSON.parse(localStorage.getItem("currentRecipe"));
if(!recipe) throw new Error("No recipe found!");

const container = document.getElementById("recipe-detail");
let currentServings = recipe.servings;

// -------------------- SHOW DETAIL PAGE --------------------
container.style.display = "block";

document.getElementById("recipes-container").style.display = "none";
document.getElementById("favorites-list").style.display = "none";
document.getElementById("main-header").style.display = "none";
document.getElementById("favorites-title").style.display = "none";
document.getElementById("categories").style.display = "none";

// -------------------- DETAIL HTML --------------------
container.innerHTML = `
<button onclick="closeDetail()">⬅ Back</button>

<h1>${recipe.name}</h1>
<img src="${recipe.img}">

<p>⏱ ${recipe.time} min</p>
<p class="difficulty ${recipe.difficulty}">${recipe.difficulty}</p>

<h3>⭐ Rate this recipe</h3>
<div id="stars">
  <span data-value="1">⭐</span>
  <span data-value="2">⭐</span>
  <span data-value="3">⭐</span>
  <span data-value="4">⭐</span>
  <span data-value="5">⭐</span>
</div>
<p id="rating-result"></p>

<h3>Servings</h3>
<div class="servings-control">
  <button id="minus">➖</button>
  <span id="servings-count">${recipe.servings}</span>
  <button id="plus">➕</button>
</div>

<h3>Ingredients</h3>
<ul id="ingredients"></ul>

<h3>Steps</h3>
<ol id="steps-list"></ol>

<button onclick="startTimer(${recipe.time})">⏱ Start Timer</button>
<p id="timer-display"></p>

<h3>💬 Comments</h3>
<textarea id="comment-input" placeholder="Write your comment..."></textarea>
<button id="add-comment">Add Comment</button>
<ul id="comments-list"></ul>
`;

// -------------------- CLOSE DETAIL --------------------
function closeDetail(){

  container.style.display = "none";

  document.getElementById("recipes-container").style.display = "block";
  document.getElementById("favorites-list").style.display = "block";
  document.getElementById("main-header").style.display = "block";
  document.getElementById("favorites-title").style.display = "block";
  document.getElementById("categories").style.display = "block";

  displayRecipes(recipes);
  updateFavorites();
}

// -------------------- INGREDIENTS --------------------
function displayIngredients(servings){

  const list = document.getElementById("ingredients");
  list.innerHTML = "";

  const ingStateKey = `ingredients-${recipe.id}`;
  const savedIngredients = JSON.parse(localStorage.getItem(ingStateKey)) || [];

  recipe.ingredients.forEach((ing, index)=>{

    const amount = ((ing.amount/recipe.servings)*servings).toFixed(2);

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = savedIngredients[index] || false;

    if(checkbox.checked) li.style.textDecoration="line-through";

    const span = document.createElement("span");
    span.textContent=` ${amount} ${ing.name}`;

    checkbox.addEventListener("change",()=>{

      li.style.textDecoration = checkbox.checked ? "line-through" : "none";

      savedIngredients[index] = checkbox.checked;

      localStorage.setItem(ingStateKey, JSON.stringify(savedIngredients));

    });

    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);

  });

}

// -------------------- STEPS --------------------
function displaySteps(){

  const list = document.getElementById("steps-list");
  list.innerHTML="";

  const stepStateKey=`steps-${recipe.id}`;
  const savedSteps = JSON.parse(localStorage.getItem(stepStateKey)) || [];

  recipe.steps.forEach((step,index)=>{

    const li=document.createElement("li");

    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=savedSteps[index] || false;

    if(checkbox.checked) li.style.textDecoration="line-through";

    const span=document.createElement("span");
    span.textContent=" "+step;

    checkbox.addEventListener("change",()=>{

      li.style.textDecoration = checkbox.checked ? "line-through" : "none";

      savedSteps[index]=checkbox.checked;

      localStorage.setItem(stepStateKey, JSON.stringify(savedSteps));

    });

    li.appendChild(checkbox);
    li.appendChild(span);
    list.appendChild(li);

  });

}

// -------------------- SERVINGS --------------------
const servingsDisplay=document.getElementById("servings-count");

document.getElementById("plus").addEventListener("click",()=>{

  currentServings++;

  servingsDisplay.textContent=currentServings;

  displayIngredients(currentServings);

});

document.getElementById("minus").addEventListener("click",()=>{

  if(currentServings>1){

    currentServings--;

    servingsDisplay.textContent=currentServings;

    displayIngredients(currentServings);

  }

});

// -------------------- TIMER --------------------
function startTimer(minutes){

  let time = minutes*60;

  const display=document.getElementById("timer-display");

  updateDisplay(time);

  const timer=setInterval(()=>{

    time--;

    updateDisplay(time);

    if(time<=0){

      clearInterval(timer);

      display.textContent="⏰ Recipe Ready!";

      alert("Recipe Ready!");

    }

  },1000);

  function updateDisplay(seconds){

    const m=Math.floor(seconds/60);

    const s=seconds%60;

    display.textContent=`⏱ ${m}m ${s}s`;

  }

}

// -------------------- RATINGS --------------------
const stars=document.querySelectorAll("#stars span");

const ratingResult=document.getElementById("rating-result");

const allRatings = JSON.parse(localStorage.getItem("ratings")) || {};

let currentRating = allRatings[recipe.id] || 0;

function updateStars(){

  stars.forEach(star=>{

    star.style.opacity =
      (star.dataset.value <= currentRating && currentRating>0) ? "1" : "0.3";

  });

  ratingResult.textContent =
    currentRating>0 ? `Your rating: ${currentRating} / 5` : "No rating yet";

}

updateStars();

stars.forEach(star=>{

  star.addEventListener("click",()=>{

    currentRating =
      (currentRating==star.dataset.value) ? 0 : star.dataset.value;

    allRatings[recipe.id]=currentRating;

    localStorage.setItem("ratings", JSON.stringify(allRatings));

    updateStars();

    displayRecipes(recipes);

  });

});

// -------------------- COMMENTS --------------------
const commentInput=document.getElementById("comment-input");
const addCommentBtn=document.getElementById("add-comment");
const commentsList=document.getElementById("comments-list");

const commentsData = JSON.parse(localStorage.getItem("comments")) || {};

let recipeComments = commentsData[recipe.id] || [];

function displayComments(){

  commentsList.innerHTML="";

  recipeComments.forEach((c,index)=>{

    const li=document.createElement("li");

    li.classList.add("comment-bubble");

    const span=document.createElement("span");

    span.textContent=c;

    li.appendChild(span);

    const delBtn=document.createElement("button");

    delBtn.textContent="×";

    delBtn.addEventListener("click",()=>{

      recipeComments.splice(index,1);

      commentsData[recipe.id]=recipeComments;

      localStorage.setItem("comments", JSON.stringify(commentsData));

      displayComments();

    });

    li.appendChild(delBtn);

    if(index === recipeComments.length-1){

      li.classList.add("new-comment");

      setTimeout(()=> li.classList.remove("new-comment"),1500);

    }

    commentsList.appendChild(li);

  });

}

addCommentBtn.addEventListener("click",()=>{

  const text = commentInput.value.trim();

  if(!text) return;

  recipeComments.push(text);

  commentsData[recipe.id]=recipeComments;

  localStorage.setItem("comments", JSON.stringify(commentsData));

  commentInput.value="";

  displayComments();

});

commentInput.addEventListener("keypress",(e)=>{

  if(e.key==="Enter" && !e.shiftKey){

    e.preventDefault();

    addCommentBtn.click();

  }

});

displayComments();

// -------------------- INITIAL --------------------
displayIngredients(recipe.servings);
displaySteps();