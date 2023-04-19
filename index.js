import { menuArray } from "/data.js"

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
    document.querySelector("#payment-section").classList.add("hidden")
  }
}

// Process form submission
function handlePayment() {
  const formData = new FormData(document.getElementById("payment-form"))
  document.querySelector("#payment-section").classList.add("hidden")
  console.log(formData)
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
  updateCartIcon()
  localStorage.setItem("orderArray", JSON.stringify(orderArray))
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
  const cartNotif = document.getElementById("cart-count")
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
    let orderItems = ""

    orderArray.forEach(item => {
      const { name, price, quantity, id } = item

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

function getPaymentHTML() {
  return `
   <div class="payment-popup">
        <div
          id="close-popup"
          class="btn"
        >
          <i class="fa-solid fa-xmark"></i>
        </div>
        <h2 class="payment-title">Enter card details</h2>
        <form class="payment-form" id="payment-form">
          <input
            required
            type="text"
            pattern="[A-Za-z\s]{3,}"
            autocomplete="cc-name"
            name="name"
            id="payment-name"
            placeholder="Enter your name"
          />
          <input
            required
            type="tel"
            inputmode="numeric"
            pattern="[0-9\s]{13,19}"
            autocomplete="cc-number"
            name="card"
            id="payment-card"
            placeholder="Enter card number"
          />
          <input
            required
            type="tel"
            inputmode="numeric"
            pattern="[0-9\s]{3,4}"
            autocomplete="cc-csc"
            name="cvv"
            id="payment-cvv"
            placeholder="Enter CVV"
          />
          <button
            class="btn pay-btn"
            id="pay-btn"
            type="submit"
          >
            Pay ᖬ${getTotal()}
          </button>
        </form>
      </div>
  `
}

function renderMenu() {
  document.querySelector(".menu-section").innerHTML = getMenuHTML(menuArray)
}

function renderOrder() {
  document.querySelector(".your-order").innerHTML = getOrderHTML(orderArray)
}

function renderPayment() {
  document.querySelector("#payment-section").classList.remove("hidden")
  document.querySelector("#payment-section").innerHTML = getPaymentHTML()
}

document.addEventListener("click", handleClickEvent)

document.getElementById("payment-form") &&
  document.getElementById("payment-form").addEventListener("submit", e => {
    e.preventDefault()
    handlePayment()
  })

// Functions to fire on page load
window.addEventListener("DOMContentLoaded", () => {
  renderMenu()
  renderOrder()
  updateCartIcon()
})
