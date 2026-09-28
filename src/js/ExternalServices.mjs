const baseURL = import.meta.env.VITE_SERVER_URL;


// ============================================
// Convert Response to JSON
// ============================================

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  }

  throw {
    name: "servicesError",
    message: jsonResponse
  };
}


// ============================================
// External Services
// ============================================

export default class ExternalServices {

  // ------------------------------------------
  // Get products by category
  // ------------------------------------------

  async getData(category) {
    const url = `${baseURL}products/search/${category}`;

    console.log("API URL:", url);

    const response = await fetch(url);

    console.log(
      "Response status:",
      response.status
    );

    const data = await convertToJson(response);

    return data.Result ?? [];
  }


  // ------------------------------------------
  // Get all products
  // ------------------------------------------

  async getAllData() {
    const categories = [
      "backpacks",
      "tents",
      "sleeping-bags",
      "hammocks"
    ];

    const results = await Promise.all(
      categories.map((category) =>
        this.getData(category)
      )
    );

    return results.flat();
  }


  // ------------------------------------------
  // Get one product by ID
  // ------------------------------------------

  async findProductById(id) {
    const url = `${baseURL}product/${id}`;

    console.log(
      "Product URL:",
      url
    );

    const response = await fetch(url);

    console.log(
      "Product response status:",
      response.status
    );

    const data =
      await convertToJson(response);

    return data.Result ?? data;
  }


  // ------------------------------------------
  // Submit checkout order
  // ------------------------------------------

  async checkout(payload) {
    const url = `${baseURL}checkout`;

    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(payload)
    };

    console.log(
      "Checkout URL:",
      url
    );

    console.log(
      "Checkout payload:",
      payload
    );

    const response =
      await fetch(url, options);

    return convertToJson(response);
  }
}