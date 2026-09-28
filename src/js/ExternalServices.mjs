const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }

  throw new Error(
    `Bad Response: ${res.status} ${res.statusText}`
  );
}

export default class ExternalServices {
  async getData(category) {
    const url = `${baseURL}products/search/${category}`;

    console.log("API URL:", url);

    const response = await fetch(url);

    console.log("Response status:", response.status);

    const data = await convertToJson(response);

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

    const response = await fetch(url);

    const data = await convertToJson(response);

    return data.Result ?? data;
  }

  async checkout(payload) {
    const url = `${baseURL}checkout`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(url, options);

    return convertToJson(response);
  }
}