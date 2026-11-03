/* Original Unity prefab data, rendered with native WebGL. No screenshot cutouts. */
(function () {
  'use strict';
  var data=window.CapyModelData, surface=document.createElement('canvas');
  var gl=surface.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});
  var ID=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],UNITY_TO_WEB=[1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1];
  function mul(a,b){var r=new Float32Array(16);for(var c=0;c<4;c++)for(var row=0;row<4;row++)for(var k=0;k<4;k++)r[c*4+row]+=a[k*4+row]*b[c*4+k];return r;}
  function trs(p,q,s){var x=q[0],y=q[1],z=q[2],w=q[3],xx=x*x,yy=y*y,zz=z*z;return [(1-2*(yy+zz))*s[0],2*(x*y+z*w)*s[0],2*(x*z-y*w)*s[0],0,2*(x*y-z*w)*s[1],(1-2*(xx+zz))*s[1],2*(y*z+x*w)*s[1],0,2*(x*z+y*w)*s[2],2*(y*z-x*w)*s[2],(1-2*(xx+yy))*s[2],0,p[0],p[1],p[2],1];}
  function yaw(a){return [0,Math.sin(a/2),0,Math.cos(a/2)];}
  function rx(a){return [Math.sin(a/2),0,0,Math.cos(a/2)];}
  function rz(a){return [0,0,Math.sin(a/2),Math.cos(a/2)];}
  function normalize(v){var l=Math.hypot.apply(null,v)||1;return v.map(function(x){return x/l;});}
  function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
  function dot(a,b){return a.reduce(function(s,v,i){return s+v*b[i];},0);}
  var boundsCache={};
  function bounds(name){
    if(boundsCache[name])return boundsCache[name];var nodes=data.models[name],byId={},world={},lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
    nodes.forEach(function(n){byId[n.id]=n;});
    function matrix(n){return world[n.id]||(world[n.id]=mul(byId[n.parent]?matrix(byId[n.parent]):ID,trs(n.p,n.q,n.s)));}
    nodes.forEach(function(n){if(!n.mesh)return;var m=matrix(n),e=n.mesh==='10206'||n.mesh==='10208'?[.5,1,.5]:n.mesh==='Octahedron'?[.6,1,.6]:[.5,.5,.5];
      for(var i=0;i<8;i++){var p=e.map(function(v,k){return v*((i>>k&1)?1:-1);});for(var k=0;k<3;k++){var v=m[k]*p[0]+m[4+k]*p[1]+m[8+k]*p[2]+m[12+k];lo[k]=Math.min(lo[k],v);hi[k]=Math.max(hi[k],v);}}});
    return boundsCache[name]={center:lo.map(function(v,i){return (v+hi[i])/2;}),radius:Math.hypot(hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2])/2};
  }
  function environmentKey(mode,state){if(mode==='portrait')return null;if(mode==='roster')return {slime:'garden',skeleton:'barracks',archer:'barracks',wizard:'library',bat:'cave',golem:'throne',capy:'camp'}[state.model]||'camp';return {home:'menu',vision:'lab',flock:'cave',boss:'throne'}[mode]||'menu';}
  function colliders(key){return data.environments[key].colliders.map(function(b){return {name:b.name,min:[b.min[0],b.min[1],-b.max[2]],max:[b.max[0],b.max[1],-b.min[2]]};});}
  function camera(W,H,mode,model,env,t,homeFrame){
    var close=mode==='roster'||mode==='portrait',range=close?6.4:(mode==='boss'?18:17);
    var ratio=W/H;if(ratio<1.15)range*=Math.max(.66,ratio);
    var eye=close?[0,2.8,6]:[0,9,12],target=close?[0,1.1,0]:[0,.5,0];
    if(close){model=model||'capy';var box=bounds(model),scale=model==='golem'?.68:1,offset=model==='bat'?1.4:0;target=[0,box.center[1]*scale+offset,0];eye=[0,target[1]+1.7,6];range=box.radius*scale*2.3*Math.max(1,ratio);}
    if(env){if(env==='menu'){target=[0,1.1,-3];eye=[Math.sin((t||0)*.035)*2.2,8.8,14];range=Math.max(25,15*ratio);if(ratio<1.1)range=17;}else{var size=data.environments[env].size;target=[0,.8,0];eye=[0,16,11];range=Math.max(size[0]+4,(size[1]*.82+4)*ratio);if(ratio<1.1)range=size[0]*.9;}}
    var z=normalize(eye.map(function(v,i){return v-target[i];})),x=normalize(cross([0,1,0],z)),y=cross(z,x);
    var view=[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1];
    var h=range/ratio,near=.1,far=70,ortho=[2/range,0,0,0,0,2/h,0,0,0,0,-2/(far-near),0,0,0,-(far+near)/(far-near),1],vp=mul(ortho,view);
    // Only the full-screen home canvas uses the editorial safe area.
    // Keep the case hero, portraits and playable scenes on their original camera.
    if(homeFrame){
      var phone=W<760,title=document.getElementById('title'),pills=document.getElementById('pills');
      var left=phone?24:W*240/1536,right=phone?W-24:W*1120/1536;
      var top=phone&&title?title.getBoundingClientRect().bottom+12:H*96/720;
      var bottom=phone&&pills?pills.getBoundingClientRect().top-14:H*432/720;
      var anchors=phone?[[-16,0,-16],[-16,0,16],[16,0,-16],[16,0,16],[8,6,-10]]:[[-5,0,-6],[-5,3,-6],[8,5,-10],[8,0,-11],[0,0,2.8]],xs=[],ys=[];
      anchors.forEach(function(p){var q=project(p);xs.push(q[0]);ys.push(q[1]);});
      var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);
      var scale=Math.min((right-left)/(x1-x0),Math.max(1,bottom-top)/(y1-y0));
      var dx=(left+right)/2-scale*(x0+x1)/2,dy=(top+bottom)/2-scale*(y0+y1)/2;
      for(var k=0;k<16;k+=4){vp[k]=vp[k]*scale+(scale+2*dx/W-1)*vp[k+3];vp[k+1]=vp[k+1]*scale+(1-scale-2*dy/H)*vp[k+3];}
    }
    function project(p){return [(vp[0]*p[0]+vp[4]*p[1]+vp[8]*p[2]+vp[12]+1)*W/2,(1-vp[1]*p[0]-vp[5]*p[1]-vp[9]*p[2]-vp[13])*H/2];}
    var zero=project([0,0,0]),px=project([1,0,0]),pz=project([0,0,1]);
    return {matrix:vp,project:project,pick:function(x,y){var a=px[0]-zero[0],b=pz[0]-zero[0],c=px[1]-zero[1],d=pz[1]-zero[1],det=a*d-b*c;return {x:((x-zero[0])*d-b*(y-zero[1]))/det,z:(a*(y-zero[1])-(x-zero[0])*c)/det};}};
  }
  if(!gl){window.Capy3D={available:false,draw:function(c,W,H,t,mode,state){c.fillStyle='#102522';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.font='16px sans-serif';c.fillText('Enable WebGL to explore the 3D scenes.',24,H/2);var view=camera(W,H,'home');if(state)state.view=view;return view;},portrait:function(){return 'capy/ui/CapyFace.png';},colliders:colliders,revision:function(){return 0;}};return;}
  function shader(type,source){var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  var program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 model;uniform mat4 vp;uniform mat3 normals;varying vec3 N;varying vec3 P;varying vec2 UV;void main(){vec4 p=model*vec4(position,1.);P=p.xyz;N=normalize(normals*normal);UV=uv;gl_Position=vp*p;}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 N;varying vec3 P;varying vec2 UV;uniform vec4 color;uniform float smooth;uniform float emissive;uniform float textured;uniform vec2 tiling;uniform float time;uniform float water;uniform float flame;uniform vec4 lamps[8];uniform vec4 lampColors[8];uniform sampler2D tex;void main(){vec3 n=normalize(N),l=normalize(vec3(-.5,1.,.8)),v=normalize(vec3(0.,7.,12.)-P);float diffuse=max(dot(n,l),0.);float spec=pow(max(dot(n,normalize(l+v)),0.),8.+smooth*75.)*smooth*.36;vec4 sampleColor=vec4(1.);if(textured>.5)sampleColor=texture2D(tex,UV*tiling);vec3 base=color.rgb*sampleColor.rgb;vec3 light=vec3(.22,.24,.32)+vec3(.48,.48,.55)*diffuse;for(int i=0;i<8;i++){vec3 delta=lamps[i].xyz-P;float d=length(delta),r=max(lamps[i].w,.01);float a=max(0.,1.-d/r);light+=lampColors[i].rgb*lampColors[i].w*a*a*(.18+.5*max(dot(n,normalize(delta)),0.));}vec3 lit=base*light+vec3(spec);if(water>.5)lit+=vec3(.02,.1,.12)*(.5+.5*sin(P.x*9.+P.z*8.+time*2.));vec3 glow=base*(1.-flame*.06+flame*.06*sin(time*8.));gl_FragColor=vec4(mix(lit,glow,emissive),color.a*sampleColor.a);}'));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  var attrs={},u={};['position','normal','uv'].forEach(function(k){attrs[k]=gl.getAttribLocation(program,k);});['model','vp','normals','color','smooth','emissive','textured','tex','tiling','time','water','flame','lamps[0]','lampColors[0]'].forEach(function(k){u[k]=gl.getUniformLocation(program,k);});
  var geometries={},textureVersion=0;
  function geometry(kind){
    if(geometries[kind])return geometries[kind];var vertices=[];
    function v(p,n,uv){vertices.push.apply(vertices,p.concat(n,uv||[0,0]));}
    function tri(a,b,c){v(a.p,a.n,a.uv);v(b.p,b.n,b.uv);v(c.p,c.n,c.uv);}
    function sphere(capsule){var rows=18,cols=28;
      function point(i,j){var a=i/rows*Math.PI,b=j/cols*Math.PI*2,n=[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)],p=n.map(function(x){return x*.5;});if(capsule)p[1]+=Math.sign(n[1])*.5;return {p:p,n:n,uv:[j/cols,i/rows]};}
      for(var i=0;i<rows;i++)for(var j=0;j<cols;j++){var a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);tri(a,b,d);tri(b,c,d);}
    }
    if(kind==='10207'||kind==='10208')sphere(kind==='10208');
    else if(kind==='10206'){var cols=32;for(var j=0;j<cols;j++){var a=j/cols*Math.PI*2,b=(j+1)/cols*Math.PI*2,ca=Math.cos(a)*.5,sa=Math.sin(a)*.5,cb=Math.cos(b)*.5,sb=Math.sin(b)*.5;
      var A={p:[ca,-1,sa],n:[ca*2,0,sa*2],uv:[j/cols,0]},B={p:[ca,1,sa],n:A.n,uv:[j/cols,1]},C={p:[cb,1,sb],n:[cb*2,0,sb*2],uv:[(j+1)/cols,1]},D={p:[cb,-1,sb],n:C.n,uv:[(j+1)/cols,0]};tri(A,B,C);tri(A,C,D);
      [1,-1].forEach(function(y){v([0,y,0],[0,y,0],[.5,.5]);v([ca,y,sa],[0,y,0],[ca+.5,sa+.5]);v([cb,y,sb],[0,y,0],[cb+.5,sb+.5]);});}}
    else if(kind==='10210'){[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,-.5],[.5,.5],[-.5,.5]].forEach(function(p){v([p[0],p[1],0],[0,0,-1],[p[0]+.5,p[1]+.5]);});}
    else if(kind==='Octahedron'){var top=[0,1,0],bottom=[0,-1,0],ring=[[.6,0,0],[0,0,.6],[-.6,0,0],[0,0,-.6]];for(var i=0;i<4;i++){[top,bottom].forEach(function(p){var a=ring[i],b=ring[(i+1)%4],n=normalize(cross(a.map(function(v,k){return v-p[k];}),b.map(function(v,k){return v-p[k];})));[p,a,b].forEach(function(p){v(p,n);});});}}
    else {var faces=[[[1,0,0],[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]],[[-1,0,0],[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]],[[0,1,0],[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]],[[0,-1,0],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]],[[0,0,1],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[-.5,-.5,.5]],[[0,0,-1],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5],[.5,-.5,-.5]]];faces.forEach(function(f){[1,2,3,1,3,4].forEach(function(i){v(f[i],f[0],[[0,0],[0,1],[1,1],[1,0]][i-1]);});});}
    var buffer=gl.createBuffer(),array=new Float32Array(vertices);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,array,gl.STATIC_DRAW);return geometries[kind]={buffer:buffer,count:vertices.length/8,vertices:array};
  }
  var groundTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,groundTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([100,140,110,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  var textureReady=false,floor=new Image();floor.onload=function(){gl.bindTexture(gl.TEXTURE_2D,groundTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,floor);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.generateMipmap(gl.TEXTURE_2D);textureReady=true;textureVersion++;};floor.src='capy/textures/Floor_Garden.png';
  function normalMatrix(m){var a=[m[0],m[1],m[2]],b=[m[4],m[5],m[6]],c=[m[8],m[9],m[10]],bc=cross(b,c),ca=cross(c,a),ab=cross(a,b),d=dot(a,bc)||1;return bc.concat(ca,ab).map(function(v){return v/d;});}
  var textures={};
  function texture(name){if(!textures[name]){var entry={texture:gl.createTexture(),ready:false},image=new Image();textures[name]=entry;image.onload=function(){gl.bindTexture(gl.TEXTURE_2D,entry.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.generateMipmap(gl.TEXTURE_2D);entry.ready=true;textureVersion++;};image.src='capy/textures/'+name;}return textures[name];}
  function mesh(kind,m,mat,textured){var g=typeof kind==='object'?kind:geometry(kind);gl.bindBuffer(gl.ARRAY_BUFFER,g.buffer);[['position',3,0],['normal',3,12],['uv',2,24]].forEach(function(a){gl.enableVertexAttribArray(attrs[a[0]]);gl.vertexAttribPointer(attrs[a[0]],a[1],gl.FLOAT,false,32,a[2]);});
    var tex=mat.texture?texture(mat.texture):null;gl.bindTexture(gl.TEXTURE_2D,tex&&tex.ready?tex.texture:groundTexture);
    gl.uniformMatrix4fv(u.model,false,m);gl.uniformMatrix3fv(u.normals,false,normalMatrix(m));gl.uniform4fv(u.color,mat.color);gl.uniform1f(u.smooth,mat.smooth||0);gl.uniform1f(u.emissive,mat.glow?1:0);gl.uniform1f(u.textured,tex?tex.ready?1:0:textured&&textureReady?1:0);gl.uniform2fv(u.tiling,mat.tiling||[12,12]);gl.uniform1f(u.water,mat===data.materials.Water||mat===data.materials.CaveWater?1:0);gl.uniform1f(u.flame,mat===data.materials.Flame||mat===data.materials.FlameRed?1:0);gl.drawArrays(gl.TRIANGLES,0,g.count);}
  function actor(name,x,y,z,angle,scale,t,state){var nodes=data.models[name];if(!nodes)return;var world={},base=state&&state.matrix?state.matrix:trs([x,y,z],yaw(angle||0),[scale||1,scale||1,scale||1]);
    var kind=state&&state.kind||name;
    var byId={};nodes.forEach(function(n){byId[n.id]=n;});
    function matrix(n){if(world[n.id])return world[n.id];var p=n.p.slice(),q=n.q,s=n.s.slice(),extra=null;
      if(n.name==='Body'){p[1]+=(kind==='capy'?.04:.025)*Math.sin(t*3);if(kind==='slime'){var hop=Math.max(0,Math.sin(t*3));p[1]+=hop*.38;s[1]*=1+hop*.15;s[0]*=1-hop*.08;s[2]*=1-hop*.08;}}
      if(kind==='capy'){if(n.name==='FootL'||n.name==='FootR'){var sign=n.name==='FootL'?1:-1;p[1]+=Math.max(0,Math.sin(t*8)*sign)*.1;p[2]+=Math.cos(t*8)*sign*.1;}if(n.name==='SwordPivot')extra=rx(Math.sin(t*3)*.12);if(n.name==='ScarfTail')extra=rz(Math.sin(t*5)*.1);}
      if(kind==='bat'&&(n.name==='WingL'||n.name==='WingR'))extra=rz(Math.sin(t*12)*.65*(n.name==='WingL'?1:-1));
      if(kind==='golem'&&state&&state.phase===2){if(n.name==='ArmL'||n.name==='ArmR')extra=rx(Math.sin(t*3)*.25);}
      var local=trs(p,q,s);if(extra)local=mul(local,trs([0,0,0],extra,[1,1,1]));return world[n.id]=mul(byId[n.parent]?matrix(byId[n.parent]):base,local);}
    nodes.forEach(function(n){if(!n.mesh)return;var mat=data.materials[n.mat]||data.materials.Capy;if(kind==='golem'&&state&&state.phase===2&&/Crystal/.test(n.mat))mat=data.materials.CrystalRed;mesh(n.mesh,matrix(n),mat);});
  }
  var environmentCache={};
  function environment(key){var source=data.environments[key];if(!source)return null;if(!environmentCache[key]){var groups={};
    source.meshes.forEach(function(item){var g=geometry(item.mesh),m=mul(UNITY_TO_WEB,item.matrix),nm=normalMatrix(m),array=g.vertices,group=groups[item.mat]||(groups[item.mat]=[]);
      for(var i=0;i<array.length;i+=8){var x=array[i],y=array[i+1],z=array[i+2],nx=array[i+3],ny=array[i+4],nz=array[i+5],n=normalize([nm[0]*nx+nm[3]*ny+nm[6]*nz,nm[1]*nx+nm[4]*ny+nm[7]*nz,nm[2]*nx+nm[5]*ny+nm[8]*nz]);group.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14],n[0],n[1],n[2],array[i+6],array[i+7]);}});
    var batches=Object.keys(groups).map(function(mat){var values=new Float32Array(groups[mat]),buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);return {mat:data.materials[mat],geometry:{buffer:buffer,count:values.length/8}};});
    batches.sort(function(a,b){return (a.mat.color[3]<1?1:0)-(b.mat.color[3]<1?1:0);});
    environmentCache[key]={source:source,batches:batches,colliders:source.colliders.map(function(b){return {name:b.name,min:[b.min[0],b.min[1],-b.max[2]],max:[b.max[0],b.max[1],-b.min[2]]};})};}
    return environmentCache[key];
  }
  function lighting(env,t){var positions=new Float32Array(32),colors=new Float32Array(32),lights=env?env.source.lights.slice().sort(function(a,b){return Math.hypot(a.p[0],a.p[2])-Math.hypot(b.p[0],b.p[2]);}).slice(0,8):[];
    lights.forEach(function(l,i){positions.set([l.p[0],l.p[1],-l.p[2],l.range],i*4);colors.set(l.color.concat(l.intensity*(.96+.04*Math.sin(t*7+i))),i*4);});
    gl.uniform4fv(u['lamps[0]'],positions);gl.uniform4fv(u['lampColors[0]'],colors);gl.uniform1f(u.time,t);return lights;
  }
  var shadow={color:[.015,.025,.025,.3],smooth:0},portraits={};
  function draw(c,W,H,t,mode,state){state=state||{};var d=Math.min(window.devicePixelRatio||1,2),width=Math.round(W*d),height=Math.round(H*d);if(surface.width!==width||surface.height!==height){surface.width=width;surface.height=height;}
    gl.viewport(0,0,width,height);gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.025,.047,.06,mode==='portrait'?0:1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    var homeFrame=false;   // the home keeps the original camera; the page title moves instead
    var key=environmentKey(mode,state),env=key?environment(key):null,view=camera(W,H,mode,state.model,key,t,homeFrame);gl.uniformMatrix4fv(u.vp,false,view.matrix);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(u.tex,0);var lights=lighting(env,t);
    if(env)env.batches.forEach(function(b){gl.depthMask(b.mat.color[3]>=1);mesh(b.geometry,ID,b.mat);});gl.depthMask(true);
    function show(name,x,z,angle,size,y,phase){if(mode!=='portrait'){gl.depthMask(false);mesh('10207',trs([x,.005,z],yaw(0),[size*1.2,.018,size*.8]),shadow);gl.depthMask(true);}actor(name,x,y||0,z,angle,size,t,phase||state);}
    if(mode==='roster'||mode==='portrait'){var name=state.model||'capy';show(name,0,0,state.yaw===undefined?Math.sin(t*.35)*.35:state.yaw,name==='golem'?.68:1, name==='bat'?1.4:0);}
    else if(mode==='vision'){show('capy',state.x===undefined?-6:state.x,state.z===undefined?1:state.z,state.yaw||0,1);show('skeleton',state.enemyX||0,state.enemyZ===undefined?-2:state.enemyZ,state.enemyYaw||0,1);}
    else if(mode==='flock'){show('capy',0,0,Math.sin(t*.2)*.2,1);(state.bats||[]).forEach(function(b,i){show('bat',b.x,b.z,Math.atan2(-b.x,-b.z),.65,1.8+Math.sin(t*3+i)*.18);});}
    else if(mode==='boss'){show('capy',-3,state.charge>0?8:2,.3,1);var charge=state.charge||0;show('golem',0,-3.5+charge,Math.PI*.08,.9);if(state.phase===2)for(var i=0;i<5;i++){var rockY=6-((t*2+i*1.2)%6);mesh('10207',trs([Math.sin(i*4.3)*4,rockY,Math.cos(i*3.1)*3],yaw(t),[.4,.4,.4]),{color:[.4,.4,.45,1],smooth:.1});}}
    else if(env)env.source.actors.forEach(function(a,i){var m=mul(UNITY_TO_WEB,a.matrix);if(a.kind==='bat')m[13]+=Math.sin(t*2)*.22;if(a.kind==='capy')m[13]+=Math.sin(t*1.2)*.05;actor(a.model,0,0,0,0,1,t+i*.7,{matrix:m,kind:a.kind});});
    c.clearRect(0,0,W,H);c.drawImage(surface,0,0,W,H);
    if(env&&!homeFrame){c.save();c.globalCompositeOperation='screen';lights.forEach(function(l,i){if(l.p[1]>4)return;var p=view.project([l.p[0],l.p[1],-l.p[2]]),radius=Math.min(W,H)*.055*(.96+.04*Math.sin(t*7+i)),g=c.createRadialGradient(p[0],p[1],0,p[0],p[1],radius),rgb=l.color.map(function(v){return Math.min(255,Math.round(v*255));}).join(',');g.addColorStop(0,'rgba('+rgb+',.22)');g.addColorStop(1,'rgba('+rgb+',0)');c.fillStyle=g;c.fillRect(p[0]-radius,p[1]-radius,radius*2,radius*2);});c.restore();}
    if(homeFrame&&W>=760){c.save();var falloff=c.createLinearGradient(W*.70,0,W*.79,0);falloff.addColorStop(0,'rgba(6,12,15,0)');falloff.addColorStop(1,'rgba(6,12,15,1)');c.fillStyle=falloff;c.fillRect(W*.70,0,W*.30,H);c.restore();}
    state.view=view;state.environment=key;return view;
  }
  function portrait(name){if(!portraits[name]){var cv=document.createElement('canvas');cv.width=cv.height=512;draw(cv.getContext('2d'),512,512,0,'portrait',{model:name,yaw:.12});portraits[name]=cv.toDataURL('image/png');}return portraits[name];}
  window.Capy3D={available:true,draw:draw,portrait:portrait,environment:environment,colliders:colliders,revision:function(){return textureVersion;}};
})();

