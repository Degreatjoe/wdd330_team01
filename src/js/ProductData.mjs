function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}

const dataSource = new ProductData();

const productList = new productList(
  "tents",
  dataSource,
  listElement
);

function sortProducts(products, sortOption) {
  const sortedProducts = [...products];

  switch (sortOption) {
    case "name-asc":
      sortedProducts.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );
      break;

    case "name-desc":
      sortedProducts.sort((a, b) =>
        b.Name.localeCompare(a.Name)
      );
      break;

    case "price-asc":
      sortedProducts.sort(
        (a, b) => a.FinalPrice - b.FinalPrice
      );
      break;

    case "price-desc":
      sortedProducts.sort(
        (a, b) => b.FinalPrice - a.FinalPrice
      );
      break;
  }

  return sortedProducts;
}