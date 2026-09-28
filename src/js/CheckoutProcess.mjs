import {
  getLocalStorage
} from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";


function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}


function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: 1
  }));
}


export default class CheckoutProcess {

  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];

    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    this.externalServices = new ExternalServices();
  }


  init() {
    this.list = getLocalStorage(this.key);

    this.calculateItemSubTotal();
  }


  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => {
        return total + Number(item.FinalPrice);
      },
      0
    );

    this.displayOrderTotals();
  }


  calculateOrderTotal() {

    this.tax = this.itemTotal * 0.06;

    if (this.list.length > 0) {
      this.shipping = 10 + ((this.list.length - 1) * 2);
    } else {
      this.shipping = 0;
    }

    this.orderTotal =
      this.itemTotal +
      this.tax +
      this.shipping;

    this.displayOrderTotals();
  }


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


  async checkout(form) {

    const order = formDataToJSON(form);

    order.orderDate =
      new Date().toISOString();

    order.items =
      packageItems(this.list);

    order.orderTotal =
      this.orderTotal.toFixed(2);

    order.shipping =
      this.shipping;

    order.tax =
      this.tax.toFixed(2);

    console.log(
      "Order being submitted:",
      order
    );

    return this.externalServices.checkout(order);
  }
}