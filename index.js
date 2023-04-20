import { menuArray } from "/data.js"

// Utility
const get = element => document.getElementById(element)

// Define array of items in cart
const orderArray = JSON.parse(localStorage.getItem("orderArray")) || []

// Listen for clicks and fire functions
function handleClickEvent(e) {
  const target = e.target
  const targetParent = target.parentNode

  // Add items to order
  // Targetting both the button div and the icon within it
  if (target.dataset.add || targetParent.dataset.add) {
    const id = target.dataset.add || targetParent.dataset.add
    handleOrder(id, "add")
  }
  // Remove items from order
  else if (target.dataset.remove) {
    handleOrder(target.dataset.remove, "remove")
  }
  // Show payment popup
  else if (target.id === "submit-btn") {
    renderPayment()
  }
  // Close payment popup
  else if (target.id === "close-popup" || targetParent.id === "close-popup") {
    get("payment-section").classList.add("hidden")
  }
  // Process payment
  else if (target.id === "pay-btn") {
    e.preventDefault()
    if (get("payment-form").checkValidity()) {
      handlePayment()
    } else {
      get("payment-form").reportValidity()
    }
  }
}

// Remove everything from order
function clearCart() {
  orderArray.length = 0

  renderOrder()
}

// Process form submission
function handlePayment() {
  const formData = new FormData(get("payment-form"))
  get("payment-section").classList.add("hidden")
  clearCart()
  renderThankYou(formData.get("name"))
}

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

  renderOrder()
}

// Get total amount
function getTotal() {
  return orderArray.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
}

// Get items count
function getCartCount() {
  return orderArray.reduce((acc, curr) => acc + curr.quantity, 0)
}

// Update cart notif
function updateCartIcon() {
  const cartNotif = get("cart-count")
  const cartCount = getCartCount()

  if (cartCount === 0) {
    cartNotif.classList.add("hidden")
  } else {
    cartNotif.classList.remove("hidden")
    cartNotif.textContent = cartCount
  }
}

// Render cart section
function getOrderHTML(orderArray) {
  if (orderArray.length > 0) {
    const orderItems = orderArray
      .map(({ name, price, quantity, id }) => {
        return `
          <div class="order-item" id="order-${id}">
              <h3 class="item-title">${name}</h3> <span>x ${quantity}</span>
              <button class="btn remove-btn" data-remove=${id}>remove</button>
              <p class="price">ᖬ${price}</p>
          </div>
      `
      })
      .join("")

    return `
          <h2 class="order-title">Your order</h2>
          <div class="order-items">
            ${orderItems}
          </div>

          <div class="total">
            <h3 class="total-title">Total price:</h3>
            <p class="price" id="total">ᖬ${getTotal()}</p>
          </div>
          <button class="btn submit-btn" id="submit-btn">Complete order</button>
        `
  } else {
    return `<p class="empty-cart">Your cart is empty.</p>`
  }
}

// Render menu items
function getMenuHTML(menuArray) {
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

// Render Thank You note
function renderThankYou(name) {
  get("sidebar").innerHTML = `
      <div class="thankyou-popup">
        <h2 class="thankyou-title">Thank you for your order, ${name}!</h2>
        <p class="thankyou-text">
          Our courier is rushing to you on their speeder! ⚡
        </p>
      </div>
  `
}

function renderMenu() {
  get("menu-section").innerHTML = getMenuHTML(menuArray)
}

function renderOrder() {
  get("sidebar").innerHTML = getOrderHTML(orderArray)
  updateCartIcon()
  localStorage.setItem("orderArray", JSON.stringify(orderArray))
}

function renderPayment() {
  get("payment-section").classList.remove("hidden")
}

document.addEventListener("click", handleClickEvent)

// Functions to fire on page load
window.addEventListener("DOMContentLoaded", () => {
  renderMenu()
  renderOrder()
  updateCartIcon()
})
