let recipeSearch = function (query, start, end) {
  return `https://api.edamam.com/search?q=${query}&from=${start}&to=${end}&app_id=41c40656&app_key=462d7704ae8eed0535c9f0135b28c489`;
};

let query = document.getElementById('search');
let contentRow = document.getElementById('content');

// Pagination Code Starts
let pageNumber = 1;
let start = 0;
let end = 10;
let recordsPerPage = 10;
let totalPages = 10;

function loadPage(i) {
  pageNumber = i + 1;
  start = (pageNumber - 1) * recordsPerPage;
  end = pageNumber * recordsPerPage;
  getRecipes(query.value, start, end);
  checkButtons();
}

function loadPrevPage() {
  start = start - recordsPerPage;
  end = end - recordsPerPage;
  checkButtons();
}

function loadNextPage() {
  start = start + recordsPerPage;
  end = end + recordsPerPage;
  checkButtons();
}

function checkButtons() {
  let prevButton = document.getElementById('prev');
  if (start === 0) {
    prevButton.className += ' disabled';
    setAttribute(prevButton, 'style', 'cursor: not-allowed;');
  } else {
    prevButton.classList.remove('disabled');
  }

  let nextButton = document.getElementById('next');
  if (end === 100) {
    nextButton.className += ' disabled';
    setAttribute(nextButton, 'style', 'cursor: not-allowed;');
  } else {
    nextButton.classList.remove('disabled');
  }
}
//Pagination Code Ends

// Button enable/disable function

function btnCheck() {
  let btn = document.getElementById('search-btn');

  if (query.value.length === 0) {
    setAttribute(btn, 'disabled', 'true');
  } else {
    btn.removeAttribute('disabled');
  }
}

// Fetch input and pass to the api call
function getData(event) {
  prevent(event);
  getRecipes(query.value, start, end);
}

// get Recipe api call
async function getRecipes(query, start, end) {
  try {
    contentRow.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    </div>`;
    let recipeReq = await fetch(recipeSearch(query, start, end));
    let recipeData = await recipeReq.json();
    buildPaginationUI();
    buildUI(recipeData.hits);
    checkButtons();
  } catch (error) {
    console.log(error);
  }
}

//Build DOM function
function buildUI(data) {
  contentRow.innerHTML = '';
  if (data.length === 0) {
    let noRes = createElement('h1');
    setAttribute(noRes, 'class', 'text-white align-middle');
    noRes.innerText = 'No Results Found !!!';
    appendChild(contentRow, noRes);
  }
  for (let i = 0; i < data.length; i++) {
    // create card
    let card = createElement('div');
    setAttribute(card, 'class', 'card m-2 col-md-4 col-lg-3 col-sm-6 col-xs-12');
    appendChild(contentRow, card);

    // append image to card
    let img = createElement('img');
    img.src = data[i].recipe.image;
    setAttribute(img, 'class', 'card-img-top');
    appendChild(card, img);

    let cardBody = createElement('div');
    setAttribute(cardBody, 'class', 'card-body text-center');
    appendChild(card, cardBody);

    // label as link -> append to card body
    let btn = createElement('a');
    setAttribute(btn, 'href', data[i].recipe.url);
    setAttribute(btn, 'target', '_blank');
    appendChild(cardBody, btn);

    let title = createElement('h5');
    setAttribute(title, 'class', 'card-title');
    title.innerText = data[i].recipe.label;
    appendChild(btn, title);

    // calories Information -> append to card body
    let caloriesDiv = createElement('div');
    appendChild(cardBody, caloriesDiv);

    let caloriesLabel = createElement('b');
    caloriesLabel.innerText = 'Calories : ';
    appendChild(caloriesDiv, caloriesLabel);

    let calories = createElement('span');
    calories.innerText = Math.round(data[i].recipe.calories);
    appendChild(caloriesDiv, calories);

    // badges div to show health labels
    let badges = createElement('div');
    appendChild(cardBody, badges);

    data[i].recipe.healthLabels.forEach((element) => {
      let badge = createElement('span');
      setAttribute(badge, 'class', 'badge bg-secondary health-badge');
      badge.innerText = element;
      appendChild(badges, badge);
    });

    let br1 = createElement('br');
    appendChild(cardBody, br1);

    // filter vitamins from nutrients and form vitamins array
    let nutrients = data[i].recipe.totalNutrients;
    let vitamins = [];

    for (let i in nutrients) {
      if (i.startsWith('VIT') && vitamins.length < 6) {
        vitamins.push(nutrients[i]);
      }
    }
    //  append vitam badges to card body
    if (vitamins.length !== 0) {
      let vitaminsDiv = createElement('div');
      appendChild(cardBody, vitaminsDiv);
      let vitaminsLabel = createElement('h5');
      vitaminsLabel.innerText = 'Vitamins';
      appendChild(vitaminsDiv, vitaminsLabel);

      vitamins.forEach((element) => {
        let vitaminBadge = createElement('span');
        setAttribute(vitaminBadge, 'class', 'badge rounded-pill bg-warning');
        vitaminBadge.innerText = `${element.label} `;
        appendChild(vitaminsDiv, vitaminBadge);

        let vitaminQuantity = createElement('span');
        setAttribute(vitaminQuantity, 'class', 'badge rounded-pill bg-light');
        vitaminQuantity.innerText = Math.round(element.quantity);
        appendChild(vitaminBadge, vitaminQuantity);
      });
    }

    let br2 = createElement('br');
    appendChild(cardBody, br2);

    // Get ingredients , create an accordion and append to card body.
    let ingredientDiv = createElement('div');
    appendChild(cardBody, ingredientDiv);

    let showIngredient = createElement('button');
    setAttribute(showIngredient, 'class', 'btn btn-outline-info');
    setAttribute(showIngredient, 'data-toggle', 'collapse');
    setAttribute(showIngredient, 'data-target', `#collapse${data[i].recipe.label.split(' ').join('')}`);
    setAttribute(showIngredient, 'type', 'button');
    setAttribute(showIngredient, 'onclick', 'prevent(event)');
    setAttribute(showIngredient, 'aria-expanded', 'false');
    setAttribute(showIngredient, 'aria-controls', `collapse${data[i].recipe.label.split(' ').join('')}`);
    showIngredient.innerText = 'Ingredients List';
    appendChild(ingredientDiv, showIngredient);

    let br3 = createElement('br');
    appendChild(ingredientDiv, br3);

    let br4 = createElement('br');
    appendChild(ingredientDiv, br4);

    let ingredientAcc = createElement('div');
    setAttribute(ingredientAcc, 'class', 'collapse');
    setAttribute(ingredientAcc, 'id', `collapse${data[i].recipe.label.split(' ').join('')}`);
    appendChild(ingredientDiv, ingredientAcc);

    let ingredients = createElement('div');
    setAttribute(ingredients, 'class', 'card card-body');
    appendChild(ingredientAcc, ingredients);
    let ul = createElement('ul');
    setAttribute(ul, 'class', 'li-circle');
    appendChild(ingredients, ul);
    data[i].recipe.ingredientLines.forEach((element) => {
      let li = createElement('li');
      li.innerText = element;
      appendChild(ul, li);
    });
  }
}

