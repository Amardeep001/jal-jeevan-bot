module.exports = {
  apps: [
    {
      name: "jal-jeevan",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
        NODE_ENV: "development",
      },
    },
  ],
};
