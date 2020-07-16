import { XtalFetchViewElement, define } from 'xtal-element/XtalFetchViewElement.js';
import { createTemplate } from 'trans-render/createTemplate.js';
const innerTemplate = createTemplate(/* html */ `
    <img part=image/>
    <details open part=details>
        <summary part=summary></summary>
        <p part=p></p>
    </details>
    <div part=linkContainer>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 31.891 31.891" style="enable-background:new 0 0 31.891 31.891;" xml:space="preserve">
            <g>
                <path d="M30.543,5.74l-4.078-4.035c-1.805-1.777-4.736-1.789-6.545-0.02l-4.525,4.414c-1.812,1.768-1.82,4.648-0.02,6.424
                    l2.586-2.484c-0.262-0.791,0.061-1.697,0.701-2.324l2.879-2.807c0.912-0.885,2.375-0.881,3.275,0.01l2.449,2.42
                    c0.9,0.891,0.896,2.326-0.01,3.213l-2.879,2.809c-0.609,0.594-1.609,0.92-2.385,0.711l-2.533,2.486
                    c1.803,1.781,4.732,1.789,6.545,0.02l4.52-4.41C32.34,10.396,32.346,7.519,30.543,5.74z"/>
                <path d="M13.975,21.894c0.215,0.773-0.129,1.773-0.752,2.381l-2.689,2.627c-0.922,0.9-2.414,0.895-3.332-0.012l-2.498-2.461
                    c-0.916-0.906-0.91-2.379,0.012-3.275l2.691-2.627c0.656-0.637,1.598-0.961,2.42-0.689l2.594-2.57
                    c-1.836-1.811-4.824-1.82-6.668-0.02l-4.363,4.26c-1.846,1.803-1.855,4.734-0.02,6.549l4.154,4.107
                    c1.834,1.809,4.82,1.818,6.668,0.018l4.363-4.26c1.844-1.805,1.852-4.734,0.02-6.547L13.975,21.894z"/>
                <path d="M11.139,20.722c0.611,0.617,1.611,0.623,2.234,0.008l7.455-7.416c0.621-0.617,0.625-1.615,0.008-2.234
                    c-0.613-0.615-1.611-0.619-2.23-0.006l-7.457,7.414C10.529,19.103,10.525,20.101,11.139,20.722z"/>
        <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
        </svg>
    </div>
`);
const hyperlinkedTemplate = createTemplate(/* html */ `
    <a part=hyperlink target=_blank></a>
`);
const spanTemplate = createTemplate(/* html */ `
    <span part=hyperlink></span>
`);
const mainTemplate = createTemplate(/* html */ `
<main part=main></main>
`);
const [summarySym, pSym, imgSym, aSym] = [Symbol('summ'), Symbol('p'), Symbol('img'), Symbol('a')];
const innerTemplateTransform = ({ linkEverything }) => ({
    img: imgSym,
    details: {
        summary: summarySym,
        p: pSym
    },
    div: [!linkEverything, hyperlinkedTemplate],
    '"': {
        a: aSym
    }
});
const initTransform = ({ linkEverything, self }) => ({
    main: [linkEverything, hyperlinkedTemplate, innerTemplate],
    '"': {
        a: aSym,
        '"': innerTemplate,
        '""': innerTemplateTransform(self)
    },
    '""': innerTemplateTransform(self)
});
const updateTransforms = [
    ({ viewModel }) => ({
        [summarySym]: viewModel.title,
        [pSym]: viewModel.description
    }),
    ({ imageWidth, viewModel }) => ({
        [imgSym]: [{ alt: viewModel.title, style: { width: imageWidth }, src: viewModel.imageSrc }]
    }),
    ({ href, linkEverything }) => ({
        [aSym]: [, , { href: linkEverything ? href : null }]
    })
];
/**
* `xtal-link-preview`
* Provide preview of URL.
*
*
* @customElement
* @polymer
* @demo demo/index.html
*/
export class XtalLinkPreviewBase extends XtalFetchViewElement {
    constructor() {
        super();
        this.noShadow = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = initTransform;
        this.updateTransforms = updateTransforms;
        this.as = 'text';
        this.style.display = "block";
    }
    get readyToInit() {
        return this.preview && !this.disabled && this.href !== undefined && this.baseLinkId !== undefined && this.imageWidth !== undefined;
    }
    //imageSrc: string;
    filterInitData(data) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, "text/html");
        let imageSrc = this.getMetaContent(htmlDoc, 'name', "twitter:image:src");
        if (!imageSrc)
            imageSrc = this.getMetaContent(htmlDoc, 'name', "twitter:image");
        if (!imageSrc)
            imageSrc = this.getMetaContent(htmlDoc, 'property', 'og:image');
        if (!imageSrc) {
            const img = htmlDoc.querySelector('img');
            if (img) {
                imageSrc = img.getAttribute('src');
            }
        }
        if (!imageSrc) {
            const iconLink = htmlDoc.querySelector('link[rel="icon"]');
            if (iconLink) {
                imageSrc = iconLink.getAttribute('href');
            }
        }
        if (imageSrc)
            imageSrc = this.getAbsPath(imageSrc);
        let title;
        let titleEl = htmlDoc.querySelector('title');
        if (titleEl)
            title = titleEl.innerHTML;
        let description = this.getMetaContent(htmlDoc, 'name', 'description');
        if (!description) {
            description = '';
        }
        else {
            title = title.replace(description, '');
        }
        const viewModel = {
            description,
            imageSrc,
            title
        };
        return viewModel;
    }
    getMetaContent(htmlDoc, name, val) {
        let metas = Array.from(htmlDoc.querySelectorAll(`meta[${name} = "${val}"]`));
        let meta = metas.filter(item => item.content);
        if (meta && meta.length > 0)
            return meta[0].content;
        return null;
    }
    getAbsPath(imageSrc) {
        let newSrc = imageSrc;
        let href = this.href;
        const iPosOfHash = href.indexOf('#');
        if (iPosOfHash > -1)
            href = href.substr(0, iPosOfHash);
        if (!imageSrc.startsWith('http') && !imageSrc.startsWith('data')) {
            if (imageSrc.startsWith('/')) {
                newSrc = href.split('/').slice(0, 3).join('/') + imageSrc;
            }
            else {
                const mid = href.endsWith('/') ? '' : '/';
                if (newSrc.startsWith('/'))
                    newSrc.replace('/', '');
                newSrc = href + mid + imageSrc;
            }
        }
        return newSrc;
    }
}
XtalLinkPreviewBase.is = 'xtal-link-preview-base';
XtalLinkPreviewBase.attributeProps = ({ href, baseLinkId, disabled, preview, imageWidth, eventScopes, linkEverything }) => ({
    bool: [disabled, preview, linkEverything],
    str: [href, baseLinkId, imageWidth],
    obj: [eventScopes],
    jsonProp: [eventScopes],
    async: [href, baseLinkId]
});
XtalLinkPreviewBase.defaultValues = {
    imageWidth: '100%',
    linkEverything: false,
};
define(XtalLinkPreviewBase);
