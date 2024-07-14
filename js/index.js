// Get references to the necessary HTML elements
let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

// When the document is ready, initiate a search by name with an empty term to load initial data
$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

// Fetch and display meal categories
const getCategories = async () => {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);
  searchContainer.innerHTML = "";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    displayCategories(data.categories);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
};

// Display a list of meals
const displayMeals = (arr) => {
  const mealsHtml = arr
    .map(
      (meal) => `
      <div class="col-md-3">
          <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${meal.strMealThumb}" alt="">
              <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                  <h3>${meal.strMeal}</h3>
              </div>
          </div>
      </div>
  `
    )
    .join("");

  rowData.innerHTML = mealsHtml;
};

// Display a list of categories
function displayCategories(arr) {
  const cartoona = arr
    .map(
      (category) => `
      <div class="col-md-3">
          <div onclick="getCategoryMeals('${
            category.strCategory
          }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
              <img class="w-100" src="${category.strCategoryThumb}" alt="${
        category.strCategory
      }" srcset="">
              <div class="meal-layer position-absolute text-center text-black p-2">
                  <h3>${category.strCategory}</h3>
                  <p>${category.strCategoryDescription
                    .split(" ")
                    .slice(0, 20)
                    .join(" ")}...</p>
              </div>
          </div>
      </div>
  `
    )
    .join("");

  rowData.innerHTML = cartoona;
}

// Fetch and display areas
async function getArea() {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    let response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    let data = await response.json();
    console.log(data.meals);

    displayArea(data.meals);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Display a list of areas
function displayArea(arr) {
  const cartoona = arr
    .map(
      (area) => `
      <div class="col-md-3">
          <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3>${area.strArea}</h3>
          </div>
      </div>
  `
    )
    .join("");

  rowData.innerHTML = cartoona;
}

// Fetch and display ingredients
async function getIngredients() {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    let response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    let data = await response.json();
    console.log(data.meals);

    displayIngredients(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Display a list of ingredients
function displayIngredients(arr) {
  const cartoona = arr
    .map(
      (ingredient) => `
      <div class="col-md-3">
          <div onclick="getIngredientsMeals('${
            ingredient.strIngredient
          }')" class="rounded-2 text-center cursor-pointer">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${ingredient.strIngredient}</h3>
              <p>${
                ingredient.strDescription
                  ? ingredient.strDescription.split(" ").slice(0, 20).join(" ")
                  : "No description available"
              }</p>
          </div>
      </div>
  `
    )
    .join("");

  rowData.innerHTML = cartoona;
}

// Fetch and display meals by category
async function getCategoryMeals(category) {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    let data = await response.json();
    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Fetch and display meals by area
async function getAreaMeals(area) {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Fetch and display meals by ingredient
async function getIngredientsMeals(ingredients) {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );
    displayMeals(data.meals.slice(0, 20));
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Helper function to fetch data from the API
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

// Fetch and display meal details by meal ID
async function getMealDetails(mealID) {
  try {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    searchContainer.innerHTML = "";

    const data = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );
    displayMealDetails(data.meals[0]);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

// Display meal details
function displayMealDetails(meal) {
  searchContainer.innerHTML = "";

  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .filter((i) => meal[`strIngredient${i}`])
    .map(
      (i) =>
        `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${
          meal[`strIngredient${i}`]
        }</li>`
    )
    .join("");

  const tags = meal.strTags ? meal.strTags.split(",") : [];
  const tagsStr = tags
    .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
    .join("");

  const cartoona = `
      <div class="col-md-4">
          <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
          <h2>${meal.strMeal}</h2>
      </div>
      <div class="col-md-8">
          <h2>Instructions</h2>
          <p>${meal.strInstructions}</p>
          <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
          <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
          <h3>Recipes :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
              ${ingredients}
          </ul>
          <h3>Tags :</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
              ${tagsStr}
          </ul>
          <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
          <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
      </div>`;

  rowData.innerHTML = cartoona;
}

// Display search input fields
function showSearchInputs() {
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`;

  rowData.innerHTML = "";
}

// Search meals by name
async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}

// Search meals by first letter
async function searchByFLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".inner-loading-screen").fadeOut(300);
}

// Display contact form
function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

// Variables to track if input fields have been touched
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// Validate all input fields
function inputsValidation() {
  const validations = [
    {
      touched: nameInputTouched,
      validate: nameValidation,
      alertId: "nameAlert",
    },
    {
      touched: emailInputTouched,
      validate: emailValidation,
      alertId: "emailAlert",
    },
    {
      touched: phoneInputTouched,
      validate: phoneValidation,
      alertId: "phoneAlert",
    },
    { touched: ageInputTouched, validate: ageValidation, alertId: "ageAlert" },
    {
      touched: passwordInputTouched,
      validate: passwordValidation,
      alertId: "passwordAlert",
    },
    {
      touched: repasswordInputTouched,
      validate: repasswordValidation,
      alertId: "repasswordAlert",
    },
  ];

  let allValid = true;

  validations.forEach(({ touched, validate, alertId }) => {
    if (touched) {
      const alertElement = document.getElementById(alertId);
      if (validate()) {
        alertElement.classList.replace("d-block", "d-none");
      } else {
        alertElement.classList.replace("d-none", "d-block");
        allValid = false;
      }
    }
  });

  if (allValid) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// Validation functions for each input field
function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(document.getElementById("emailInput").value);
}

function phoneValidation() {
  const phonePattern =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phonePattern.test(document.getElementById("phoneInput").value);
}

function ageValidation() {
  const agePattern = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  return agePattern.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return passwordPattern.test(document.getElementById("passwordInput").value);
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ===
    document.getElementById("passwordInput").value
  );
}

// Close the side navigation
closeSideNav();
$("i.open-close-icon").click(() => {
  if ($(".s-nav ").css("left") == "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

function closeSideNav() {
  let boxWidth = $(".s-nav .nav-tab").outerWidth();
  let slidewidth = $(".nav-header").outerWidth();
  $(".s-nav").animate(
    {
      left: -boxWidth,
    },
    500
  );
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
  $(".links a").animate(
    {
      top: 300,
    },
    500
  );
  // main contant animate
  $(".main").animate(
    {
      marginLeft: slidewidth,
    },
    500
  );
}

function openSideNav() {
  let boxWidth = $(".s-nav .nav-tab").outerWidth();
  let slidewidth = $(".nav-header").outerWidth();
  $(".s-nav").animate(
    {
      left: 0,
    },
    500
  );
  $(".main").animate(
    {
      marginLeft: boxWidth + slidewidth,
    },
    500
  );
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".links a")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}
