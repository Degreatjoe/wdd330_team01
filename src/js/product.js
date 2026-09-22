import {
  getParam,
  loadHeaderFooter
} from "./utils.mjs";

import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function init() {
  await loadHeaderFooter();

  const productId = getParam("products");

  if (!productId) {
    console.error(
      "Product ID was not found in the URL."
    );
    return;
  }

  const dataSource = new ProductData();

  const product = new ProductDetails(
    productId,
    dataSource
  );

  await product.init();
}

init();