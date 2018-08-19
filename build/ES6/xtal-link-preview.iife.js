(function(){const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){const setOrRemove=val?"set":"remove";this[setOrRemove+"Attribute"](name,trueVal||val)}to$(number){const mod=number%2;return(number-mod)/2+"-"+mod}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}const href="href",fetch_in_progress="fetch-in-progress",fetch_complete="fetch-complete";class CorsAnywhere extends XtallatX(HTMLElement){constructor(){super(...arguments);this._serviceUrl="https://cors-anywhere.herokuapp.com/";this._connected=!1}get serviceUrl(){return this._serviceUrl}set serviceUrl(val){this.attr("service-url",val)}get href(){return this._href}set href(val){this.attr("href",val)}get fetchInProgress(){return this._fetchInProgress}set fetchInProgress(val){this._fetchInProgress=val;this.attr(fetch_in_progress,val,"");this.de(fetch_in_progress,{value:val})}get fetchComplete(){return this._fetchComplete}set fetchComplete(val){this._fetchComplete=val;this.attr(fetch_complete,val,"");this.de(fetch_complete,{value:val})}get title(){return this._title}set title(val){this._title=val;this.attr("title",val)}static get observedAttributes(){return super.observedAttributes.concat([href,"service-url"])}attributeChangedCallback(name,oldValue,newValue){super.attributeChangedCallback(name,oldValue,newValue);switch(name){case"href":this._href=newValue;break;case"service-url":this._serviceUrl=newValue;break;}this.onPropsChange()}connectedCallback(){this._upgradeProperties(["disabled",href,"serviceUrl"]);this._connected=!0;this.de("connected",{value:this.href});this.onPropsChange()}doFetch(){const url=this.calculateURL();if(this._previousURL===url)return;this._previousURL=url;this.title="Loading...";this.fetchInProgress=!0;this.fetchComplete=!1;fetch(url).then(response=>{this.fetchInProgress=!1;this.processResponse(response);this.fetchComplete=!0})}calculateURL(){return this._serviceUrl+this._href}}const preview="preview",image_width="image-width";class XtalLinkPreview extends CorsAnywhere{constructor(){super();this._serviceUrl="https://cors-anywhere.herokuapp.com/";this._preview=!1;this._imageWidth=150;this.style.display="block"}static get is(){return"xtal-link-preview"}get preview(){return this._preview}set preview(val){this.attr(preview,val,"")}get imageWidth(){return this._imageWidth}set imageWidth(val){this.attr(image_width,val.toString())}static get observedAttributes(){return super.observedAttributes.concat([preview,image_width])}connectedCallback(){this._upgradeProperties([preview,"imageWidth"]);super.connectedCallback()}calculateURL(){return this._serviceUrl+this._href}onPropsChange(){if(!this._connected||!this._preview||this.disabled||!this._href||!this._serviceUrl)return;this.doFetch()}getMetaContent(htmlDoc,name,val){let link=htmlDoc.querySelector("meta["+name+"=\""+val+"\"]");if(link)return link.content;return null}getAbsPath(imageSrc){let newSrc=imageSrc;if(!imageSrc.startsWith("http")&&!imageSrc.startsWith("data")){if(imageSrc.startsWith("/")){newSrc=this._href.split("/").slice(0,3).join("/")+imageSrc}else{const mid=this._href.endsWith("/")?"":"/";if(newSrc.startsWith("/"))newSrc.replace("/","");newSrc=this._href+mid+imageSrc}}return newSrc}processResponse(response){response.text().then(respText=>{this.fetchInProgress=!1;const parser=new DOMParser,htmlDoc=parser.parseFromString(respText,"text/html");let imageSrc=this.getMetaContent(htmlDoc,"name","twitter:image:src");if(!imageSrc)imageSrc=this.getMetaContent(htmlDoc,"name","twitter:image");if(!imageSrc)imageSrc=this.getMetaContent(htmlDoc,"property","og:image");if(!imageSrc){const img=htmlDoc.querySelector("img");if(img){imageSrc=img.getAttribute("src");imageSrc=this.getAbsPath(imageSrc);console.log(imageSrc)}}if(!imageSrc){const iconLink=htmlDoc.querySelector("link[rel=\"icon\"]");if(iconLink){imageSrc=iconLink.getAttribute("href");imageSrc=this.getAbsPath(imageSrc)}}let titleEl=htmlDoc.querySelector("title");if(titleEl)this.title=titleEl.innerText;this.innerHTML=`
                <div>
                    <header>${this.title}</header>
                    <img width="${this._imageWidth}" src="${imageSrc}"/>
                </div>
            `;this.fetchComplete=!0})}attributeChangedCallback(name,oldValue,newValue){switch(name){case"preview":this._preview=null!==newValue;break;}super.attributeChangedCallback(name,oldValue,newValue)}}(function(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)})(XtalLinkPreview)})();