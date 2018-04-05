"use strict";
const path = require("path"),
    Base64Img = require(path.join(__dirname, "..")),
    Promise = require("bluebird"),
    assert = require("assert"),
    cheerio = require("cheerio");

describe("Base64Img", () => {
    const uploader = {
            upload: () => {
                this.counter = (this.counter || 0) + 1;
                return Promise.resolve("https://example.com/img/" +
                    this.counter);
            }
        },
        base64Img = new Base64Img(uploader);

    function getParsedContent(html) {
        return base64Img
            .replaceWithUrl(html)
            .then(html => {
                return cheerio.load(html);
            });
    }
    it("replace all base 64 images with urls provided by uploader", () => {
        return getParsedContent(
            "<h1>Title 1</h1><div><img src='data:image/png;base64,foo'></div>" +
                "<h1>Title 2</h1><div><img src='data:image/png;base64,foo2'></div>"
        )
            .then($ => {
                const imageSources = $("img")
                    .map((index, img) => {
                        return $(img)
                            .attr("src");
                    })
                    .get();
                assert.equal(imageSources[0],
                    "https://example.com/img/1");
                assert.equal(imageSources[1],
                    "https://example.com/img/2");
                return $;
            });
    });

    it("doesnt add body if body is not in original fragment", () => {
        return base64Img
            .replaceWithUrl("<h1>Title 1</h1>")
            .then(html => {
                assert.equal(html.indexOf("<body>"), -1);
                return html;
            });

    });

    it("leave body if body is in original fragment", () => {
        return base64Img
            .replaceWithUrl(
                "<html><body><h1>Title 1</h1></body></html>")
            .then(html => {
                assert(html.indexOf("<body>") > -1);
                return html;
            });
    });

});
