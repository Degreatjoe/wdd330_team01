import {
  loadHeaderFooter,
  alertMessage
} from "./utils.mjs";

import CheckoutProcess
  from "./CheckoutProcess.mjs";


// ============================================
// Initialize Checkout
// ============================================

async function init() {

  // Load header and footer

  await loadHeaderFooter();


  // Create CheckoutProcess

  const checkoutProcess =
    new CheckoutProcess(
      "so-cart",
      ".order-summary"
    );


  // Load cart and calculate totals

  checkoutProcess.init();


  // Get checkout form

  const form =
    document.querySelector(
      "#checkout-form"
    );


  // Make sure form exists

  if (!form) {

    console.error(
      "Checkout form was not found."
    );

    return;
  }


  // ==========================================
  // Form Submit
  // ==========================================

  form.addEventListener(
    "submit",
    async (event) => {

      // Prevent normal form submission

      event.preventDefault();


      // Check HTML form validation

      const isValid =
        form.checkValidity();


      // Show browser validation messages

      form.reportValidity();


      // Stop if form is invalid

      if (!isValid) {
        return;
      }


      // ========================================
      // Submit Order
      // ========================================

      try {

        await checkoutProcess.checkout(
          form
        );


      } catch (err) {

        console.error(
          "Checkout failed:",
          err
        );


        // Default error message

        let message =
          "There was a problem processing your order.";


        // Check for server error message

        if (
          err &&
          err.message
        ) {

          // If server returned a string

          if (
            typeof err.message ===
            "string"
          ) {

            message =
              err.message;


          } else {

            // If server returned an object

            message =
              Object.values(
                err.message
              ).join(" ");
          }
        }


        // Display custom alert

        alertMessage(message);
      }
    }
  );
}


// ============================================
// Start Checkout
// ============================================

init();