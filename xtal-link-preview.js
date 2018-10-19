import { CorsAnywhere } from 'ava-pwar/cors-anywhere.js';
import { define } from 'xtal-latx/define.js';
export function qsa(css, from) {
    return [].slice.call((from ? from : this).querySelectorAll(css));
}
const preview = 'preview';
const image_width = 'image-width';
/**
* `xtal-link-preview`
* Provide preview of URL.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class XtalLinkPreview extends CorsAnywhere {
    constructor() {
        super();
        this._serviceUrl = 'https://cors-anywhere.herokuapp.com/';
        this._preview = false;
        this._imageWidth = 150;
        this.style.display = "block";
    }
    static get is() { return 'xtal-link-preview'; }
    /**
    * @type {string} Must be true to preview the url specified by href
    *
    */
    get preview() {
        return this._preview;
    }
    set preview(val) {
        this.attr(preview, val, '');
    }
    get imageWidth() {
        return this._imageWidth;
    }
    set imageWidth(val) {
        this.attr(image_width, val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([preview, image_width]);
    }
    connectedCallback() {
        this._upgradeProperties([preview, 'imageWidth']);
        super.connectedCallback();
    }
    calculateURL() {
        return this._serviceUrl + this._href;
    }
    onPropsChange() {
        if (!this._connected || !this._preview || this.disabled || !this._href || !this._serviceUrl)
            return;
        this.doFetch();
    }
    getMetaContent(htmlDoc, name, val) {
        let metas = qsa('meta[' + name + '="' + val + '"]', htmlDoc);
        let meta = metas.filter(item => item.content);
        if (meta && meta.length > 0)
            return meta[0].content;
        return null;
    }
    getAbsPath(imageSrc) {
        let newSrc = imageSrc;
        if (!imageSrc.startsWith('http') && !imageSrc.startsWith('data')) {
            if (imageSrc.startsWith('/')) {
                newSrc = this._href.split('/').slice(0, 3).join('/') + imageSrc;
            }
            else {
                const mid = this._href.endsWith('/') ? '' : '/';
                if (newSrc.startsWith('/'))
                    newSrc.replace('/', '');
                newSrc = this._href + mid + imageSrc;
            }
        }
        return newSrc;
    }
    processResponse(response) {
        response.text().then(respText => {
            this.fetchInProgress = false;
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(respText, "text/html");
            let imageSrc = this.getMetaContent(htmlDoc, 'name', "twitter:image:src");
            if (!imageSrc)
                imageSrc = this.getMetaContent(htmlDoc, 'name', "twitter:image");
            if (!imageSrc)
                imageSrc = this.getMetaContent(htmlDoc, 'property', 'og:image');
            if (!imageSrc) {
                const img = htmlDoc.querySelector('img');
                if (img) {
                    imageSrc = img.getAttribute('src');
                    imageSrc = this.getAbsPath(imageSrc);
                    console.log(imageSrc);
                }
            }
            if (!imageSrc) {
                const iconLink = htmlDoc.querySelector('link[rel="icon"]');
                if (iconLink) {
                    imageSrc = iconLink.getAttribute('href');
                    imageSrc = this.getAbsPath(imageSrc);
                }
            }
            //console.log(imageSrc);
            let titleEl = htmlDoc.querySelector('title');
            if (titleEl)
                this.title = titleEl.innerHTML;
            let description = this.getMetaContent(htmlDoc, 'name', 'description');
            if (!description) {
                description = '';
            }
            else {
                this.title = this.title.replace(description, '');
            }
            this.innerHTML = /* html */ `
                <div>
                    <details open>
                        <summary>${this.title}</summary>
                        <p>${description}</p>
                    </details>
                    <img alt="${this.title}" width="${this._imageWidth}" src="${imageSrc}"/>
                </div>
            `;
            this.fetchComplete = true;
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'preview':
                this._preview = newValue !== null;
                if (!this._preview) {
                    this.abort = true;
                }
                break;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
}
define(XtalLinkPreview);
//# sourceMappingURL=xtal-link-preview.js.map