import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";const cs=document.currentScript;let customStyle="";const href="href",service_url="service-url",preview="preview",fetch_in_progress="fetch-in-progress",fetch_complete="fetch-complete";export class XtalLinkPreview extends XtallatX(HTMLElement){constructor(){super();this._serviceUrl="https://cors-anywhere.herokuapp.com/http://playground.ajaxtown.com/link_preview/class.linkpreview.php?url=";this._preview=!1;this._connected=!1;const template=document.createElement("template");template.innerHTML=`
          <style>
            :host {
              display: block;
            }
            ${customStyle}
          </style>
          <div id="slot">
          <slot>
           
          </slot>
          </slot>
        `;this.attachShadow({mode:"open"});this.shadowRoot.appendChild(template.content.cloneNode(!0));this.style.display="block"}get serviceUrl(){return this._serviceUrl}set serviceUrl(val){this.attr("service-url",val)}get href(){return this._href}set href(val){this.attr("href",val)}get fetchInProgress(){return this._fetchInProgress}set fetchInProgress(val){this._fetchInProgress=val;this.attr(fetch_in_progress,val,"");this.de(fetch_in_progress,{value:val})}get fetchComplete(){return this._fetchComplete}set fetchComplete(val){this._fetchComplete=val;this.attr(fetch_complete,val,"");this.de(fetch_complete,{value:val})}get preview(){return this._preview}set preview(val){this.attr(preview,val,"")}static get observedAttributes(){return super.observedAttributes.concat([href,preview,service_url])}connectedCallback(){this._upgradeProperties(["disabled",preview,href,"serviceUrl"]);this._connected=!0;this.de("connected",{value:this.href});this.onPropsChange()}onPropsChange(){if(!this._connected||!this._preview||this.disabled||!this._href||!this._serviceUrl)return;this.fetchInProgress=!0;this.fetchComplete=!1;fetch(this._serviceUrl+this._href+"&image_no=1&css=true").then(response=>{response.text().then(respText=>{this.fetchInProgress=!1;let massagedText=respText;[["html","div"],["head","header"],["body","main"]].forEach(s=>{massagedText=massagedText.replace("<"+s[0]+">","<"+s[1]+" id=\"root\">").replace("</"+s[0]+">","</"+s[1]+">")});massagedText=massagedText.replace("<a href=\"","<a target=\"_blank\" href=\"");massagedText=massagedText.replace("<div id=\"toolbar\" class=\"clearfix\"><button id=\"changeimg\">></button></div>","");const div=document.createElement("div");div.innerHTML=massagedText;this.shadowRoot.appendChild(div);this.shadowRoot.querySelector("div#slot").innerHTML="";this.fetchComplete=!0})})}attributeChangedCallback(name,oldValue,newValue){super.attributeChangedCallback(name,oldValue,newValue);switch(name){case"href":this._href=newValue;break;case"preview":this._preview=null!==newValue;break;case"service-url":this._serviceUrl=newValue;break;}this.onPropsChange()}}if(cs&&cs.dataset.cssPath){fetch(cs.dataset.cssPath).then(resp=>{resp.text().then(css=>{customStyle=css;initXtalLinkPreview()})})}else{initXtalLinkPreview()}function initXtalLinkPreview(){customElements.define("xtal-link-preview",XtalLinkPreview)}