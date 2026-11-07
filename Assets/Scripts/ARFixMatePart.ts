// Parametric assembly geometry. Centimeters; matching bores and thread pitch.
@component
export class ARFixMatePart extends BaseScriptComponent {
  @input @hint("0 bolt, 1 washer, 2 nut") kind: number = 0;
  @input @allowUndefined @hint("Metal material generated from SimplePBR preset") material: Material;
  private visual: RenderMeshVisual;
  private ownMaterial: Material;
  onAwake() { this.createEvent("OnStartEvent").bind(() => this.build()); }
  private build() {
    if (!this.material) return;
    const verts: number[] = [], indices: number[] = [];
    const vertex = (p: vec3, n: vec3) => { const id=verts.length/10; verts.push(p.x,p.y,p.z,n.x,n.y,n.z,1,1,1,1); return id; };
    const quad = (a:vec3,b:vec3,c:vec3,d:vec3,n:vec3) => {
      const base=vertex(a,n); vertex(b,n); vertex(c,n); vertex(d,n);
      const cross=b.sub(a).cross(c.sub(a));
      if(cross.dot(n)>=0) indices.push(base,base+1,base+2,base,base+2,base+3);
      else indices.push(base,base+2,base+1,base,base+3,base+2);
    };
    // Lathed closed ring with optional hexagonal outside and smooth bore.
    const ring=(outer:number,inner:number,y0:number,y1:number,hex:boolean=false) => {
      const segments=hex?96:96;
      const radius=(a:number) => hex ? outer*Math.cos(Math.PI/6)/Math.cos(((a+Math.PI/6)%(Math.PI/3)+Math.PI/3)%(Math.PI/3)-Math.PI/6) : outer;
      for(let i=0;i<segments;i++) {
        const a=i*2*Math.PI/segments,b=(i+1)*2*Math.PI/segments,ra=radius(a),rb=radius(b);
        const p=(r:number,y:number,t:number)=>new vec3(r*Math.cos(t),y,r*Math.sin(t));
        const mid=(a+b)/2,n=new vec3(Math.cos(mid),0,Math.sin(mid));
        quad(p(ra,y0,a),p(rb,y0,b),p(rb,y1,b),p(ra,y1,a),n);
        quad(p(inner,y0,a),p(inner,y1,a),p(inner,y1,b),p(inner,y0,b),n.uniformScale(-1));
        quad(p(ra,y1,a),p(rb,y1,b),p(inner,y1,b),p(inner,y1,a),new vec3(0,1,0));
        quad(p(ra,y0,a),p(inner,y0,a),p(inner,y0,b),p(rb,y0,b),new vec3(0,-1,0));
      }
    };
    if(this.kind===0) {
      ring(2.8,0,0,1.8,true); ring(1.35,0,1.8,13.8);
      // Continuous triangular helical ridge rather than stacked disks.
      const turns=12, count=turns*48;
      for(let i=0;i<count;i++) {
        const a=i*2*Math.PI/48,b=(i+1)*2*Math.PI/48;
        const y=2.3+i*0.88/48,z=2.3+(i+1)*0.88/48;
        const p=(r:number,h:number,t:number)=>new vec3(r*Math.cos(t),h,r*Math.sin(t));
        const n=new vec3(Math.cos((a+b)/2),0.4,Math.sin((a+b)/2)).normalize();
        quad(p(1.34,y-0.25,a),p(1.65,y,a),p(1.65,z,b),p(1.34,z-0.25,b),n);
        quad(p(1.65,y,a),p(1.34,y+0.25,a),p(1.34,z+0.25,b),p(1.65,z,b),new vec3(n.x,-0.4,n.z));
      }
    } else if(this.kind===1) ring(3.1,1.75,-0.3,0.3);
    else { ring(2.9,1.73,-1.25,1.25,true); }
    const builder=new MeshBuilder([{name:"position",components:3},{name:"normal",components:3},{name:"color",components:4}]);
    builder.topology=MeshTopology.Triangles; builder.indexType=MeshIndexType.UInt16;
    builder.appendVerticesInterleaved(verts); builder.appendIndices(indices);
    this.visual=this.sceneObject.createComponent("Component.RenderMeshVisual");
    this.visual.mesh=builder.getMesh(); this.ownMaterial=this.material.clone();
    // Keep the instructional hardware readable in dim preview environments.
    // Retain PBR shading while adding a modest visibility floor.
    this.ownMaterial.mainPass.metallic=0.15;
    this.ownMaterial.mainPass.roughness=0.48;
    this.visual.mainMaterial=this.ownMaterial; builder.updateMesh();
    this.setHighlight(false);
  }
  setHighlight(active:boolean) {
    if(!this.ownMaterial)return;
    this.ownMaterial.mainPass.baseColor=active?new vec4(1,0.56,0.12,1):new vec4(0.86,0.92,1,1);
    this.ownMaterial.mainPass.Port_Emissive_N006=active?new vec3(0.5,0.22,0.025):new vec3(0.28,0.34,0.43);
  }
}
