import {
  getCartItemQuantity,
  getLocalStorage
} from "./utils.mjs";

import ExternalServices
  from "./ExternalServices.mjs";


// ============================================
// Convert Form Data to JSON
// ============================================

function formDataToJSON(formElement) {
  const formData =
    new FormData(formElement);

  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}


// ============================================
// Package Cart Items
// ============================================

function packageItems(items) {
  return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: getCartItemQuantity(item)
  }));
}


// ============================================
// Checkout Process
// ============================================

export default class CheckoutProcess {

  constructor(
    key,
    outputSelector
  ) {
    this.key = key;

    this.outputSelector =
      outputSelector;

    this.list = [];

    this.itemTotal = 0;

    this.shipping = 0;

    this.tax = 0;

    this.orderTotal = 0;

    this.externalServices =
      new ExternalServices();
  }


  // ------------------------------------------
  // Initialize Checkout
  // ------------------------------------------

  init() {
    this.list =
      getLocalStorage(this.key);

    this.calculateItemSubTotal();

    this.calculateOrderTotal();
  }


  // ------------------------------------------
  // Calculate Subtotal
  // ------------------------------------------

  calculateItemSubTotal() {
    this.itemTotal =
      this.list.reduce(
        (total, item) =>
          total +
          Number(item.FinalPrice) *
          getCartItemQuantity(item),
        0
      );

    this.displayOrderTotals();
  }


  // ------------------------------------------
  // Calculate Tax, Shipping and Total
  // ------------------------------------------

  calculateOrderTotal() {

    // Tax = 6%
    this.tax =
      this.itemTotal * 0.06;


    // Shipping:
    // First item = $10
    // Each additional item = $2

    const itemCount =
      this.list.reduce(
        (total, item) =>
          total + getCartItemQuantity(item),
        0
      );

    if (itemCount > 0) {

      this.shipping =
        10 +
        (itemCount - 1) * 2;

    } else {

      this.shipping = 0;
    }


    // Final order total

    this.orderTotal =
      this.itemTotal +
      this.tax +
      this.shipping;


    this.displayOrderTotals();
  }


  // ------------------------------------------
  // Display Order Totals
  // ------------------------------------------

  displayOrderTotals() {

    const subtotal =
      document.querySelector(
        `${this.outputSelector} #subtotal`
      );

    const tax =
      document.querySelector(
        `${this.outputSelector} #tax`
      );

    const shipping =
      document.querySelector(
        `${this.outputSelector} #shipping`
      );

    const orderTotal =
      document.querySelector(
        `${this.outputSelector} #order-total`
      );


    if (subtotal) {
      subtotal.textContent =
        `$${this.itemTotal.toFixed(2)}`;
    }


    if (tax) {
      tax.textContent =
        `$${this.tax.toFixed(2)}`;
    }


    if (shipping) {
      shipping.textContent =
        `$${this.shipping.toFixed(2)}`;
    }


    if (orderTotal) {
      orderTotal.textContent =
        `$${this.orderTotal.toFixed(2)}`;
    }
  }


  // ------------------------------------------
  // Submit Checkout
  // ------------------------------------------

  async checkout(form) {

    try {

      // Convert form to object

      const order =
        formDataToJSON(form);


      // Add order date

      order.orderDate =
        new Date().toISOString();


      // Add cart items

      order.items =
        packageItems(this.list);


      // Add order total

      order.orderTotal =
        this.orderTotal.toFixed(2);


      // Add shipping

      order.shipping =
        this.shipping;


      // Add tax

      order.tax =
        this.tax.toFixed(2);


      console.log(
        "Order being submitted:",
        order
      );


      // Send order to server

      const response =
        await this.externalServices.checkout(
          order
        );


      console.log(
        "Checkout successful:",
        response
      );


      // Clear cart after successful order

      localStorage.removeItem(
        this.key
      );


      // Go to success page

      window.location.href =
        "/checkout/success.html";


    } catch (err) {

      console.error(
        "Checkout error:",
        err
      );

      // Send error back to checkout.js

      throw err;
    }
  }
}