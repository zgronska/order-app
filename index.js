import { menuArray } from "/data.js";

// Render menu items
function getMenuHTML() {
  let menuHTML = ``;

  menuArray.forEach((item) => {
    const { name, ingredients, id, price, emoji, category } = item;

    const ingredientsList =
      ingredients.length === 1 ? ingredients[0] : ingredients.join(", ");

    const menuItem = `
    <div class="menu-item" id=${id}>
          <div class="emoji">${emoji}</div>
          <div class="text-content">
            <h3 class="item-title">${name}</h3>
            <p class="ingredients">${ingredientsList}</p>
            <p class="price">ᖬ${price}</p>
          </div>
          <button class="add-btn btn" data-add=${id}><i class="fa-solid fa-plus"}></i></button>
          
        </div>`;

    menuHTML += menuItem;
  });

  return menuHTML;
}

function renderMenu() {
  document.querySelector(".menu-section").innerHTML = getMenuHTML();
}

renderMenu();

// Rotate the add icon
//TODO: Modify this function to actually add items to order
const addBtn = document.querySelectorAll(".add-btn");

addBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    btn.classList.toggle("added");
  });
});

// Attach an event listener to each add-btn button so that when a user clicks on it, the item is added to their order.
// Create an empty order array to store the user's order.
// Write a function that takes the order array and renders it in the your-order div on the page.
// When the amount of items in the order array is greater than 0, display the your-order div.

document.addEventListener("click", (e) => {
  if (e.target.dataset.add || e.target.parentNode.dataset.add) {
    const id = e.target.dataset.add
      ? e.target.dataset.add
      : e.target.parentNode.dataset.add;
    handleAddToOrder(id);
  }
  //TODO: event listeners for other buttons
});

const orderArray = JSON.parse(localStorage.getItem("orderArray")) || [];

function handleAddToOrder(itemId) {
  const selectedItem = menuArray.find((item) => item.id === itemId);
  orderArray.push(selectedItem);
  localStorage.setItem("orderArray", JSON.stringify(orderArray));
}
