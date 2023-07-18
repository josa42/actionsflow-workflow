import https from "node:https";
import { URL } from "node:url";
import cheerio from "cheerio";

import { createHash } from "node:crypto";

const urlBase = "https://www.wurmberg.de";
const url = "https://www.wurmberg.de/rathaus/amtsblatt/";

interface Item {
  id: string;
  title: string;
  url: string;
}

module.exports = class Test {
  // constructor({ helpers, options }) {
  //   this.options = options;
  //   this.helpers = helpers;
  // }
  async run() {
    const $ = cheerio.load(await get(url));

    const items: Array<Item> = [];

    $(".uk-list.downloads li a").each((_i, item) => {
      const $item = $(item);
      const itemURL = new URL($item.attr("href") ?? "", urlBase).toString();

      items.push({
        id: hash(itemURL),
        title: $item.find("strong:first").text(),
        url: itemURL,
      });
    });

    // only the latest 3
    return items.reverse().slice(-3);
  }
};

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data: Array<Buffer> = [];

        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => resolve(Buffer.concat(data).toString()));
      })
      .on("error", (err) => reject(err));
  });
}

function hash(str: string): string {
  return createHash("sha256").update(str).digest("hex");
}
