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
import {TextInputField} from "SpectaclesUIKit.lspkg/Scripts/Components/TextInputField/TextInputField";
@component
export class ARFixMateInspectionUI extends BaseScriptComponent {
  @input @allowUndefined @hint("Existing welcome root") welcomeRoot:SceneObject;
  @input @allowUndefined @hint("Existing inspection panel root") tutorialRoot:SceneObject;
  @input @hint("Panel width in cm") panelWidth:number=46;
  @input @hint("Application name") brand:string="AR FixMate";
  @input @widget(new ColorWidget()) @hint("Accent color") accent:vec4=new vec4(24/255,183/255,233/255,1);
  readonly onAction=new Event<string>();
  private buttons:{[key:string]:{button:Button,label:Text}}={};
  private heading:Text; private progress:Text; private detail:Text; private footer:Text;
  private field:TextInputField; private fieldRoot:SceneObject; private choices:SceneObject;
  private rows:Text[]=[];
  onAwake(){
    if(!this.welcomeRoot||!this.tutorialRoot)return;
    const w=this.panel(this.welcomeRoot,46,true);
    this.text(w,"INSPECTION ASSISTANT  /  DEMO","caption",2,this.accent);
    this.text(w,this.brand,"title",5);
    this.text(w,"Inspect. Investigate. Recheck.","heading",4);
    this.text(w,"Supported: bolt / washer / nut assembly.\nReuse this sample to explore the workflow.","body",5);
    this.text(w,"SIMULATED FINDINGS ONLY\nNo camera analysis or device recognition.","body",5,new vec4(1,0.7,0.3,1));
    this.text(w,"Visible concerns only. Hidden faults need testing.\nThis assistant cannot certify equipment safety.","caption",4);
    this.button(this.row(w,7),"start","Start Inspection",32);
    this.text(w,"Pinch a control to continue.","caption",2);
    const t=this.panel(this.tutorialRoot,58);
    this.progress=this.text(t,"DEMO  /  1 SCAN","caption",2,this.accent);
    this.heading=this.text(t,"Scan","heading",3);
    this.detail=this.text(t,"","caption",3,new vec4(1,0.72,0.3,1));
    for(let i=0;i<4;i++)this.rows.push(this.text(t,"","body",3.5));
    this.fieldRoot=this.obj(t,"InspectionTextInput");this.register(t,this.fieldRoot,this.panelWidth-3,5);
    this.field=this.fieldRoot.createComponent(TextInputField.getTypeName()) as TextInputField;
    this.field.size=new vec3(this.panelWidth-3,5,1);this.field.actionSlot="none";this.field.fontSize=43;
    this.choices=this.row(t,6.5);
    this.button(this.choices,"choice0","1 Bolt",13);this.button(this.choices,"choice1","2 Washer",13);this.button(this.choices,"choice2","3 Nut",13);
    const action=this.row(t,6.5);this.button(action,"primary","Continue",25);this.button(action,"secondary","Other",15);
    const nav=this.row(t,6.5);this.button(nav,"back","Back",12);this.button(nav,"home","Home",12);this.button(nav,"recenter","Recenter",15);
    this.footer=this.text(t,"DEMO - no actual detections","caption",2,this.accent);
  }
  showWelcome(visible:boolean){this.welcomeRoot.enabled=visible;this.tutorialRoot.enabled=!visible;}
  showPage(stage:number,title:string,detail:string,lines:string[],primary:string,secondary:string,fieldMode:string="",choices:string[]=[],canPrimary=true){
    this.showWelcome(false);this.progress.text=`DEMO / ${stage+1} OF 6  |  ${["SCAN","SYMPTOMS","INSPECT","INVESTIGATE","CHECKLIST","RECHECK"][stage]}`;
    this.heading.text=title;this.detail.text=detail;this.rows.forEach((t,i)=>t.text=lines[i]||"");
    this.fieldRoot.enabled=!!fieldMode;this.field.placeholderText=fieldMode;
    this.choices.enabled=choices.length>0;
    choices.forEach((label,i)=>{this.buttons["choice"+i].label.text=label;});
    this.buttons.primary.label.text=primary;this.buttons.secondary.label.text=secondary||"?";
    this.buttons.primary.button.inactive=!canPrimary;this.buttons.secondary.button.inactive=!secondary;
    this.footer.text="SIMULATED / panel markers only / no safety verdict";
    print(`FixMate page ${stage+1}: ${title} | ${detail}`);
  }
  getInput():string{return this.field.text.trim().slice(0,160);}
  setInput(value:string){this.field.text=value;}
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







