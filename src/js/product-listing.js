import ProductData from "./ProductData.mjs";
import ProductList from "./productlist.mjs";
import {
  loadHeaderFooter,
  getParam
} from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const category = getParam("category");

  console.log("Category:", category);

  const dataSource = new ProductData();

  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    console.error("Product list element was not found.");
    return;
  }

  const productList = new ProductList(
    category,
    dataSource,
    listElement
  );

  await productList.init();

  const sortElement = document.querySelector("#sort");

  if (sortElement) {
    sortElement.addEventListener("change", () => {
      productList.renderList(true);
    });
  }

  updateListingTitle(category);
}

function updateListingTitle(category) {
  const title = document.querySelector("#listing-title");

  if (!title || !category) {
    return;
  }

  const formattedCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  title.textContent = `Top Products: ${formattedCategory}`;
}

init();