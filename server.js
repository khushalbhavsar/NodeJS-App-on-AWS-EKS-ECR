const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Home route
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Node.js on EKS</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          h1 { font-size: 3em; margin: 0; }
          p { font-size: 1.5em; margin: 20px 0; }
          .tech { 
            display: inline-block; 
            margin: 10px; 
            padding: 10px 20px; 
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Welcome to Node.js on AWS EKS!</h1>
          <p>Successfully deployed using Docker, ECR, and Kubernetes</p>
          <div>
            <span class="tech">🐳 Docker</span>
            <span class="tech">☸️ Kubernetes</span>
            <span class="tech">🗂️ ECR</span>
            <span class="tech">☁️ AWS EKS</span>
          </div>
          <p style="font-size: 1em; margin-top: 30px;">
            Hostname: ${require('os').hostname()}<br>
            Node Version: ${process.version}
          </p>
        </div>
      </body>
    </html>
  `);
});

// API endpoint
app.get('/api/info', (req, res) => {
    res.json({
        app: 'Node.js EKS Deployment',
        version: '1.0.0',
        hostname: require('os').hostname(),
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
            total: `${Math.round(require('os').totalmem() / 1024 / 1024)}MB`,
            free: `${Math.round(require('os').freemem() / 1024 / 1024)}MB`
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕒 Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
