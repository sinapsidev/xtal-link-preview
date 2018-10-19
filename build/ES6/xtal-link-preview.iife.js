(function(){const href="href",fetch_in_progress="fetch-in-progress",fetch_complete="fetch-complete";class CorsAnywhere extends XtallatX(HTMLElement){constructor(){super(...arguments);this._serviceUrl="https://cors-anywhere.herokuapp.com/";this._connected=!1}get serviceUrl(){return this._serviceUrl}set serviceUrl(val){this.attr("service-url",val)}get href(){return this._href}set href(val){this.attr("href",val)}get fetchInProgress(){return this._fetchInProgress}set fetchInProgress(val){this._fetchInProgress=val;this.attr(fetch_in_progress,val,"");this.de(fetch_in_progress,{value:val})}get fetchComplete(){return this._fetchComplete}set fetchComplete(val){this._fetchComplete=val;this.attr(fetch_complete,val,"");this.de(fetch_complete,{value:val})}get title(){return this._title}set title(val){this._title=val;this.attr("title",val)}static get observedAttributes(){return super.observedAttributes.concat([href,"service-url"])}attributeChangedCallback(name,oldValue,newValue){super.attributeChangedCallback(name,oldValue,newValue);switch(name){case"href":this._href=newValue;break;case"service-url":this._serviceUrl=newValue;break;}this.onPropsChange()}connectedCallback(){this._upgradeProperties(["disabled",href,"serviceUrl"]);this._connected=!0;this.de("connected",{value:this.href});this.onPropsChange()}set abort(val){console.log("in set abort");if(this._controller){console.log("abort");this._controller.abort()}}doFetch(){const url=this.calculateURL();if(this._previousURL===url){this.fetchComplete=!1;this.fetchComplete=!0;return}this._previousURL=url;this.title="Loading...";this.fetchInProgress=!0;this.fetchComplete=!1;let init=null;if(AbortController){this._controller=new AbortController;init=this._controller.signal}fetch(url,{signal:init}).then(response=>{this.fetchInProgress=!1;this.processResponse(response);this.fetchComplete=!0})}calculateURL(upLevels=0){let href=this._href;if(upLevels){const split=href.split("/");if(-1===upLevels){href=[split[0],split[1],split[2]].join("/")}}return this._serviceUrl+href}}function qsa(css,from){return[].slice.call((from?from:this).querySelectorAll(css))}const preview="preview",image_width="image-width";class XtalLinkPreview extends CorsAnywhere{constructor(){super();this._serviceUrl="https://cors-anywhere.herokuapp.com/";this._preview=!1;this._imageWidth=150;this.style.display="block"}static get is(){return"xtal-link-preview"}get preview(){return this._preview}set preview(val){this.attr(preview,val,"")}get imageWidth(){return this._imageWidth}set imageWidth(val){this.attr(image_width,val.toString())}static get observedAttributes(){return super.observedAttributes.concat([preview,image_width])}connectedCallback(){this._upgradeProperties([preview,"imageWidth"]);super.connectedCallback()}calculateURL(){return this._serviceUrl+this._href}onPropsChange(){if(!this._connected||!this._preview||this.disabled||!this._href||!this._serviceUrl)return;this.doFetch()}getMetaContent(htmlDoc,name,val){let metas=qsa("meta["+name+"=\""+val+"\"]",htmlDoc),meta=metas.filter(item=>item.content);if(meta&&0<meta.length)return meta[0].content;return null}getAbsPath(imageSrc){let newSrc=imageSrc;if(!imageSrc.startsWith("http")&&!imageSrc.startsWith("data")){if(imageSrc.startsWith("/")){newSrc=this._href.split("/").slice(0,3).join("/")+imageSrc}else{const mid=this._href.endsWith("/")?"":"/";if(newSrc.startsWith("/"))newSrc.replace("/","");newSrc=this._href+mid+imageSrc}}return newSrc}processResponse(response){response.text().then(respText=>{this.fetchInProgress=!1;const parser=new DOMParser,htmlDoc=parser.parseFromString(respText,"text/html");let imageSrc=this.getMetaContent(htmlDoc,"name","twitter:image:src");if(!imageSrc)imageSrc=this.getMetaContent(htmlDoc,"name","twitter:image");if(!imageSrc)imageSrc=this.getMetaContent(htmlDoc,"property","og:image");if(!imageSrc){const img=htmlDoc.querySelector("img");if(img){imageSrc=img.getAttribute("src");imageSrc=this.getAbsPath(imageSrc);console.log(imageSrc)}}if(!imageSrc){const iconLink=htmlDoc.querySelector("link[rel=\"icon\"]");if(iconLink){imageSrc=iconLink.getAttribute("href");imageSrc=this.getAbsPath(imageSrc)}}let titleEl=htmlDoc.querySelector("title");if(titleEl)this.title=titleEl.innerHTML;let description=this.getMetaContent(htmlDoc,"name","description");if(!description){description=""}else{this.title=this.title.replace(description,"")}this.innerHTML=`
                <div>
                    <details open>
                        <summary>${this.title}</summary>
                        <p>${description}</p>
                    </details>
                    <img alt="${this.title}" width="${this._imageWidth}" src="${imageSrc}"/>
                </div>
            `;this.fetchComplete=!0})}attributeChangedCallback(name,oldValue,newValue){switch(name){case"preview":this._preview=null!==newValue;if(!this._preview){this.abort=!0}break;}super.attributeChangedCallback(name,oldValue,newValue)}}(function(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)})(XtalLinkPreview)})();