# Node.js OS Module

The `os` module provides operating system-related utility methods and properties.

## 🔹 System Information

### os.platform() - Get platform
```js
const os = require('os');

console.log(os.platform());
// 'darwin' (macOS), 'win32' (Windows), 'linux', etc.

// Check platform
if (os.platform() === 'win32') {
  console.log('Running on Windows');
}
```

### os.arch() - Get CPU architecture
```js
const os = require('os');

console.log(os.arch());
// 'x64', 'arm', 'arm64', etc.
```

### os.type() - Get OS type
```js
const os = require('os');

console.log(os.type());
// 'Linux', 'Darwin', 'Windows_NT'
```

### os.release() - Get OS release
```js
const os = require('os');

console.log(os.release());
// '20.6.0' (macOS), '10.0.19041' (Windows), etc.
```

### os.version() - Get OS version
```js
const os = require('os');

console.log(os.version());
// Detailed version string
```

## 🔹 Memory Information

### os.totalmem() - Total memory
```js
const os = require('os');

const totalMem = os.totalmem();
console.log(`Total Memory: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`);
```

### os.freemem() - Free memory
```js
const os = require('os');

const freeMem = os.freemem();
console.log(`Free Memory: ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`);

// Calculate used memory
const usedMem = os.totalmem() - os.freemem();
const usedPercent = (usedMem / os.totalmem() * 100).toFixed(2);
console.log(`Memory Usage: ${usedPercent}%`);
```

## 🔹 CPU Information

### os.cpus() - CPU details
```js
const os = require('os');

const cpus = os.cpus();
console.log(`CPU Cores: ${cpus.length}`);
console.log(`CPU Model: ${cpus[0].model}`);

cpus.forEach((cpu, index) => {
  console.log(`Core ${index}:`, cpu.speed, 'MHz');
});
```

## 🔹 User Information

### os.userInfo() - Current user
```js
const os = require('os');

const user = os.userInfo();
console.log('Username:', user.username);
console.log('Home Directory:', user.homedir);
console.log('Shell:', user.shell);
```

### os.homedir() - Home directory
```js
const os = require('os');

console.log(os.homedir());
// '/Users/username' (macOS), 'C:\Users\username' (Windows)
```

## 🔹 System Directories

### os.tmpdir() - Temp directory
```js
const os = require('os');

console.log(os.tmpdir());
// '/tmp' (Unix), 'C:\Users\username\AppData\Local\Temp' (Windows)
```

## 🔹 Network Information

### os.networkInterfaces() - Network interfaces
```js
const os = require('os');

const interfaces = os.networkInterfaces();

Object.keys(interfaces).forEach(name => {
  console.log(`Interface: ${name}`);
  interfaces[name].forEach(iface => {
    console.log(`  ${iface.family}: ${iface.address}`);
  });
});
```

### os.hostname() - Hostname
```js
const os = require('os');

console.log(os.hostname());
// 'MacBook-Pro.local', 'DESKTOP-ABC123', etc.
```

## 🔹 System Uptime

### os.uptime() - System uptime
```js
const os = require('os');

const uptime = os.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);

console.log(`System Uptime: ${hours}h ${minutes}m`);
```

## 🔹 Line Endings

### os.EOL - End of line
```js
const os = require('os');

console.log(os.EOL);
// '\n' (Unix), '\r\n' (Windows)

// Use in file writing
const lines = ['Line 1', 'Line 2', 'Line 3'];
const content = lines.join(os.EOL);
```

## 🔹 Load Average (Unix only)

### os.loadavg() - Load average
```js
const os = require('os');

const load = os.loadavg();
console.log('Load Average (1, 5, 15 min):', load);
// [1.5, 1.2, 1.0]
```

## 💡 Tips

- Use **os.platform()** for platform-specific code
- **os.tmpdir()** is useful for temporary files
- **os.EOL** ensures correct line endings across platforms
- Memory values are in bytes (divide by 1024³ for GB)
- **os.cpus()** is useful for parallel processing decisions

## 🧩 Example: System Monitor

```js
const os = require('os');

function getSystemInfo() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    cpuModel: os.cpus()[0].model,
    totalMemory: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
    freeMemory: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
    usedMemory: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
    memoryUsage: `${(usedMem / totalMem * 100).toFixed(2)}%`,
    uptime: formatUptime(os.uptime()),
    hostname: os.hostname(),
    user: os.userInfo().username
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
}

console.log(getSystemInfo());
```

## 🧩 Example: Platform-Specific Paths

```js
const os = require('os');
const path = require('path');

function getConfigPath(appName) {
  const home = os.homedir();
  
  switch (os.platform()) {
    case 'win32':
      return path.join(process.env.APPDATA || home, appName);
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', appName);
    case 'linux':
      return path.join(home, '.config', appName);
    default:
      return path.join(home, `.${appName}`);
  }
}

console.log(getConfigPath('myapp'));
// macOS: /Users/username/Library/Application Support/myapp
// Windows: C:\Users\username\AppData\Roaming\myapp
// Linux: /home/username/.config/myapp
```

## 🧩 Example: Get Local IP Address

```js
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return '127.0.0.1';
}

console.log('Local IP:', getLocalIP());
```

## ⚠️ Common Mistakes

❌ **Assuming platform-specific features**
```js
const load = os.loadavg(); // Only works on Unix!
```

✅ **Check platform first:**
```js
if (os.platform() !== 'win32') {
  const load = os.loadavg();
}
```

❌ **Hardcoding paths**
```js
const configPath = '/Users/username/.config'; // Breaks on Windows!
```

✅ **Use os.homedir():**
```js
const configPath = path.join(os.homedir(), '.config');
```

## 🔗 See Also

- [Path Module](./path-module.md)
- [FS Module](./fs-module.md)
- [Server](./server.md)
