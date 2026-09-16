import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("products");
loadHeaderFooter();

const dataSource = new ProductData("tents");

const product = new ProductDetails(productId, dataSource);
product.init();
