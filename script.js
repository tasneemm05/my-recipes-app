// -------------------- DATA --------------------
const recipes = [
  { id:1,name:"Chocolate Cookies",category:"Desserts",time: 20,difficulty:"easy",img:"images/cookies.png",servings:4,ingredients:[{name:"eggs",amount:2},{name:"butter(g)",amount:100},{name:"flour(g)",amount:200}],steps:["Preheat oven","Mix ingredients","Shape cookies","Bake 20 minutes"] },
  { id:2,name:"Pancakes",category:"Breakfast",time: 15,difficulty:"easy",img:"images/pancakes.png",servings:2,ingredients:[{name:"flour(g)",amount:100},{name:"eggs",amount:2},{name:"milk(ml)",amount:200}],steps:["Mix ingredients","Heat pan","Pour batter","Cook both sides"] },
  { id:3,name:"Cinnamon Buns",category:"Desserts",time: 40,difficulty:"medium", servings: 4, img: "images/cinnamon-bun.png", ingredients: [{amount:2,name:"cups flour"},{amount:1,name:"cup milk"},{amount:0.25,name:"cup sugar"},{amount:1,name:"egg"},{amount:0.25,name:"cup butter"},{amount:1,name:"tbsp cinnamon"},{amount:1,name:"tsp yeast"}], steps: ["Warm the milk and mix it with yeast and sugar.","Add flour, egg, and butter to form a soft dough.","Let the dough rise for about 30 minutes.","Roll the dough flat and spread butter, sugar, and cinnamon.","Roll the dough into a log and slice into buns.","Bake in the oven at 180°C for about 20 minutes."] },
  { id:4,name:"Chocolate Cake",category:"Desserts",time: 60,difficulty:"medium",servings: 8, img: "images/chocolate-cake.png", ingredients: [{amount:2,name:"cups flour"},{amount:1.5,name:"cups sugar"},{amount:0.75,name:"cup cocoa powder"},{amount:1,name:"tsp baking soda"},{amount:0.5,name:"tsp salt"},{amount:1,name:"cup milk"},{amount:0.5,name:"cup oil"},{amount:2,name:"eggs"}], steps: ["Preheat oven to 180°C.","Mix dry ingredients together.","Add milk, oil, and eggs; mix well.","Pour into baking pan and bake for 30-35 minutes.","Let cool and frost as desired."] },
  { id:5,name:"Vanilla Cupcakes",category:"Desserts",time: 35,difficulty:"easy",servings: 12, img: "images/vanilla-cupcake.png", ingredients: [{amount:1.5,name:"cups flour"},{amount:1,name:"cup sugar"},{amount:1.5,name:"tsp baking powder"},{amount:0.25,name:"tsp salt"},{amount:0.5,name:"cup butter"},{amount:1,name:"cup milk"},{amount:2,name:"eggs"},{amount:1,name:"tsp vanilla extract"}], steps: ["Preheat oven to 180°C.","Mix dry ingredients together.","Add butter, milk, eggs, and vanilla; mix well.","Pour into cupcake liners.","Bake for 18-20 minutes.","Let cool before frosting."] },
  { id:6,name:"Cheeseburger",category:"fastfood",time: 25,difficulty:"easy", servings: 2, img: "images/cheese-burger.png", ingredients: [{amount:2,name:"burger buns"},{amount:200,name:"g beef patty"},{amount:2,name:"slices cheese"},{amount:1,name:"lettuce leaf"},{amount:1,name:"tomato slice"},{amount:1,name:"tbsp ketchup"}], steps:["Cook beef patty in pan until done.","Toast buns lightly.","Assemble burger with patty, cheese, lettuce, tomato, and ketchup.","Serve immediately."] },
  { id:7,name:"Spaghetti Carbonara",category:"Pasta",time: 30,difficulty:"medium", servings: 4, img: "images/Spaghetti-Carbonara.png", ingredients: [{amount:400,name:"g spaghetti"},{amount:150,name:"g pancetta"},{amount:2,name:"eggs"},{amount:0.5,name:"cup grated parmesan"},{amount:1,name:"tsp black pepper"}], steps:["Cook spaghetti until al dente.","Fry pancetta until crispy.","Mix eggs and parmesan in a bowl.","Combine pasta with pancetta and remove from heat.","Quickly stir in egg mixture to coat pasta.","Season with black pepper and serve."] },
  { id:8,name:"creamy Tomato Soup",category:"soups",time: 35,difficulty:"easy", servings: 4, img: "images/Tomato-Soup.png", ingredients: [{amount:500,name:"g tomatoes"},{amount:1,name:"onion"},{amount:2,name:"cloves garlic"},{amount:2,name:"cups vegetable broth"},{amount:1,name:"tbsp olive oil"},{amount:0.5,name:"tsp salt"}], steps:["Chop tomatoes, onion, and garlic.","Heat olive oil in a pot and sauté onion and garlic.","Add tomatoes and cook for 5 min.","Pour in broth and simmer for 15 min.","Blend until smooth and season with salt.","Serve hot."] },
  { id:9,name:"Greek Salad",category:"salads",time: 15,difficulty:"easy", servings: 2, img: "images/Greek-Salad.png", ingredients: [{amount:2,name:"cups lettuce"},{amount:1,name:"tomato"},{amount:0.5,name:"cucumber"},{amount:50,name:"g feta cheese"},{amount:5,name:"olives"},{amount:1,name:"tbsp olive oil"},{amount:0.5,name:"tbsp lemon juice"}], steps:["Chop lettuce, tomato, and cucumber.","Mix in a bowl with olives and feta.","Drizzle olive oil and lemon juice.","Toss and serve immediately."] },
  { id:10,name:"Orange Juice",category:"juices",time: 10,difficulty:"easy", servings: 2, img: "images/Orange-Juice.png", ingredients: [{amount:4,name:"oranges"},{amount:1,name:"tbsp sugar (optional)"}], steps:["Peel and segment oranges.","Juice them using a juicer or blender.","Add sugar if desired and stir.","Serve chilled."] }
];

