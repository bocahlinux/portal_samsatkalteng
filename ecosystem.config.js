module.exports = {
  apps: [
    {
      name: "samsat-kalteng-portal",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      max_memory_restart: "350M",
      time: true
    }
  ]
};