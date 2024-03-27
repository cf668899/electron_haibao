const net = require('net');

// 只检测代理服务器连通性
export  function checkIp(ip, port, callback){
let start = new Date().getTime()
 const client = net.connect(port, ip, () => {
  client.end();
  if(callback){
    let end = new Date().getTime()
    callback(true, end - start);
  }
 });
 
 client.on('error', () => {
  if(callback){
    let end = new Date().getTime()
    callback(false, end - start);
  }
 });
}