// -------------------- STORAGE --------------------
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const ratings = JSON.parse(localStorage.getItem("ratings")) || {};

// -------------------- DISPLAY RECIPES --------------------
function displayRecipes(list){
  const container = document.getElementById("recipes-container");
  container.innerHTML = "";

  list.forEach(recipe=>{
    const card = document.createElement("div");
    card.className = "recipe-card";

    const isFav = favorites.includes(recipe.id);
    const heart = isFav ? "❤️" : "🤍";

    const avgRating = ratings[recipe.id] ? parseFloat(ratings[recipe.id]) : 0;
    const ratingStars = avgRating ? "⭐ "+avgRating+"/5" : "No rating";

    card.innerHTML = `
      <img src="${recipe.img}">
      <h3>${recipe.name}</h3>
      <p>⏱${recipe.time} min</p>
      <p class="difficulty ${recipe.difficulty}">${recipe.difficulty}</p>
      <p class="avg-rating">${ratingStars}</p>
      <button onclick="toggleFavorite(${recipe.id}, event)">${heart}</button>
    `;

    // click anywhere except button
    card.addEventListener("click", e=>{
      if(e.target.tagName!=="BUTTON") openRecipe(recipe.id);
    });

    container.appendChild(card);
  });
  updateFavorites();
}

// -------------------- FAVORITES --------------------
function toggleFavorite(id, e){
  e.stopPropagation();
  if(favorites.includes(id)) favorites = favorites.filter(f=>f!==id);
  else favorites.push(id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayRecipes(recipes);
}

function updateFavorites(){
  const list = document.getElementById("favorites-list");
  if(!list) return;
  list.innerHTML="";
  favorites.forEach(id=>{
    const r = recipes.find(r=>r.id===id);
    const li = document.createElement("li");
    li.textContent = r.name;
    li.style.cursor = "pointer";
    li.onclick = ()=>openRecipe(id);
    list.appendChild(li);
  });
}

// -------------------- OPEN RECIPE --------------------
function openRecipe(id){
  const recipe = recipes.find(r=>r.id===id);
  localStorage.setItem("currentRecipe", JSON.stringify(recipe));
  window.location = "recipe.html";
}

// -------------------- SEARCH --------------------
document.getElementById("search").addEventListener("input", e=>{
  const q = e.target.value.toLowerCase();
  const filtered = recipes.filter(r=>r.name.toLowerCase().includes(q));
  displayRecipes(filtered);
});

// -------------------- RANDOM --------------------
function randomRecipe(){
  const random = recipes[Math.floor(Math.random()*recipes.length)];
  localStorage.setItem("currentRecipe", JSON.stringify(random));
  window.location = "recipe.html";
}

// -------------------- FILTER CATEGORIES --------------------
function filterRecipes(category){
  if(category==="All") displayRecipes(recipes);
  else displayRecipes(recipes.filter(r=>r.category===category));
}

// -------------------- INIT --------------------
updateFavorites();
displayRecipes(recipes);