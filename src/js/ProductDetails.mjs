import {
  setLocalStorage,
  updateCartCount
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const product =
      await this.dataSource.findProductById(
        this.productId
      );

    if (!product) {
      console.error(
        "Product not found:",
        this.productId
      );
      return;
    }

    this.product = product;

    this.renderProductDetails();

    const addToCartButton =
      document.getElementById("addToCart");

    if (!addToCartButton) {
      console.error(
        "Add to Cart button was not found."
      );
      return;
    }

    addToCartButton.addEventListener(
      "click",
      this.addProductToCart.bind(this)
    );
  }

  addProductToCart() {
    setLocalStorage(
      "so-cart",
      this.product
    );

    updateCartCount();

    console.log(
      "Added to cart:",
      this.product.Name
    );
  }

  renderProductDetails() {
    const product = this.product;

    document.querySelector(
      ".product-detail h2"
    ).textContent =
      product.Brand?.Name ?? "";

    document.querySelector(
      ".product-detail h3"
    ).textContent =
      product.Name;

    const image =
      document.getElementById("productImage");

    if (image) {
      image.src =
        product.PrimaryLarge ||
        product.Image;

      image.alt = product.Name;
    }

    const price =
      document.getElementById("productPrice");

    if (price) {
      price.textContent =
        `$${Number(product.FinalPrice).toFixed(2)}`;
    }

    const color =
      document.getElementById("productColor");

    if (color) {
      color.textContent =
        `Color: ${
          product.Colors?.[0]?.ColorName ?? "N/A"
        }`;
    }

    const description =
      document.getElementById("productDesc");

    if (description) {
      description.innerHTML =
        product.DescriptionHtmlSimple;
    }

    const button =
      document.getElementById("addToCart");

    if (button) {
      button.dataset.id =
        product.Id;
    }
  }
}