// Reusable prevent default function for
// accordion and Search button
function prevent(event) {
  event.preventDefault();
}

// Build Pagination DOM
function buildPaginationUI() {
  let mainDiv = document.getElementById('pagination');
  mainDiv.innerHTML = '';

  let paginationDiv = createElement('div');
  setAttribute(paginationDiv, 'class', 'd-flex justify-content-center');
  appendChild(mainDiv, paginationDiv);

  let navBar = createElement('nav');
  setAttribute(navBar, 'aria-label', 'Pagination Data');
  appendChild(paginationDiv, navBar);

  let ul = createElement('ul');
  setAttribute(ul, 'class', 'pagination');
  appendChild(navBar, ul);

  if (totalPages > 1) {
    //Create previous button and add it to the container
    let prevButton = createElement('li');
    setAttribute(prevButton, 'class', 'page-item');
    setAttribute(prevButton, 'id', 'prev');
    appendChild(ul, prevButton);

    let prevHyperLink = createElement('a');
    setAttribute(prevHyperLink, 'class', 'page-link');
    setAttribute(prevHyperLink, 'style', 'cursor: pointer;');
    setAttribute(prevHyperLink, 'onclick', `loadPrevPage()`);

    prevHyperLink.innerText = 'Previous';
    appendChild(prevButton, prevHyperLink);
    appendChild(ul, prevButton);

    //Create Page number buttons
    for (let i = 0; i < totalPages; i++) {
      let pageNumBtn = createElement('li');
      setAttribute(pageNumBtn, 'class', 'page-item');
      setAttribute(pageNumBtn, 'id', `page${i + 1}`);
      appendChild(ul, pageNumBtn);

      let pageNumLink = createElement('a');
      setAttribute(pageNumLink, 'class', 'page-link');
      setAttribute(pageNumLink, 'style', 'cursor: pointer;');
      setAttribute(pageNumLink, 'onclick', `loadPage(${i})`);
      pageNumLink.innerText = i + 1;
      appendChild(pageNumBtn, pageNumLink);
      appendChild(ul, pageNumBtn);
    }

    //Create next button and add it to the container
    let nextButton = createElement('li');
    setAttribute(nextButton, 'class', 'page-item');
    setAttribute(nextButton, 'id', 'next');
    appendChild(ul, nextButton);

    let nextHyperLink = createElement('a');
    setAttribute(nextHyperLink, 'class', 'page-link');
    setAttribute(nextHyperLink, 'style', 'cursor: pointer;');
    setAttribute(nextHyperLink, 'onclick', `loadNextPage()`);
    nextHyperLink.innerText = 'Next';
    appendChild(nextButton, nextHyperLink);
    appendChild(ul, nextButton);
  }

  // add active class to the selected page button
  let currentBtn = document.getElementById(`page${pageNumber}`);
  currentBtn.classList.add('active');
}
