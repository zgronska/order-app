import { menuArray } from "/data.js"

// Render menu items
function getMenuHTML() {
  return menuArray
    .map(({ name, ingredients, id, price, emoji }) => {
      const ingredientsList =
        ingredients.length === 1 ? ingredients[0] : ingredients.join(", ")

      return `
        <div class="menu-item" id=${id}>
          <div class="emoji">${emoji}</div>
          <div class="text-content">
            <h3 class="item-title">${name}</h3>
            <p class="ingredients">${ingredientsList}</p>
            <p class="price">ᖬ${price}</p>
          </div>
          <button class="add-btn btn" data-add=${id}>
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      `
    })
    .join("")
}

function renderMenu() {
  document.querySelector(".menu-section").innerHTML = getMenuHTML()
}

// Rotate the add icon
// //TODO: Modify this function to actually add items to order
// const addBtn = document.querySelectorAll(".add-btn");

// addBtn.forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     btn.classList.toggle("added");
//   });
// });

function handleClickEvent(e) {
  console.log(e.target.parentNode.dataset.add)
  if (e.target.dataset.add || e.target.parentNode.dataset.add) {
    const id = e.target.dataset.add
      ? e.target.dataset.add
      : e.target.parentNode.dataset.add
    handleOrder(id, "add")
  } else if (e.target.dataset.remove) {
    console.log(e.target.dataset.remove)
    handleOrder(e.target.dataset.remove, "remove")
  }
  //TODO: event listeners for other buttons
}

document.addEventListener("click", handleClickEvent)

let orderArray = JSON.parse(localStorage.getItem("orderArray")) || []

function handleOrder(itemId, action) {
  const selectedItem = menuArray.find(item => item.id === itemId)
  const existingItem = orderArray.find(item => item.id === itemId)

  if (action === "add") {
    if (existingItem) {
      existingItem.quantity++
    } else {
      selectedItem.quantity = 1
      orderArray.push(selectedItem)
    }
  } else if (action === "remove") {
    if (existingItem.quantity > 1) {
      existingItem.quantity--
    } else {
      orderArray.splice(orderArray.indexOf(existingItem), 1)
    }
  }

  localStorage.setItem("orderArray", JSON.stringify(orderArray))
  renderOrder()
}

function getOrderHTML() {
  if (orderArray.length > 0) {
    let orderItems = ""
    let total = 0

    orderArray.forEach(item => {
      const { name, price, quantity, id } = item

      total += quantity * price

      orderItems += `
      <div class="order-item" id="order-${id}">
      <h3 class="item-title">${name}</h3> <span>x ${quantity}</span>
      <button class="btn remove-btn" data-remove=${id}>remove</button>
      <p class="price">ᖬ${price}</p>
    </div>
      `
    })

    return `
    <h2 class="order-title">Your order</h2>
    <div class="order-items">
      ${orderItems}
    </div>

    <div class="total">
      <h3 class="total-title">Total price:</h3>
      <p class="price" id="total">ᖬ${total}</p>
    </div>
    <button class="btn submit-btn">Complete order</button>
  `
  } else return ``
}

function renderOrder() {
  const orderSection = document.querySelector(".your-order")

  orderSection.innerHTML = getOrderHTML()

  if (orderArray.length > 0) {
    orderSection.classList.remove("hidden")
  } else {
    orderSection.classList.add("hidden")
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderMenu()
  renderOrder()
})
