import { renderListWithTemplate } from "./utils.mjs";


function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?products=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    
    this.renderList(list);
    
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
    this.sortList(list);
    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);

  }
  sortList(list){
    const sortby = document.getElementById("sort");
    switch (sortby.value) {
      case "price-asc":
        list.sort((a, b) => a.FinalPrice - b.FinalPrice);
        break;

      case "price-desc":
        list.sort((a, b) => b.FinalPrice - a.FinalPrice);
        break;

      case "name-asc":
        list.sort((a, b) => a.Name.localeCompare(b.Name));
        break;

      case "name-desc":
        list.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      }
  }

}