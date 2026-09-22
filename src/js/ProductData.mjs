const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error(
    `Bad Response: ${res.status} ${res.statusText}`
  );
}

export default class ProductData {
  async getData(category) {
    const url = `${baseURL}products/search/${category}`;

    console.log("API URL:", url);

    const response = await fetch(url);

    console.log("Response status:", response.status);
    console.log("Response URL:", response.url);
    console.log(
      "Response content type:",
      response.headers.get("content-type")
    );

    const data = await convertToJson(response);

    console.log("API data:", data);

    return data.Result ?? [];
  }

  async getAllData() {
    const categories = [
      "backpacks",
      "tents",
      "sleeping-bags",
      "hammocks"
    ];

    const results = await Promise.all(
      categories.map((category) => this.getData(category))
    );

    return results.flat();
  }

  async findProductById(id) {
    const url = `${baseURL}product/${id}`;

    console.log("Product URL:", url);

    const response = await fetch(url);

    console.log(
      "Product response status:",
      response.status
    );

    const data = await convertToJson(response);

    console.log("Product data:", data);

    return data.Result ?? data;
  }
}