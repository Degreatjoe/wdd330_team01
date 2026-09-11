
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.datasource = dataSource;
    this.listelement = listElement;
  }

  async init() {
    const list = await this.datasource.getData();
    this.renderList(list);
    }
}