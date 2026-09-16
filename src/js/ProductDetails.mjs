
import { setLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Get the product
    const product = await this.dataSource.findProductById(this.productId);

    // Check if the product was found
    if (!product) {
      console.error("Product not found:", this.productId);
      return;
    }

    this.product = product;

    // Render the product details
    this.renderProductDetails();

    // Add listener to Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  // Add to cart button event handler
  addProductToCart() {
    setLocalStorage("so-cart", this.product);

    // Update the cart number immediately
    updateCartCount();
  }

  // Render the product details to the page
  renderProductDetails() {
    const product = this.product;

    // Product brand
    document.querySelector(".product-detail h2").textContent =
      product.Brand.Name;

    // Product name
    document.querySelector(".product-detail h3").textContent =
      product.Name;

    // Product image
    const image = document.getElementById("productImage");
    image.src = product.Image;
    image.alt = product.Name;

    // Product price
    document.getElementById("productPrice").textContent =
      `$${product.FinalPrice.toFixed(2)}`;

    // Product color
    document.getElementById("productColor").textContent =
      `Color: ${product.Colors[0].ColorName}`;

    // Product description
    document.getElementById("productDesc").innerHTML =
      product.DescriptionHtmlSimple;

    // Product ID
    document.getElementById("addToCart").dataset.id =
      product.Id;
  }
}

