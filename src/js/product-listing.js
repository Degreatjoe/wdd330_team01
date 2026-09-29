import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./productlist.mjs";
import {
  loadHeaderFooter,
  getParam
} from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const category = getParam("category") || "all";
  const searchQuery = getParam("search")?.trim();
  const searchInput = document.querySelector("#product-search");

  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
  }

  const dataSource = new ExternalServices();

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

  const listingMessage = document.querySelector("#listing-message");

  if (searchQuery) {
    try {
      productList.list = await dataSource.searchProducts(searchQuery);
      productList.renderList(true);
      if (listingMessage && productList.list.length === 0) {
        listingMessage.textContent = `No products found for "${searchQuery}".`;
      }
    } catch (error) {
      console.error("Could not search products.", error);
      if (listingMessage) {
        listingMessage.textContent =
          "Could not load search results. Please try again.";
      }
    }
  } else {
    await productList.init();
  }

  const sortElement = document.querySelector("#sort");

  if (sortElement) {
    sortElement.addEventListener("change", () => {
      productList.renderList(true);
    });
  }

  updateListingTitle(category, searchQuery);
}

function updateListingTitle(category, searchQuery) {
  const title = document.querySelector("#listing-title");

  if (!title) {
    return;
  }

  if (searchQuery) {
    title.textContent = `Search results for "${searchQuery}"`;
    return;
  }

  if (category === "all") {
    title.textContent = "All Outdoor Products";
    return;
  }

  const formattedCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  title.textContent = `Top Products: ${formattedCategory}`;
}

init();