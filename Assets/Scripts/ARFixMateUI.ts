import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate";
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import {FlexDirection,FlexAlign,FlexJustify,FlexAlignSelf} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import {RoundedRectangle} from "SpectaclesUIKit.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangle";
import {RoundedRectangleVisual, RoundedRectangleVisualParameters} from "SpectaclesUIKit.lspkg/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisual";
type Role="title"|"heading"|"body"|"caption";
const TYPE={title:{size:93,weight:700},heading:{size:62,weight:700},body:{size:43,weight:500},caption:{size:38,weight:500}};
function applyTextRole(t:Text,r:Role) { t.size=TYPE[r].size*120/110; (t as Text & {weight?:number}).weight=TYPE[r].weight; }
@component
export class ARFixMateUI extends BaseScriptComponent {
  @input @allowUndefined @hint("Existing welcome panel") welcomeRoot:SceneObject;
  @input @allowUndefined @hint("Existing tutorial panel") tutorialRoot:SceneObject;
  @input @hint("Panel width in centimeters") panelWidth:number=46;
  @input @hint("Title") brand:string="AR FixMate";
  @input @widget(new ColorWidget()) @hint("Accent") accent:vec4=new vec4(0.094,0.718,0.914,1);
  readonly onAction=new Event<string>();
  previewParent:SceneObject;
  private buttons:{[key:string]:{button:Button,label:Text}}={};
  private heading:Text;private instruction:Text;private progress:Text;private hint:Text;
  private cueRoot:SceneObject;private cue:Text;private directionRoot:SceneObject;private direction:Text;
  private complete:SceneObject;private normal:SceneObject[]=[];
  onAwake(){
    if(!this.welcomeRoot||!this.tutorialRoot)return;
    const w=this.panel(this.welcomeRoot,46,true);
    this.text(w,"SPATIAL ASSEMBLY GUIDE","caption",2,this.accent);
    this.text(w,this.brand,"title",5);
    this.text(w,"See the fix. Follow the steps.\nKeep your hands free.","heading",6);
    this.text(w,"Learn how to assemble a bolt, washer,\nand nut through interactive AR guidance.","body",5);
    const slot=this.obj(w,"AssemblyPreviewSlot");this.previewParent=slot;this.register(w,slot,this.panelWidth-3,9);
    this.text(w,"Pinch to select.\nFollow the highlighted parts.","caption",4);
    this.button(this.row(w,7),"start","Start Assembly",30);
    const t=this.panel(this.tutorialRoot,36);
    this.progress=this.text(t,"STEP 1 OF 5","caption",2,this.accent);
    this.heading=this.text(t,"Identify the Bolt","heading",3.5);
    this.instruction=this.text(t,"Select the highlighted bolt.","body",5);
    this.hint=this.text(t,"Pinch the highlighted part to continue.","caption",3);
    const act=this.row(t,6.5);this.normal.push(act);this.button(act,"select","Select Part",23);this.button(act,"recenter","Recenter",16);
    const nav=this.row(t,6.5);this.normal.push(nav);this.button(nav,"back","Back",9);this.button(nav,"next","Next",9);this.button(nav,"replay","Replay",10);this.button(nav,"home","Home",10);
    this.complete=this.row(t,6.5);this.button(this.complete,"restart","Replay Tutorial",23);this.button(this.complete,"return","Return Home",17);
    this.cueRoot=this.obj(this.sceneObject.getParent(),"AssemblyDirectionCue");this.makeCueLayout(this.cueRoot,10,6);this.cue=this.text(this.cueRoot,"","heading",6,this.accent);
  }
  showWelcome(visible:boolean){this.welcomeRoot.enabled=visible;this.tutorialRoot.enabled=!visible;}
  setStep(step:number,title:string,instruction:string,phase:string,played:boolean,pct=0){
    if(!this.heading)return;this.showWelcome(false);this.heading.text=title;this.instruction.text=instruction;
    this.progress.text=`STEP ${step+1} OF 5  /  ${phase==="Step Complete"?"COMPLETE":phase==="Animating"?Math.round(pct*100)+"%":"READY"}`;
    this.hint.text=phase==="Animating"?"Demonstrating assembly...":phase==="Step Complete"?"Great! Step complete.":"Pinch the highlighted part to continue.";
    this.complete.enabled=false;this.normal.forEach(o=>o.enabled=true);
    this.enable("select",phase!=="Animating");this.enable("back",step>0&&phase!=="Animating");this.enable("next",phase==="Step Complete");this.enable("replay",played&&phase!=="Animating");this.buttons.next.label.text=step===4?"Finish":"Next";
  }
  showFinished(){this.heading.text="Assembly complete!";this.instruction.text="You assembled a bolt, washer, and nut.";this.progress.text="5 OF 5 STEPS COMPLETE";this.hint.text="Explore the assembly or start again.";this.normal.forEach(o=>o.enabled=false);this.complete.enabled=true;}
  private makeCueLayout(root:SceneObject,width:number,height:number){const f=root.createComponent(FlexLayout.getTypeName()) as FlexLayout;f.autoDiscoverItemsOnStart=false;f.onInitialized.add(()=>{f.width=width;f.height=height;f.direction=FlexDirection.Column;f.alignItems=FlexAlign.Stretch;f.justifyContent=FlexJustify.Center;});}
  initDirectionHint(camera:SceneObject){this.directionRoot=this.obj(camera,"WorkspaceDirectionHint");this.directionRoot.getTransform().setLocalPosition(new vec3(0,-12,-80));this.makeCueLayout(this.directionRoot,38,4);this.direction=this.text(this.directionRoot,"","caption",4,this.accent);this.directionRoot.enabled=false;}
  setOutOfView(message:string){if(this.directionRoot){this.directionRoot.enabled=!!message;this.direction.text=message;}}
  setCue(visible:boolean,step:number,position:vec3,time:number){if(!this.cueRoot)return;this.cueRoot.enabled=visible;if(!visible)return;const drift=Math.sin(time*3)*0.8;this.cueRoot.getTransform().setLocalPosition(position.add(new vec3(6+drift,step===0?7:4,3)));this.cue.text=["→","↓","←","↻","↕"][step];}
  private enable(k:string,v:boolean){this.buttons[k].button.inactive=!v;this.buttons[k].label.textFill.color=v?new vec4(1,1,1,1):new vec4(0.55,0.65,0.72,1);}
  private obj(p:SceneObject,n:string,z=0):SceneObject { const o=global.scene.createSceneObject(n);o.setParent(p);o.getTransform().setLocalPosition(new vec3(0,0,z));return o; }
  private panel(root:SceneObject,height:number,welcome=false):SceneObject {
    root.createComponent("Component.Canvas"); const plate=root.createComponent(BackPlate.getTypeName()) as BackPlate; plate.size=new vec2(this.panelWidth,height);
    plate.style="simple";
    plate.onInitialized.add(()=>{const surface=root.getComponent(RoundedRectangle.getTypeName()) as RoundedRectangle;surface.backgroundColor=new vec4(0.035,0.10,0.16,0.94);surface.border=true;surface.borderSize=0.07;surface.borderColor=this.accent;surface.cornerRadius=0.8;});
    const content=this.obj(root,"Content",0.6); const flex=content.createComponent(FlexLayout.getTypeName()) as FlexLayout;flex.autoDiscoverItemsOnStart=false;
    flex.onInitialized.add(()=>{flex.width=this.panelWidth;flex.height=height;flex.direction=FlexDirection.Column;flex.alignItems=FlexAlign.Stretch;flex.justifyContent=FlexJustify.Center;flex.rowGap=welcome?0.7:0.5;flex.paddingLeft=1.5;flex.paddingRight=1.5;});
    return content;
  }
  private register(p:SceneObject,o:SceneObject,w:number,h:number) { const item=o.createComponent(FlexItem.getTypeName()) as FlexItem;item.overrideWidth=w;item.overrideHeight=h;item.flexShrink=0;item.alignSelf=FlexAlignSelf.Stretch;const f=p.getComponent(FlexLayout.getTypeName()) as FlexLayout;if(f)f.addItems([item]); }
  private text(p:SceneObject,s:string,role:Role,h:number,color:vec4=new vec4(1,1,1,1)):Text {
    const o=this.obj(p,"Label");const t=o.createComponent("Component.Text");t.text=s;t.depthTest=true;applyTextRole(t,role);t.textFill.color=color;t.horizontalAlignment=HorizontalAlignment.Center;t.verticalAlignment=VerticalAlignment.Center;t.horizontalOverflow=HorizontalOverflow.Overflow;t.verticalOverflow=VerticalOverflow.Overflow;t.layoutRect=Rect.create(-21,21,-h/2,h/2);this.register(p,o,this.panelWidth-3,h);return t;
  }
  private row(parent:SceneObject,height:number):SceneObject {const o=this.obj(parent,"Controls",0.08);this.register(parent,o,this.panelWidth-3,height);const f=o.createComponent(FlexLayout.getTypeName()) as FlexLayout;f.autoDiscoverItemsOnStart=false;f.onInitialized.add(()=>{f.width=this.panelWidth-3;f.height=height;f.direction=FlexDirection.Row;f.justifyContent=FlexJustify.Center;f.alignItems=FlexAlign.Center;f.columnGap=1;});return o;}
  private button(parent:SceneObject,key:string,label:string,width:number) {
    const height=6;
    const o=this.obj(parent,"Button_"+key,0.1);this.register(parent,o,width,height);
    const button=o.createComponent(Button.getTypeName()) as Button;button.setTheme("SnapOS2","PrimaryNeutral");button.size=new vec3(width,height,1);button.onTriggerUp.add(()=>{print(`AR FixMate UI selected: ${key}`);this.onAction.invoke(key);});
    {button.visual=new RoundedRectangleVisual({sceneObject:o,style:{default:{baseType:"Color",baseColor:key==="start"?this.accent:new vec4(0.02,0.18,0.23,0.5),hasBorder:true,borderColor:this.accent,borderSize:0.06},hovered:{baseType:"Color",baseColor:key==="start"?new vec4(0.3,0.86,1,1):new vec4(0.06,0.5,0.6,0.8),hasBorder:true,borderColor:this.accent,borderSize:0.1},triggered:{baseType:"Color",baseColor:key==="start"?new vec4(0.04,0.48,0.68,1):new vec4(0.1,0.7,0.8,1)},inactive:{baseType:"Color",baseColor:new vec4(0.02,0.09,0.12,0.25)}} as Partial<RoundedRectangleVisualParameters>});}
    const so=this.obj(o,"ButtonLabel",0.6);const t=so.createComponent("Component.Text");t.text=label;t.depthTest=true;applyTextRole(t,"body");if(key==="start"){applyTextRole(t,"heading");t.textFill.color=new vec4(18/255,36/255,58/255,1);}t.horizontalAlignment=HorizontalAlignment.Center;t.verticalAlignment=VerticalAlignment.Center;t.horizontalOverflow=HorizontalOverflow.Overflow;t.layoutRect=Rect.create(-(width-0.5)/2,(width-0.5)/2,-height/2,height/2);this.buttons[key]={button,label:t};
  }
}








