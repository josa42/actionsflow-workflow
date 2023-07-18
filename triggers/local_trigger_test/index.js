module.exports = class Test {
  constructor({ helpers, options }) {
    this.options = options;
    this.helpers = helpers;
  }
  async run() {
    const items = [
      {
        id: "uniqueId",
        title: "Hello World!",
      },
    ];
    return items;
  }
};
