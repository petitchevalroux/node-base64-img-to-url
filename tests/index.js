"use strict";
const path = require("path"),
    Base64Img = require(path.join(__dirname, "..")),
    Promise = require("bluebird"),
    assert = require("assert"),
    cheerio = require("cheerio"),
    sinon = require("sinon"),
    fileType = require("file-type");

describe("Base64Img", () => {
    const sandbox = sinon.sandbox.create();
    afterEach(() => {
        sandbox.restore();
    });
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
            .replace(html)
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
            .replace("<h1>Title 1</h1>")
            .then(html => {
                assert.equal(html.indexOf("<body>"), -1);
                return html;
            });

    });

    it("leave body if body is in original fragment", () => {
        return base64Img
            .replace(
                "<html><body><h1>Title 1</h1></body></html>")
            .then(html => {
                assert(html.indexOf("<body>") > -1);
                return html;
            });
    });

    it("call uploader.upload with the right arguments", () => {
        sandbox.spy(uploader, "upload");
        return base64Img
            .replace(
                "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==\">"
            )
            .then((html) => {
                assert.equal(fileType(uploader.upload.getCall(
                    0)
                    .args[0])
                    .mime, "image/png");
                assert.equal(uploader.upload.getCall(0)
                    .args[1], "image/png");
                return html;
            });
    });

});
