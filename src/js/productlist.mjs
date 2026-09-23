import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?products=${product.Id}">
        <img
          src="${product.PrimaryMedium}"
          srcset="
            ${product.PrimarySmall} 400w,
            ${product.PrimaryMedium} 800w,
            ${product.PrimaryLarge} 1200w
          "
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
          alt="${product.Name}"
        >

        <h2>${product.Brand?.Name ?? ""}</h2>

        <h3>${product.Name}</h3>

        <p class="product-card__price">
          $${Number(product.FinalPrice).toFixed(2)}
        </p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.list = [];
  }

  async init() {
    if (this.category === "all") {
      this.list = await this.dataSource.getAllData();
    } else {
      this.list = await this.dataSource.getData(
        this.category
      );
    }

    this.renderList(true);
  }

  renderList(clear = false) {
    this.sortList();

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      this.list,
      "afterbegin",
      clear
    );
  }

  sortList() {
    const sortBy = document.getElementById("sort");

    if (!sortBy) {
      return;
    }

    switch (sortBy.value) {
      case "price-asc":
        this.list.sort(
          (a, b) => a.FinalPrice - b.FinalPrice
        );
        break;

      case "price-desc":
        this.list.sort(
          (a, b) => b.FinalPrice - a.FinalPrice
        );
        break;

      case "name-asc":
        this.list.sort(
          (a, b) => a.Name.localeCompare(b.Name)
        );
        break;

      case "name-desc":
        this.list.sort(
          (a, b) => b.Name.localeCompare(a.Name)
        );
        break;
    }
  }
}