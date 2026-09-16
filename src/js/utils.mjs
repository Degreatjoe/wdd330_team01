// wrapper for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


// Get data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}


// Save data to localStorage
export function setLocalStorage(key, data) {
  const datalist = getLocalStorage(key);
  datalist.push(data);
  localStorage.setItem(key, JSON.stringify(datalist));
}


// Set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);

  if (!element) {
    return;
  }

  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });

  element.addEventListener("click", callback);
}


// Get URL parameter
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


// Render a list using a template
export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) {
    return;
  }

  const htmlStrings = list.map(template);

  if (clear) {
    parentElement.innerHTML = "";
  }

  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}


// Render a template into an element
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error("renderWithTemplate: parent element was not found.");
    return;
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}


// Load an HTML template
export const loadTemplate = async (templatePath) => {
  const response = await fetch(templatePath);

  if (!response.ok) {
    throw new Error(
      `Could not load ${templatePath}: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
};


// Load header and footer
export const loadHeaderFooter = async () => {
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  // Stop if this page does not have the header/footer
  if (!headerElement || !footerElement) {
    console.error("Header or footer element was not found.");
    return;
  }

  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  // Update cart count after the header has been inserted
  updateCartCount();
};


// Update the number displayed on the cart icon
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart");
  const cartCount = document.querySelector(".cart-count");

  if (!cartCount) {
    return;
  }

  cartCount.textContent = cartItems.length;

  // Hide the number when the cart is empty
  if (cartItems.length === 0) {
    cartCount.style.display = "none";
  } else {
    cartCount.style.display = "inline-block";
  }
};