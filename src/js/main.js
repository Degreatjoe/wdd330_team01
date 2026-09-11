import ProductData from "./ProductData.mjs";
import ProductList from "./productlist.mjs";

const productList = new ProductList("all", new ProductData("all"), document.getElementById("product-list"));
productList.init();