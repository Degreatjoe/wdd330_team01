import {
  getCartItemQuantity,
  getLocalStorage,
  loadHeaderFooter,
  replaceLocalStorage,
  updateCartCount
} from "./utils.mjs";


function cartItemTemplate(item, index) {
  const quantity =
    getCartItemQuantity(item);

  const price =
    Number(item.FinalPrice);

  return `
    <li class="cart-card divider">

      <a
        href="#"
        class="cart-card__image"
      >

        <img
          src="${item.Images?.PrimaryMedium || item.Images?.PrimarySmall || ""}"
          alt="${item.Name}"
        >


      </a>


      <a href="#">

        <h2 class="card__name">
          ${item.Name}
        </h2>

      </a>


      <p class="cart-card__color">
        Color:
        ${item.Colors?.[0]?.ColorName ?? "N/A"}
      </p>


      <label class="cart-card__quantity">
        Qty
        <input
          type="number"
          min="1"
          step="1"
          value="${quantity}"
          data-cart-index="${index}"
          aria-label="Quantity for ${item.Name}"
        >
      </label>


      <p class="cart-card__price">
        Total: $${(price * quantity).toFixed(2)}
      </p>

    </li>
  `;
}


function calculateCartTotal(items) {

  return items.reduce(
    (total, item) =>
      total +
        Number(item.FinalPrice) *
        getCartItemQuantity(item),
    0
  );

}


function renderCartContents() {

  const cartItems =
    getLocalStorage("so-cart");


  const productList =
    document.querySelector(
      ".product-list"
    );


  if (!productList) {
    return;
  }


  if (cartItems.length === 0) {

    productList.innerHTML =
      "<p>Your cart is empty.</p>";

    const total =
      document.querySelector("#cart-total");

    if (total) {
      total.textContent = "$0.00";
    }

    return;
  }


  productList.innerHTML =
    cartItems
      .map((item, index) =>
        cartItemTemplate(item, index)
      )
      .join("");


  const cartTotal =
    calculateCartTotal(cartItems);


  const totalElement =
    document.querySelector("#cart-total");


  if (totalElement) {

    totalElement.textContent =
      `$${cartTotal.toFixed(2)}`;

  }

}


function updateCartItemQuantity(event) {
  const input =
    event.target.closest("[data-cart-index]");

  if (!input) {
    return;
  }

  const cartItems =
    getLocalStorage("so-cart");

  const itemIndex =
    Number(input.dataset.cartIndex);

  if (!cartItems[itemIndex]) {
    return;
  }

  const requestedQuantity =
    Number(input.value);

  const quantity =
    Number.isInteger(requestedQuantity) && requestedQuantity > 0
      ? requestedQuantity
      : 1;

  cartItems[itemIndex].Quantity = quantity;

  replaceLocalStorage(
    "so-cart",
    cartItems
  );

  updateCartCount();
  renderCartContents();
}


async function init() {

  await loadHeaderFooter();

  const productList =
    document.querySelector(".product-list");

  productList?.addEventListener(
    "change",
    updateCartItemQuantity
  );

  renderCartContents();

}


init();