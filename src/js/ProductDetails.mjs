import {
  getCartItemQuantity,
  getLocalStorage,
  replaceLocalStorage,
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
    const cartItems =
      getLocalStorage("so-cart");

    const existingItem =
      cartItems.find(
        (item) => item.Id === this.product.Id
      );

    if (existingItem) {
      existingItem.Quantity =
        getCartItemQuantity(existingItem) + 1;
    } else {
      cartItems.push({
        ...this.product,
        Quantity: 1
      });
    }

    replaceLocalStorage(
      "so-cart",
      cartItems
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
        product.Images?.PrimaryLarge ||
        product.Images?.PrimaryMedium ||
        "";
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

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    function getComments(productId) {
      const comments = JSON.parse(localStorage.getItem("productComments")) || [];

      return comments.filter(
        (comment) => comment.productId === productId
      );
    }

    function displayComments(productId) {
      const commentsList = document.querySelector("#comments-list");
      const comments = getComments(productId);

      commentsList.innerHTML = "";

      if (comments.length === 0) {
        commentsList.innerHTML = "<p>No comments yet. Be the first to comment!</p>";
        return;
      }

      comments.forEach((comment) => {
        const commentElement = document.createElement("article");

        commentElement.classList.add("comment");

        commentElement.innerHTML = `
      <h3>${comment.name}</h3>
      <p>${comment.text}</p>
    `;

        commentsList.appendChild(commentElement);
      });
    }

    const commentForm = document.querySelector("#comment-form");

    commentForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#comment-name").value;
      const text = document.querySelector("#comment-text").value;

      const comments =
        JSON.parse(localStorage.getItem("productComments")) || [];

      const newComment = {
        productId: productId,
        name: name,
        text: text,
      };

      comments.push(newComment);

      localStorage.setItem(
        "productComments",
        JSON.stringify(comments)
      );

      commentForm.reset();

      displayComments(productId);
    });

    displayComments(productId);

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
