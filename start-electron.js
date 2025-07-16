const { spawn } = require('child_process')
const waitOn = require('wait-on')

async function startElectron() {
  console.log('等待Vite服务器启动...')
  
  try {
    // 等待Vite服务器启动
    await waitOn({
      resources: ['http://localhost:3001'],
      delay: 1000,
      interval: 100,
      timeout: 30000
    })
    
    console.log('Vite服务器已启动，正在启动Electron...')
    
    // 启动Electron
    const electron = spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    })
    
    electron.on('close', (code) => {
      console.log(`Electron进程退出，代码: ${code}`)
      process.exit(code)
    })
    
  } catch (error) {
    console.error('启动失败:', error)
    process.exit(1)
  }
}

startElectron()