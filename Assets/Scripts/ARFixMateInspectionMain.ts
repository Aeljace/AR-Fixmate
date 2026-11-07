import {ARFixMateInspectionUI} from "./ARFixMateInspectionUI";
import {ARFixMatePart} from "./ARFixMatePart";
type Finding={component:number;title:string;kind:string;evidence:string;check:string;confirmed:boolean;angleRequested:boolean;repaired:boolean;review:string};
/** Offline workflow only. Every finding is authored sample data, never a camera detection. */
@component
export class ARFixMateInspectionMain extends BaseScriptComponent {
  @input @allowUndefined @hint("Existing UIKit UI") ui:ARFixMateInspectionUI;
  @input @allowUndefined @hint("Existing workspace") workspace:SceneObject;
  @input @allowUndefined @hint("Tracked camera") cameraObject:SceneObject;
  @input @allowUndefined @hint("Existing sample bolt") bolt:SceneObject;
  @input @allowUndefined @hint("Existing sample washer") washer:SceneObject;
  @input @allowUndefined @hint("Existing sample nut") nut:SceneObject;
  @input @hint("Legacy assembly duration retained") duration:number=1.6;
  private stage=-1;private scanLoaded=false;private modelConfirmed=false;private selected=0;
  private symptom="";private model="";private checklist=0;private recheckStarted=false;
  private findings:Finding[]=[];
  private steps=["Review manufacturer procedure and isolate device.","Gather light, magnifier and suitable hand tools.","Identify approved matching replacement, if needed.","Follow manufacturer repair and verification procedure."];
  onAwake(){this.createEvent("OnStartEvent").bind(()=>this.start());}
  private start(){if(!this.ui||!this.workspace||!this.bolt||!this.washer||!this.nut){print("FixMate: required existing scene input missing");return;}this.ui.onAction.add(k=>this.action(k));this.recenter();this.samplePose();this.ui.showWelcome(true);print("FixMate inspection ready: DEMO ONLY; no vision provider configured");}
  private reset(){this.stage=0;this.scanLoaded=false;this.modelConfirmed=false;this.selected=0;this.symptom="";this.model="";this.checklist=0;this.recheckStarted=false;this.findings=[
    {component:0,title:"Bolt surface discoloration",kind:"Observed damage (demo)",evidence:"Scenario: brown patch / pitting (not on sample mesh).",check:"Inspect under better light; distinguish dirt from pitting.",confirmed:false,angleRequested:false,repaired:false,review:"Not rechecked"},
    {component:1,title:"Washer may be absent",kind:"Suspected issue (demo)",evidence:"Scenario: washer edge obscured (not on sample mesh).",check:"View joint from the side; compare with approved diagram.",confirmed:false,angleRequested:false,repaired:false,review:"Not rechecked"},
    {component:2,title:"Joint holding force unknown",kind:"Needs testing (demo)",evidence:"A still image cannot establish preload or tightness.",check:"Use the manufacturer's specified mechanical test.",confirmed:false,angleRequested:false,repaired:false,review:"Not rechecked"}];this.ui.setInput("");this.render();}
  private samplePose(){[this.bolt,this.washer,this.nut].forEach((p,i)=>{p.getTransform().setLocalScale(new vec3(0.55,0.55,0.55));p.getTransform().setLocalPosition(new vec3([-11,0,11][i],-20,1));const c=p.getComponent(ARFixMatePart.getTypeName()) as ARFixMatePart;if(c)c.setHighlight(this.stage>=2&&i===this.selected);});}
  private recenter(){if(!this.cameraObject||!this.workspace)return;const t=this.cameraObject.getTransform(),p=t.getWorldPosition(),f=t.getWorldRotation().multiplyVec3(new vec3(0,0,-1)),yaw=Math.atan2(-f.x,-f.z);this.workspace.getTransform().setWorldPosition(p.add(new vec3(-Math.sin(yaw)*120,-9,-Math.cos(yaw)*120)));this.workspace.getTransform().setWorldRotation(quat.fromEulerAngles(0,yaw,0));}
  public action(k:string){
    if(k==="recenter"){this.recenter();return;}
    if(k==="home"){this.stage=-1;this.ui.showWelcome(true);return;}
    if(k==="start"){this.reset();return;}
    if(this.stage<0)return;
    if(k==="back"){if(this.stage===0){this.stage=-1;this.ui.showWelcome(true);return;}this.stage--;this.ui.setInput(this.stage===0?this.model:this.stage===1?this.symptom:"");this.render();return;}
    if(k.indexOf("choice")===0){const n=Number(k.slice(-1));if(this.stage===1){this.ui.setInput(["Unusual noise","Loose joint","Other symptom"][n]);}else if(this.stage>=2){this.selected=n;this.checklist=0;this.recheckStarted=false;this.samplePose();}this.render();return;}
    const f=this.findings[this.selected];
    if(this.stage===0){if(k==="secondary"){this.scanLoaded=false;this.modelConfirmed=false;this.ui.setInput("");}if(k==="primary"){if(!this.scanLoaded){this.scanLoaded=true;this.ui.setInput("Demo fastener assembly");}else{const enteredModel=this.ui.getInput();if(enteredModel!==this.model){this.findings.forEach(x=>{x.confirmed=false;x.repaired=false;x.angleRequested=false;x.review="Not rechecked";});}this.model=enteredModel;this.modelConfirmed=this.model.toLowerCase()==="demo fastener assembly";if(this.modelConfirmed){this.stage=1;this.ui.setInput(this.symptom);}}}}
    else if(this.stage===1&&k==="primary"){const entered=this.ui.getInput();if(entered!==this.symptom){this.findings.forEach(x=>{x.confirmed=false;x.repaired=false;x.angleRequested=false;x.review="Not rechecked";});}this.symptom=entered;if(this.symptom.length)this.stage=2;}
    else if(this.stage===2){if(k==="primary")this.stage=3;if(k==="secondary")this.selected=(this.selected+1)%3;}
    else if(this.stage===3){if(k==="secondary"){f.angleRequested=true;}if(k==="primary"){if(f.confirmed){this.stage=4;this.checklist=0;}else if(f.angleRequested&&this.selected!==2){f.confirmed=true;} }}
    else if(this.stage===4){if(k==="secondary"){this.stage=3;}if(k==="primary"&&f.confirmed){if(this.checklist<4)this.checklist++;else{f.repaired=true;f.review="Repair logged; recheck pending";this.stage=5;this.recheckStarted=false;}}}
    else if(this.stage===5){if(k==="primary"){if(!this.recheckStarted){this.recheckStarted=true;}else{f.review="User reports no visible concern; testing still required";}}if(k==="secondary"){f.review="Concern remains / needs investigation";this.stage=2;this.recheckStarted=false;}}
    this.samplePose();this.render();
  }
  private render(){const u=this.ui,f=this.findings[this.selected],labels=["1 Bolt","2 Washer","3 Nut"];
    if(this.stage===0){u.showPage(0,"Scan the assembly",this.scanLoaded?"Sample loaded / identity requires confirmation":"Demo mode / camera capture is not connected",this.scanLoaded?["Sample components: bolt, washer and nut.","Exact equipment model is unknown.","Supported identity: Demo fastener assembly.","Other models require a connected inspection service."]:["Aim at an isolated fastener assembly.","This demo loads authored sample evidence.","No image is captured, sent or analyzed.","Load the sample to explore inspection."],this.scanLoaded?"Confirm model":"Load sample view","Change model",this.scanLoaded?"Confirm supported demo identity":"");}
    if(this.stage===1)u.showPage(1,"Describe symptoms","User report / separate from visual evidence",["Choose a symptom or type your own.","Example: unusual noise or loose joint.","Symptoms guide checks; they do not confirm faults.","Continue saves your entered symptom."],"Save & inspect","","What is wrong?",["Noise","Loose joint","Other"]);
    if(this.stage===2)u.showPage(2,"Findings panel",`${this.selected+1}/3 / ${f.kind}`,[f.title,f.evidence,`Symptom: ${this.symptom.slice(0,38)}`,f.repaired?"Repair logged / verification pending":"Select a component marker below."],"Investigate","Next finding","",labels);
    if(this.stage===3)u.showPage(3,f.title,f.kind,[f.check,f.angleRequested?"Alternate sample angle requested (simulated).":"View insufficient: request another camera angle.",f.confirmed?"User confirmed issue in demo workflow.":this.selected===2?"Image cannot confirm this; qualified test needed.":"Confirm only after the described check.","Checks refer to demo evidence, not real equipment."],f.confirmed?"Open checklist":this.selected===2?"Test required":f.angleRequested?"Confirm issue":"Check needed","Request angle","",labels,f.confirmed||(f.angleRequested&&this.selected!==2));
    if(this.stage===4)u.showPage(4,"Repair checklist",`Demo confirmed / ${Math.min(this.checklist,4)} of 4 checked`,[this.checklist<4?this.steps[this.checklist]:"Checklist reviewed. Log completed repair when done.","Tools: light, magnifier, suitable hand tools.","Parts: only verified manufacturer-approved matches.","No part numbers or torque values inferred."],this.checklist<4?"Mark step done":"Repair complete","Review check","",[],f.confirmed&&this.modelConfirmed);
    if(this.stage===5)u.showPage(5,"Recheck visible concerns",this.recheckStarted?"Demo reinspection / no automated clearance":"Repair logged / reinspection required",[this.recheckStarted?"Compare a new view using the same checks.":"Load another sample view to rehearse recheck.",f.review,`${this.findings.filter(x=>x.review!=="User reports no visible concern; testing still required").length} visible reviews open / testing still required.`,"Hidden faults and equipment safety need testing."],this.recheckStarted?"No visible concern":"Reinspect (demo)","Concern remains","",labels);
    print(`FixMate state: stage=${this.stage} finding=${this.selected} confirmed=${f.confirmed} repaired=${f.repaired} review=${f.review}`);
  }
}

