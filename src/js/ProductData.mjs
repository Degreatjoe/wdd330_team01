const baseURL = import.meta.env.VITE_SERVER_URL;




function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(
      `Bad Response: ${res.status} ${res.statusText}`
    );
  }
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

    return data.Result;
  }

  async findProductById(id) {
    const url = `${baseURL}product/${id}`;

    const response = await fetch(url);

    return convertToJson(response);

  }
}