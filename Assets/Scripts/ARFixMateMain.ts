import {ARFixMateUI} from "./ARFixMateUI";
import {ARFixMatePart} from "./ARFixMatePart";
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
type Phase="Welcome"|"Ready"|"Animating"|"Step Complete"|"Finished";
/** Virtual trainer only. Pose functions are absolute, so cancellation and replay cannot accumulate drift. */
@component
export class ARFixMateMain extends BaseScriptComponent {
  @input @allowUndefined @hint("Existing UI") ui:ARFixMateUI;
  @input @allowUndefined @hint("World anchored workspace") workspace:SceneObject;
  @input @allowUndefined @hint("Tracked camera") cameraObject:SceneObject;
  @input @allowUndefined @hint("Bolt") bolt:SceneObject;
  @input @allowUndefined @hint("Washer") washer:SceneObject;
  @input @allowUndefined @hint("Nut") nut:SceneObject;
  @input @hint("Animation seconds") duration:number=1.6;
  private targets:SceneObject[]=[];private clock=0;
  private readonly tighteningTurns=11.85/0.88;
  private phase:Phase="Welcome";private step=0;private elapsed=0;private transition=-1;private played=[false,false,false,false,false];
  private titles=["Identify the Bolt","Place the Washer","Align the Nut","Tighten the Nut","Inspect the Finished Assembly"];
  private instructions=["The bolt holds the assembly together.\nSelect it to place it in the workspace.","Slide the washer down over the shaft.\nIt spreads the load at the joint.","Align the nut with the bolt's threads.\nKeep the nut centered on the shaft.","Turn the nut clockwise down the threads.\nThis is guidance, not a torque simulation.","Select the assembly for an exploded view.\nSee how the parts fit, then return them."];
  onAwake(){this.createEvent("OnStartEvent").bind(()=>this.start());this.createEvent("UpdateEvent").bind(()=>this.update());}
  private start(){if(!this.ui||!this.workspace||!this.bolt||!this.washer||!this.nut){print("FixMate ERROR: required scene inputs missing");return;}this.ui.onAction.add(k=>this.action(k));this.bindParts();this.ui.initDirectionHint(this.cameraObject);this.recenter();this.home();print("FixMate assembly ready: Welcome");}
  private bindParts(){this.parts().forEach((part,i)=>{const target=global.scene.createSceneObject("Select_"+["Bolt","Washer","Nut"][i]);this.targets.push(target);target.setParent(part);target.getTransform().setLocalPosition(new vec3(0,i===0?6.9:0,0));const collider=target.createComponent("Physics.ColliderComponent");const shape=Shape.createBoxShape();shape.size=new vec3(8,i===0?15:6,8);collider.shape=shape;const interactable=target.createComponent(Interactable.getTypeName()) as Interactable;interactable.onTriggerEnd.add(()=>{if(this.step===4||i===(this.step===0?0:this.step===1?1:2))this.action("select");});});}
  private parts(){return [this.bolt,this.washer,this.nut];}
  private home(){this.transition=-1;this.elapsed=0;this.phase="Welcome";this.played=[false,false,false,false,false];this.ui.welcomeRoot.getTransform().setLocalScale(new vec3(1,1,1));this.parts().forEach((p,i)=>{p.setParent(this.ui.previewParent);p.getTransform().setLocalScale(new vec3(0.55,0.55,0.55));p.getTransform().setLocalPosition(new vec3(0,-4+[0,2.1,3.65][i]*0.55,1.4));p.getTransform().setLocalRotation(quat.fromEulerAngles(0,0,0));});this.highlights();this.ui.setCue(false,0,new vec3(0,-25,2),0);this.ui.showWelcome(true);}
  private recenter(){if(!this.cameraObject)return;const t=this.cameraObject.getTransform(),p=t.getWorldPosition(),f=t.getWorldRotation().multiplyVec3(new vec3(0,0,-1)),yaw=Math.atan2(-f.x,-f.z);this.workspace.getTransform().setWorldPosition(p.add(new vec3(-Math.sin(yaw)*120,-9,-Math.cos(yaw)*120)));this.workspace.getTransform().setWorldRotation(quat.fromEulerAngles(0,yaw,0));}
  private initial(step:number):vec3[]{const bolt=new vec3(0,-25,2),washer=new vec3(0,-6,2),nut=new vec3(12,-6,2);if(step===0)return [new vec3(-12,-25,2),washer,nut];if(step>=2)washer.y=-22.9;if(step>=3){nut.x=0;nut.y=-9.5;}if(step>=4)nut.y=-21.35;return [bolt,washer,nut];}
  private pose(step:number){this.parts().forEach((p,i)=>{p.setParent(this.workspace);p.enabled=true;p.getTransform().setLocalScale(new vec3(1,1,1));p.getTransform().setLocalPosition(this.initial(step)[i]);p.getTransform().setLocalRotation(quat.fromEulerAngles(0,i===2&&step>=4?-this.tighteningTurns*Math.PI*2:0,0));});this.highlights();}
  private highlights(){this.targets.forEach((target,i)=>target.enabled=this.phase!=="Welcome"&&this.phase!=="Finished"&&this.phase!=="Animating"&&this.transition<0&&(this.step===4||i===(this.step===0?0:this.step===1?1:2)));this.parts().forEach((p,i)=>{const c=p.getComponent(ARFixMatePart.getTypeName()) as ARFixMatePart;if(c)c.setHighlight(this.phase!=="Welcome"&&this.phase!=="Finished"&&(this.step===4||i===(this.step===0?0:this.step===1?1:2)));});}
  private updateCues(){if(!this.ui||!this.workspace||!this.cameraObject)return;const active=this.step===0?0:this.step===1?1:2;this.ui.setCue(this.phase!=="Welcome"&&this.phase!=="Finished"&&this.transition<0,this.step,this.parts()[active].getTransform().getLocalPosition(),this.clock);const camera=this.cameraObject.getTransform(),delta=this.workspace.getTransform().getWorldPosition().sub(camera.getWorldPosition()),rotation=camera.getWorldRotation(),forward=rotation.multiplyVec3(new vec3(0,0,-1)),right=rotation.multiplyVec3(new vec3(1,0,0));const depth=delta.dot(forward),side=delta.dot(right);this.ui.setOutOfView(depth<0||Math.abs(side)>Math.max(1,depth)*0.65?(side>0?"Workspace →  |  Turn to return":"← Workspace  |  Turn to return"):"");}
  public action(k:string){
    if(k==="home"||k==="return"){this.home();return;}
    if(k==="recenter"){if(this.phase==="Animating"){this.phase="Ready";this.elapsed=0;this.pose(this.step);this.refresh();}this.recenter();return;}
    if(k==="start"||k==="restart"){if(this.transition>=0||!(this.phase==="Welcome"||this.phase==="Finished"))return;this.step=0;this.played=[false,false,false,false,false];this.phase="Ready";this.transition=0;this.elapsed=0;return;}
    if(this.transition>=0||this.phase==="Welcome"||this.phase==="Finished"||this.phase==="Animating")return;
    if(k==="back"&&this.step>0){this.step--;this.phase="Ready";this.pose(this.step);this.refresh();return;}
    if(k==="next"&&this.phase==="Step Complete"){if(this.step===4){this.phase="Finished";this.highlights();this.ui.showFinished();print("FixMate Finished");return;}this.step++;this.phase="Ready";this.pose(this.step);this.refresh();return;}
    if(k==="select"||(k==="replay"&&this.played[this.step])){this.pose(this.step);this.elapsed=0;this.phase="Animating";this.refresh();}
  }
  private refresh(pct=0){this.highlights();this.ui.setStep(this.step,this.titles[this.step],this.instructions[this.step],this.phase,this.played[this.step],pct);if(pct===0)print(`FixMate step=${this.step+1} phase=${this.phase}`);}
  private update(){this.clock+=getDeltaTime();this.updateCues();if(this.transition>=0){this.transition+=getDeltaTime();const scale=1-0.04*Math.min(1,this.transition/0.4);this.ui.welcomeRoot.getTransform().setLocalScale(new vec3(scale,scale,scale));if(this.transition>=0.4){this.transition=-1;this.ui.welcomeRoot.getTransform().setLocalScale(new vec3(1,1,1));this.pose(0);this.refresh();}return;}if(this.phase!=="Animating")return;this.elapsed+=getDeltaTime();const u=Math.min(1,this.elapsed/Math.max(0.2,this.duration)),s=u*u*(3-2*u);const from=this.initial(this.step),to=this.initial(Math.min(4,this.step+1));this.parts().forEach((p,i)=>{
      let position=vec3.lerp(from[i],to[i],s);
      if(this.step===4){const separation=Math.sin(u*Math.PI);position=from[i].add(new vec3(0,[0,8,12][i]*separation,0));}
      p.getTransform().setLocalPosition(position);
      const turns=i===2?(this.step===3?s*this.tighteningTurns:this.step===4?this.tighteningTurns:0):0;
      p.getTransform().setLocalRotation(quat.fromEulerAngles(0,-turns*Math.PI*2,0));
    });this.refresh(u);if(u>=1){this.phase="Step Complete";this.played[this.step]=true;this.refresh();}}
}



