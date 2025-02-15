import {XE} from 'xtal-element/src/XE.js';
import {TemplMgmtActions, tm, TemplMgmtProps} from 'trans-render/lib/mixins/TemplMgmtWithPEST.js';
import {LinkPreviewProps, LinkPreviewActions} from './types';
import { PropInfo } from 'trans-render/lib/types';
import ('open-borders/open-borders.js');
import {OpenBordersProps} from 'open-borders/types';
import ('./xtal-link-preview-fetch.js');
import('pass-down/p-d.js');

const mainTemplate = tm.html`
    <style>
        .innerLink[data-link-everything="true"]{
            display: none;
        }
        .domain[data-link-everything="false"]{
            display: none;
        }
    </style>
    <main part=main></main>
    <p-d observe-host vft="__href" to=[-href] m=1></p-d>
    <a -href part="outerLink" target=_blank></a>
    
    <open-borders be-born -target>
        <template>
            <div>
                <p-d observe-host vft=__href to=[-href] m=1></p-d>
                <p-d observe-host vft=__baseLinkId to=[-base-link-id] m=1></p-d>
                <xtal-link-preview-fetch fetch -href -base-link-id></xtal-link-preview-fetch>
                <p-d on=view-model-changed to=[-src] vft=viewModel.imageSrc m=1></p-d>                
                <img part="image" -src/>
                <details open part=details>
                    <p-d observe=xtal-link-preview-fetch on=view-model-changed to=[-text-content] vft=viewModel.title m=1></p-d>
                    <summary part=summary -text-content></summary>
                    <p-d observe=xtal-link-preview-fetch on=view-model-changed to=[-text-content] vft=viewModel.description m=1></p-d>
                    <p part=p -text-content></p>
                </details>
                <div part=linkContainer>
                    <svg viewBox="0 0 24 24" style="width:16.25px;height:16.25px">
                        <g>
                            <path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                            <path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                        </g>
                    </svg>
                    <p-d observe-host vft="__href" to=[-href] m=1></p-d>
                    <p-d observe-host vft="__linkEverything" to=[-data-link-everything] as=str-attr m=2></p-d>
                    <p-d observe=xtal-link-preview-fetch on=view-model-changed to=[-text-content] vft=viewModel.domainName m=2></p-d>
                    <a -href class=innerLink part=innerLink -data-link-everything target=_blank -text-content></a>
                    <span class=domain part=domain -data-link-everything -text-content></span>
                </div>            
            </div>
        </template>

    </open-borders>
`;

const setOpenBordersTarget = ({linkEverything}: LinkPreviewProps) => ({
    target: linkEverything ? '../a' : '../main',
} as Partial<OpenBordersProps>);

export class XtalLinkPreviewBaseCore extends HTMLElement{
    setOpenBordersTarget = setOpenBordersTarget;
}

const isRef: PropInfo = {
    isRef: true,
}

const xe = new XE<LinkPreviewProps & TemplMgmtProps, LinkPreviewActions & TemplMgmtActions>({
    config:{
        tagName: 'xtal-link-preview-base',
        propDefaults:{
            baseLinkId: '',
            href: '',
            linkEverything: false,
        },
        propInfo: {
            openBordersElements: isRef,
            href:{
                notify:{
                    reflect:{
                        asAttr: true
                    },
                    echoTo: '__href'
                }
            },
            baseLinkId:{
                notify:{
                    reflect:{
                        asAttr: true,
                    },
                    echoTo: '__baseLinkId',
                }
            },
            linkEverything:{
                notify:{
                    echoTo: '__linkEverything'
                }
            },
            __href:{
                notify:{dispatch: true}
            },
            __baseLinkId:{
                notify:{dispatch: true}
            },
            __linkEverything:{
                notify:{dispatch: true}
            }
        },
        actions:{
            ...tm.doInitTransform,
            setOpenBordersTarget:{
                ifKeyIn:['linkEverything'],
                target: 'openBordersElements'
            }
        }
    },
    complexPropDefaults:{
        mainTemplate: mainTemplate,
    },
    superclass: XtalLinkPreviewBaseCore,
    mixins: [tm.TemplMgmtMixin]
});

/**
 * @tag xtal-link-preview-base
 * @element xtal-link-preview-base
 */
export const XtalLinkPreviewBase = xe.classDef!;

declare global {
    interface HTMLElementTagNameMap {
        "xtal-link-preview-base": XtalLinkPreviewBaseCore,
    }
}