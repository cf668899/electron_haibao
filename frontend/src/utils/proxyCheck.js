const dns = require('dns');
const HttpProxyAgent = require('http-proxy-agent');

export default function check(proxy){
// 设置代理服务器的主机和端口
let proxyHost = proxy.host;
let proxyPort = proxy.port

// 设置要测试的目标主机和端口
const targetHost = 'baidu.com';
// 创建代理代理对象
const proxyAgent = new HttpProxyAgent(`${proxy.type.toLowerCase()}://${proxyHost}:${proxyPort}`);
// 设置dns.lookup使用代理代理对象
dns.lookup(targetHost, { agent: proxyAgent }, (err, address, family) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log('DNS lookup successful:', address, family);
  }
});

}