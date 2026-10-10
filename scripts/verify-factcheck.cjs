const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),source=read('chapters/planning.html'),ctx={};
vm.runInNewContext(source.slice(source.indexOf('  function Heap()'),source.indexOf('  /* ================================================================ 1.')),ctx);
let seed=1;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};let maps=0,paths=0;
const a=source.indexOf('    const COLS = 36',source.indexOf('(function astar()')),b=source.indexOf('    function preset()',a),code=source.slice(a,b)+'\nthis.search=search;this.wall=wall;this.start=start;this.goal=goal;';
vm.runInNewContext(code,ctx);
// An independent O(V^2) shortest path implementation avoids the product heap/heuristic.
function reference(wall,start,goal){const N=720,dist=Array(N).fill(Infinity),visited=new Set(),s=start.r*36+start.c,t=goal.r*36+goal.c;dist[s]=0;while(visited.size<N){let u=-1;for(let k=0;k<N;k++)if(!visited.has(k)&&(u<0||dist[k]<dist[u]))u=k;if(!Number.isFinite(dist[u]))return Infinity;if(u===t)return dist[u];visited.add(u);const x=u%36,y=Math.floor(u/36);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||nx>=36||ny<0||ny>=20)continue;const v=ny*36+nx;if(wall[v]||(dx&&dy&&(wall[y*36+nx]||wall[ny*36+x])))continue;dist[v]=Math.min(dist[v],dist[u]+Math.hypot(dx,dy));}}return Infinity;}
for(let m=0;m<40;m++){for(let i=0;i<720;i++)ctx.wall[i]=random()<m%5*.08?1:0;ctx.wall[ctx.start.r*36+ctx.start.c]=ctx.wall[ctx.goal.r*36+ctx.goal.c]=0;const expected=reference(ctx.wall,ctx.start,ctx.goal);for(const w of [0,.5,1]){const result=ctx.search(w);assert.equal(result.found,Number.isFinite(expected));if(result.found){assert(Math.abs(result.len-expected)<1e-9);let cost=0;for(let k=1;k<result.path.length;k++){const u=result.path[k-1],v=result.path[k];assert(!ctx.wall[v]);cost+=Math.hypot(v%36-u%36,Math.floor(v/36)-Math.floor(u/36));}assert(Math.abs(cost-result.len)<1e-9);paths++;}}maps++;}
ctx.wall.fill(0);const pushes=[],original=ctx.Heap.prototype.push;ctx.Heap.prototype.push=function(key,val){pushes.push(key);return original.call(this,key,val);};ctx.search(0);assert.equal(pushes[0],0);for(const priority of pushes.slice(1,9))assert(priority===1||priority===Math.SQRT2);
let scripts=0;for(const file of fs.readdirSync(path.join(root,'chapters')).filter(f=>f.endsWith('.html')))for(const m of read('chapters/'+file).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(m[1].includes('src='))continue;if(m[1].includes('ld+json'))JSON.parse(m[2]);else new vm.Script(m[2],{filename:file});scripts++;}console.log({maps,optimalPaths:paths,compiledScriptBlocks:scripts});

// HIC samples are time points, not intervals. Rectangular/triangular pulses
// have independent closed-form optima; also exercise a non-grid window cap.
const body=read('chapters/body.html'),bc={};
vm.runInNewContext(body.split('/*PHYS-BEGIN*/')[1].split('/*PHYS-END*/')[0]+'\nthis.M=M;',bc);
let hicCases=0;
for(const A of [20,80,100,250])for(const T of [.002,.01,.015,.06])for(const cap of [.015,.01495]){
 const dt=.0001,h=bc.M.hic(bc.M.pulse('sq',A,T,dt),dt,cap);
 const duration=Math.min(T,Math.floor(cap/dt+1e-9)*dt);
 assert(Math.abs(h.hic-duration*A**2.5)<1e-7);
 assert(h.t2<=T+1e-12&&h.t2-h.t1<=cap+1e-12);hicCases++;
}
// For a symmetric triangular pulse, the optimum centered window has
// d=4T/7 and mean acceleration=5A/7 (differentiate d*(A*(1-d/(2T)))^2.5).
for(const A of [20,80,250])for(const T of [.007,.014]){
 const h=bc.M.hic(bc.M.pulse('tri',A,T,.0001),.0001,.015);
 const exact=(4*T/7)*(5*A/7)**2.5;
 assert(Math.abs(h.hic/exact-1)<1e-9);hicCases++;
}
// Half-sine integral is analytic; sample-only search and trapezoidal quadrature
// may differ slightly, but must converge and never extend beyond the pulse.
for(const T of [.01,.02]){
 const A=80,dt=.0001,h=bc.M.hic(bc.M.pulse('sine',A,T,dt),dt,.015);
 let exact=0;
 for(let i=0;i<Math.round(T/dt);i++)for(let j=i+1;j<=Math.min(Math.round(T/dt),i+150);j++){
  const d=(j-i)*dt,area=A*T/Math.PI*(Math.cos(Math.PI*i*dt/T)-Math.cos(Math.PI*j*dt/T));
  exact=Math.max(exact,d*(area/d)**2.5);
 }
 assert(Math.abs(h.hic/exact-1)<.00021);assert(h.t2<=T+1e-12);hicCases++;
}
const tri20=bc.M.hic(bc.M.pulse('tri',80,.020,.0001),.0001,.015);
assert(Math.abs((tri20.t2-tri20.t1)-.0114)<1e-12);hicCases++;
console.log({hicCases});
