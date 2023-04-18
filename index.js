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

// Listen for clicks and fire functions
function handleClickEvent(e) {
  const target = e.target
  const targetParent = target.parentNode

  // Targetting both the button div and the icon within it
  if (target.dataset.add || targetParent.dataset.add) {
    const id = target.dataset.add || targetParent.dataset.add
    handleOrder(id, "add")
    // Trigger animation
    target.dataset.add
      ? target.classList.toggle("added")
      : targetParent.classList.toggle("added")
  } else if (target.dataset.remove) {
    handleOrder(target.dataset.remove, "remove")
  }
}

document.addEventListener("click", handleClickEvent)

// Define array of items in cart
let orderArray = JSON.parse(localStorage.getItem("orderArray")) || []

// Add or remove items from cart
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

// Render cart section
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

// Functions to fire on page load
window.addEventListener("DOMContentLoaded", () => {
  renderMenu()
  renderOrder()
})
