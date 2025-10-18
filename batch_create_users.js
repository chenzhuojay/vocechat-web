const http = require('http');
const BASE_URL = 'http://localhost:3000'; // 根据后端端口调整

// 使用http模块发送POST请求的函数
function postData(url, data) {
  return new Promise((resolve, reject) => {
    const postDataStr = JSON.stringify(data);
    
    const options = {
      hostname: url.split('/')[2].split(':')[0],
      port: url.split('/')[2].split(':')[1] || 80,
      path: '/api/user/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postDataStr)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({ status: res.statusCode, data: responseData });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postDataStr);
    req.end();
  });
}

// 生成随机邮件地址的函数
function generateRandomEmail(username) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 10000);
  return `${username}_${randomNum}@${randomDomain}`;
}

// 批量创建用户函数
async function createUsers() {
  console.log('开始批量创建用户...');
  
  for (let i = 2; i <= 102; i++) {
    const username = `test${i.toString().padStart(2, '0')}`;
    const email = generateRandomEmail(username);
    const password = '123456';
    
    try {
      const response = await postData(BASE_URL, {
        name: username,
        email: email,
        password: password,
        gender: 0,
        device: 'browser'
      });
      
      console.log(`成功创建用户 ${username}:`, response.status);
      
      // 避免请求过快，添加小延迟
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`创建用户 ${username} 失败:`, error.message);
    }
  }
  
  console.log('批量创建用户完成！');
}

// 执行函数
createUsers().catch(err => {
  console.error('执行出错:', err);
});