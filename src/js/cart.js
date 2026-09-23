import {
  getLocalStorage,
  loadHeaderFooter
} from "./utils.mjs";

async function renderCartContents() {
  const cartItems =
    getLocalStorage("so-cart");

  const productList =
    document.querySelector(".product-list");

  if (!productList) {
    return;
  }

  if (cartItems.length === 0) {
    productList.innerHTML =
      "<p>Your cart is empty.</p>";

    return;
  }

  const htmlItems =
    cartItems.map(cartItemTemplate);

  productList.innerHTML =
    htmlItems.join("");
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">

      <a
        href="#"
        class="cart-card__image"
      >
        <img
          src="${item.PrimaryMedium || item.Image}"
          alt="${item.Name}"
        />
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

      <p class="cart-card__quantity">
        qty: 1
      </p>

      <p class="cart-card__price">
        $${Number(item.FinalPrice).toFixed(2)}
      </p>

    </li>
  `;
}

async function init() {
  await loadHeaderFooter();

  renderCartContents();
}

init();