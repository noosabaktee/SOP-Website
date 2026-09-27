import fs from 'node:fs'
import path from 'node:path'
const root=process.cwd();const publicDir=path.join(root,'public');const cssDir=path.join(root,'app/assets/css')
const cssFiles=[];const walk=d=>{for(const entry of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,entry.name);if(entry.isDirectory())walk(p);else if(p.endsWith('.css'))cssFiles.push(p)}};walk(cssDir)
const missing=[];for(const file of cssFiles){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/url\(["']?(\/assets\/[^"')]+)["']?\)/g)){const asset=path.join(publicDir,match[1].replace(/^\/+/,'').replace(/^assets\//,''));const actual=path.join(publicDir,'assets',path.basename(match[1]));if(!fs.existsSync(asset)&&!fs.existsSync(actual))missing.push({file:path.relative(root,file),url:match[1]})}}
console.log(JSON.stringify({ok:missing.length===0,cssFiles:cssFiles.length,missing},null,2));if(missing.length)process.exit(1)
