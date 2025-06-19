class Transaction {
  constructor(id = "", when = "", description = "", amount = "", category = "", category_name = "", account = "") {
    this.id = id;
    this.when = when;
    this.description = description;
    this.amount = amount;
    this.category = category;
    this.category_name = category_name;
    this.account = account;
  }
}

export default Transaction;
