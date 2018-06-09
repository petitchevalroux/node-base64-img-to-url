# base64-img-to-url

Convert base64 encoded image to url in html

In order to convert url to base64 images in html see [url-to-base64-img](https://github.com/petitchevalroux/node-url-to-base64-img)
## Install
```
npm install @petitchevalroux/base64-img-to-url
```

## Usage
### Example code
```
const Base64Img = require("@petitchevalroux/base64-img-to-url");
    base64Img = new Base64Img({
        upload: () => {
            this.counter = (this.counter || 0) + 1;
            return Promise.resolve("https://example.com/img/" +
                this.counter);
        }
    });
    base64Img.replace("<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==\">")
    .then(html=>{
        console.log(html);
    });
```

### Output

```
<img src="https://example.com/img/1">
```

## Uploader
### Uploader requirements
Uploader instance must have an upload member function.
This function must return a promised string containing the image url.
###  Uploader skeleton
```javascript
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
```
