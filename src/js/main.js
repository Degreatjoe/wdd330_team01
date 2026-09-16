import { getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./productlist.mjs";
import {loadHeaderFooter} from "./utils.mjs";


loadHeaderFooter();
const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();

const cartItems = getLocalStorage("so-cart");
const cartCount = document.querySelector(".cart-count");

if (cartCount) {
  cartCount.textContent = cartItems.length;
}
