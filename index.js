import { menuArray } from "/data.js";

// Render menu items
function getMenuHTML() {
  let menuHTML = ``;

  menuArray.forEach((item) => {
    const { name, ingredients, id, price, emoji, category } = item;

    let ingredientsList = "";

    if (ingredients.length === 1) {
      ingredientsList = ingredients[0];
    } else if (ingredients.length > 1) {
      ingredientsList = ingredients.join(", ");
    }

    const menuItem = `
    <div class="menu-item" id=${id}>
          <div class="emoji">${emoji}</div>
          <div class="text-content">
            <h3 class="item-title">${name}</h3>
            <p class="ingredients">${ingredientsList}</p>
            <p class="price">ᖬ${price}</p>
          </div>
          <button class="btn add-btn" data-add=${id}>+</button>
        </div>`;

    menuHTML += menuItem;
  });

  return menuHTML;
}

function renderMenu() {
  document.querySelector(".menu-section").innerHTML = getMenuHTML();
}

renderMenu();
