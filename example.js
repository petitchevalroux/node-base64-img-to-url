"use strict"
const Base64Img = require("."),
    base64Img = new Base64Img({
        upload: () => {
            this.counter = (this.counter || 0) + 1;
            return Promise.resolve("https://example.com/img/" +
                this.counter);
        }
    });
    base64Img.replaceWithUrl("<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==\">")
    .then(html=>{
        console.log(html);
    });
    
    const uploader = {
        /**
         * Handle upload
         * @param {buffer} buffer image buffer
         * @param {string} mimeType image mime type
         * @returns {Promise<string>} image url
         */
        upload: (buffer,mimeType) => {
            
        }
    };
