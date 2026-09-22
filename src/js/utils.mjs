// ============================================
// Query Selector Helper
// ============================================

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


// ============================================
// Local Storage
// ============================================

// Get data from localStorage
export function getLocalStorage(key) {
  try {
    const data = JSON.parse(
      localStorage.getItem(key)
    );

    // Make sure the returned value is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      `Could not read localStorage key "${key}"`,
      error
    );

    return [];
  }
}


// Save data to localStorage
export function setLocalStorage(key, data) {
  const dataList = getLocalStorage(key);

  dataList.push(data);

  localStorage.setItem(
    key,
    JSON.stringify(dataList)
  );
}


// ============================================
// Click Helper
// ============================================

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


// ============================================
// URL Parameters
// ============================================

// Get URL parameter
export function getParam(param) {
  const queryString = window.location.search;

  const urlParams =
    new URLSearchParams(queryString);

  return urlParams.get(param);
}


// ============================================
// Rendering
// ============================================

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

  parentElement.insertAdjacentHTML(
    position,
    htmlStrings.join("")
  );
}


// Render a template into an element
export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {
  if (!parentElement) {
    console.error(
      "renderWithTemplate: parent element was not found."
    );

    return;
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}


// ============================================
// Load HTML Templates
// ============================================

// Load an HTML template
export const loadTemplate = async (
  templatePath
) => {
  const response = await fetch(templatePath);

  if (!response.ok) {
    throw new Error(
      `Could not load ${templatePath}: ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
};


// ============================================
// Header and Footer
// ============================================

// Load header and footer
export const loadHeaderFooter = async () => {
  const headerElement =
    document.querySelector("#main-header");

  const footerElement =
    document.querySelector("#main-footer");

  // Stop if this page does not have
  // the header or footer
  if (!headerElement || !footerElement) {
    console.error(
      "Header or footer element was not found."
    );

    return;
  }

  const headerTemplate =
    await loadTemplate(
      "../partials/header.html"
    );

  const footerTemplate =
    await loadTemplate(
      "../partials/footer.html"
    );

  // Insert header
  renderWithTemplate(
    headerTemplate,
    headerElement
  );

  // Insert footer
  renderWithTemplate(
    footerTemplate,
    footerElement
  );

  // The cart icon now exists,
  // so update its count
  updateCartCount();
};


// ============================================
// Cart Count
// ============================================

// Update the number displayed on the cart icon
export function updateCartCount() {
  const cartItems =
    getLocalStorage("so-cart");

  const cartCount =
    document.querySelector(".cart-count");

  // Stop if this page does not have
  // a cart count element
  if (!cartCount) {
    return;
  }

  const count = cartItems.length;

  // Display the number
  cartCount.textContent = count;

  // Hide the number when cart is empty
  if (count === 0) {
    cartCount.style.display = "none";
  } else {
    cartCount.style.display = "inline-block";
  }
}