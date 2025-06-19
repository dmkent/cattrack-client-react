class Period {
  constructor(id = "", offset = "", label = "", from_date = "", to_date = "") {
    this.id = id;
    this.offset = offset;

    this.label = label;
    this.from_date = from_date;
    this.to_date = to_date;
  }
}

export default Period;
