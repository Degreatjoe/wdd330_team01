import {
  loadHeaderFooter
} from "./utils.mjs";

import ProductData from "./ProductData.mjs";
import ProductList from "./productlist.mjs";

async function init() {
  await loadHeaderFooter();

  const productListElement =
    document.querySelector(".product-list");

  if (!productListElement) {
    return;
  }

  const dataSource = new ProductData();

  const productList = new ProductList(
    "all",
    dataSource,
    productListElement
  );

  await productList.init();

  const sortElement =
    document.querySelector("#sort");

  if (sortElement) {
    sortElement.addEventListener("change", () => {
      productList.renderList(true);
    });
  }

  const newsletterForm = document.querySelector("#newsletter-form");
  const newsletterMessage = document.querySelector("#newsletter-message");

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    newsletterMessage.textContent =
      "Thank you for signing up for our newsletter!";

    newsletterForm.reset();
  });
}

init();