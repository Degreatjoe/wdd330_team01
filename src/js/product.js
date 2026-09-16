import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const listElement = document.querySelector(".product-list");

const sortElement = document.querySelector("#sort");

const productId = getParam("products");

const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);
product.init();
