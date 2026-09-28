import {
  loadHeaderFooter
} from "./utils.mjs";

import CheckoutProcess from "./CheckoutProcess.mjs";


async function init() {

  await loadHeaderFooter();


  const checkoutProcess =
    new CheckoutProcess(
      "so-cart",
      ".order-summary"
    );


  checkoutProcess.init();


  const zipInput =
    document.querySelector("#zip");


  if (zipInput) {

    zipInput.addEventListener(
      "blur",
      () => {
        checkoutProcess.calculateOrderTotal();
      }
    );

  }


  const form =
    document.querySelector("#checkout-form");


  if (form) {

    form.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        try {

          const response =
            await checkoutProcess.checkout(form);

          console.log(
            "Checkout response:",
            response
          );

          const message =
            document.querySelector(
              "#checkout-message"
            );

          if (message) {
            message.textContent =
              "Order submitted successfully!";
          }

        } catch (error) {

          console.error(
            "Checkout failed:",
            error
          );

          const message =
            document.querySelector(
              "#checkout-message"
            );

          if (message) {
            message.textContent =
              "There was a problem submitting your order.";
          }

        }

      }
    );

  }

}


init();