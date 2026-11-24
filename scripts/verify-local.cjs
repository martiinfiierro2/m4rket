const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
require(path.join(root, 'backend/node_modules/dotenv')).config({path:path.join(root,'backend/.env.local')});
const mysql = require(path.join(root,'backend/node_modules/mysql2/promise'));
const manifest = require('../database/demo-manifest.json');
const base = 'http://127.0.0.1:' + (process.env.PORT || 3030) + '/api';
const tables = ['usuarios','productos','ubicaciones','tipo_promocion','promociones','en_ubicacion','en_promocion','lista_compra','datos_contadores','datos_tiempo'];
const results = [];
const cleanup = [];
let token;
let connection;
async function request(method, endpoint, body, anonymous=false) {
  const response = await fetch(base+endpoint, {method,headers:{...(anonymous?{}:{'x-token':token}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data = await response.json();
  assert.equal(response.status,200, method+' '+endpoint+' HTTP '+response.status+' '+data.msg);
  assert.equal(data.ok,true,method+' '+endpoint+' '+data.msg);
  results.push({method,endpoint,status:response.status});
  return data;
}
async function counts() {
  const data = {};
  for (const table of tables) {const [rows]=await connection.query('SELECT COUNT(*) AS count FROM `'+table+'`');data[table]=rows[0].count;}
  return data;
}
(async()=>{
try {
  connection = await mysql.createConnection({host:process.env.HOSTBD,port:Number(process.env.PORTBD),database:process.env.BD,user:process.env.USERBD,password:process.env.PWDBD});
  const before = await counts();
  assert.equal(Object.keys(before).length,10);
  for(const [email,role]of [['usuario@m4rket.test','usuario'],['admin@m4rket.test','admin'],['superadmin@m4rket.test','superAdmin']]) {
    const login=await request('POST','/login',{email,pwd:manifest.demoPassword},true);
    assert.equal(login.rol,role);assert.ok(login.token);token=login.token;
  }
  await request('GET','/token');
  const dataset=await request('GET','/dataset/productos',null,true);assert.equal(dataset.page.total,manifest.products);assert.equal(dataset.productos.length,4);
  const all=await request('GET','/allproductos');assert.equal(all.productos.length,manifest.products);
  for(const product of all.productos) {
    assert.ok(product.Ubicacions.length,'Producto sin ubicación '+product.id);
    for(const location of product.Ubicacions) {const index=(location.referencia.charCodeAt(0)-65)*10+location.posicion;assert.ok(index>=0&&index<manifest.locations);}
    const photo=await fetch(base+'/uploads/fotoproducto/'+encodeURIComponent(product.foto),{headers:{'x-token':token}});assert.equal(photo.status,200,'Foto '+product.id);assert.match(photo.headers.get('content-type'),/^image\//);
  }
  const page=await request('GET','/productos?desde=4');assert.equal(page.productos.length,4);assert.equal(page.page.total,manifest.products);
  const detail=await request('GET','/productos?id=60');assert.equal(detail.productos.id,60);assert.ok(detail.productos.valor_energetico>0);
  const search=await request('GET','/productos/Manzana');assert.ok(search.productos.some(p=>p.id===60));
  const users=await request('GET','/usuarios');assert.equal(users.page.total,manifest.users);
  for(const p of users.usuarios) assert.ok(!('pwd' in p));
  const location=await request('GET','/ubicaciones?referencia=A&posicion=1');assert.equal(location.ubicaciones.posicion,1);
  await request('GET','/ubicaciones');await request('GET','/enubicacion?id=1');await request('GET','/enubicacion?idProd=60');
  await request('GET','/tipopromo');await request('GET','/promociones');await request('GET','/enpromocion?id=1');
  const list=await request('GET','/listacompra?id=1');assert.equal(list.listacompra.length,4);
  const now=new Date();const since=new Date(now.getTime()-30*86400000).toISOString().slice(0,10);const until=new Date(now.getTime()+86400000).toISOString().slice(0,10);
  for(const name of ['buscado','activo','anadido','eliminado','comprado','localizado','buscadousu','mediatiempos','usuariounico']){
    const stats=await request('GET','/contadores?nombre='+name+'&inicio='+since+'&fin='+until+'&idUsu=1');assert.ok(stats.datosContadores.length,'Sin estadísticas para '+name);
  }
  for (const name of ['masbuscado','masanadido','maseliminado','mascomprado']) {
    const ranking=await request('GET','/contadores?nombre='+name+'&inicio='+since+'&fin='+until);
    assert.ok(ranking.datosContadores.length);
    assert.ok(ranking.datosContadores.every(row=>Number.isInteger(row.idProd) && Number(row.totalCount)>0));
  }
  for(const name of ['anadido','eliminado']) {
    const ranking=await request('GET','/contadores?nombre='+name);
    assert.ok(ranking.datosContadores.length && ranking.datosContadores.every(row=>Number.isInteger(row.idProd)));
  }
  const daily=await request('GET','/contadores?nombre=buscado&inicio='+since+'&fin='+until);
  assert.ok(daily.datosContadores.every(row=>row.fecha));
  const userBody={nombre:'Verificación',apellido:'Temporal',email:'verificacion-'+Date.now()+'@m4rket.test',pwd:manifest.demoPassword,genero:'Mujer',rol:'usuario'};
  const newUser=await request('POST','/usuarios',userBody);
  const temporaryUser=newUser.usuario.id;cleanup.push(['/usuarios/',temporaryUser]);
  await request('PUT','/usuarios/'+temporaryUser,userBody);
  const temporaryLocation=await request('POST','/ubicaciones',{referencia:'Z',posicion:0});
  cleanup.push(['/ubicaciones/',temporaryLocation.ubicacion.id]);
  await request('PUT','/ubicaciones/'+temporaryLocation.ubicacion.id,{referencia:'Z',posicion:0});
  const times=await request('GET','/tiempos?nombre=compra');assert.equal(times.datosTiempo.length,manifest.timeIntervals);
  const productBody={nombre:'Producto temporal de verificación',marca:'Prueba local',categoria:'Pruebas',stock:5,precio:1.5,foto:'no-imagen.png'};
  const created=await request('POST','/productos',productBody);const productId=created.producto.id;cleanup.push(['/productos/',productId]);
  await request('PUT','/productos/'+productId,{...productBody,stock:7});
  const form=new FormData();
  form.append('archivo',new Blob([fs.readFileSync(path.join(root,'uploads/fotoproducto/no-imagen.png'))],{type:'image/png'}),'prueba.png');
  const upload=await fetch(base+'/uploads/fotoproducto/'+productId,{method:'POST',headers:{'x-token':token},body:form});
  assert.equal(upload.status,200);const uploaded=await upload.json();assert.equal(uploaded.ok,true);
  const imageDefault=await fetch(base+'/uploads/fotoproducto/no-imagen.png',{headers:{'x-token':token}});assert.equal(imageDefault.status,200);
  const escape=await fetch(base+'/uploadsDataset/fotoproducto/..%5C..%5Cbackend%5C.env');assert.equal(escape.status,400);await escape.body.cancel();
  results.push({method:'POST',endpoint:'/uploads/fotoproducto/:id',status:upload.status});
  const uploadRoot=path.resolve(root,'backend',process.env.PATHUPLOAD);
  const generated=path.resolve(uploadRoot,'fotoproducto',uploaded.nombreArchivo);
  if (generated.startsWith(uploadRoot+path.sep) && /^[a-f0-9-]+\.png$/.test(uploaded.nombreArchivo)) {
    // Retira únicamente la imagen temporal creada por esta prueba.
    process.once('beforeExit',()=>{if(fs.existsSync(generated))fs.unlinkSync(generated);});
  }
  const kind=await request('POST','/tipopromo',{nombre:'Tipo temporal',descripcion:'Prueba local',modificador:10});
  const kindId=kind.tipopromocion?.id;
  assert.ok(kindId,'Respuesta de tipo promoción sin id');cleanup.push(['/tipopromo/',kindId]);
  await request('PUT','/tipopromo/'+kindId,{nombre:'Tipo temporal renombrado',descripcion:'Prueba local',modificador:10});
  const promotion=await request('POST','/promociones',{nombre:'Promoción temporal',fecha_ini:since,fecha_fin:until,id_tipoPromo:kindId});const promotionId=promotion.promocion.id;cleanup.push(['/promociones/',promotionId]);
  const relation=await request('POST','/enpromocion',{fecha:now.toISOString(),precio:1.35,idPromo:promotionId,idProd:productId});cleanup.push(['/enpromocion/',relation.enpromocion.id]);
  const located=await request('POST','/enubicacion',{idProd:productId,idUbi:1,fecha_ini:since,fecha_fin:until});cleanup.push(['/enubicacion/',located.enubicacion.id]);
  const bought=await request('POST','/listacompra',{idUsu:1,idProd:productId,fecha:now.toISOString(),cantidad:2,comprado:false});const listId=bought.listacompra.id;cleanup.push(['/listacompra/',listId]);
  await request('PUT','/listacompra/'+listId,{idUsu:1,idProd:productId,fecha:now.toISOString(),cantidad:3,comprado:true});
  const count=await request('POST','/contadores',{nombre:'buscado',idProd:productId,fecha:now.toISOString(),id_usuario:'1',tiempo_uso:null});cleanup.push(['/contadores/',count.datos.id]);
  const time=await request('POST','/tiempos',{nombre:'compra',fecha_ini:new Date(now.getTime()-60000).toISOString(),fecha_fin:now.toISOString(),idLista:listId,idUsu:1});cleanup.push(['/tiempos/',time.datos.id]);
  while(cleanup.length){const [prefix,id]=cleanup.pop();await request('DELETE',prefix+id);}
  assert.deepEqual(await counts(),before,'La verificación no debe dejar filas temporales');
  const report={date:new Date().toISOString(),server:'MariaDB local',tables:before,apiChecks:results.length,imageChecks:all.productos.length,results};
  fs.mkdirSync(path.join(root,'.local'),{recursive:true});fs.writeFileSync(path.join(root,'.local/verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({ok:true,apiChecks:results.length,imageChecks:all.productos.length,tables:before},null,2));
} catch(error) {
  console.error('Verificación fallida: '+error.message);process.exitCode=1;
} finally {
  while(cleanup.length){const[prefix,id]=cleanup.pop();try{await request('DELETE',prefix+id);}catch(error){console.error('Pendiente de limpiar '+prefix+id+': '+error.message);process.exitCode=1;}}
  if(connection)await connection.end();
}
})();