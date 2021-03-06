"use strict";
const cheerio = require("cheerio"),
    Promise = require("bluebird");
class Base64Img {
    constructor(options) {
        if (options.uploader) {
            this.uploader = options.uploader;
            if (options.htmlParserOptions) {
                this.htmlParserOptions = options.htmlParserOptions;
            }
        } else {
            this.uploader = options;
        }
        this.htmlParserOptions = this.htmlParserOptions ? this.htmlParserOptions :
            {
                decodeEntities: false
            };
    }
    replace(html) {
        const self = this;
        try {
            const $ = cheerio.load(html, self.htmlParserOptions),
                promises = [],
                hasBody = html.indexOf("<body>") > -1;
            $("img[src^='data:']")
                .each((index, img) => {
                    const $img = $(img);
                    const match = $img.attr("src")
                        .match(/data:([^;]+);base64,(.*)/);
                    if (match) {
                        promises.push(
                            self
                                .uploader
                                .upload(new Buffer(match[2], "base64"),
                                    match[1])
                                .then(url => {
                                // Replace image source with url
                                    $img.attr("src", url);
                                    return url;
                                })
                        );
                    }
                });
            return Promise
                .all(promises)
                .then(() => {

                    return !hasBody ? $("body")
                        .html() : $.html();
                });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = Base64Img;
