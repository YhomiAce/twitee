require("dotenv").config();

module.exports = {
  apps: [
    {
      name: `Twitte_${process.env.NODE_ENV}`,
      script: "./app.js",
      watch: true,
      env: {
        NODE_ENV: process.env.NODE_ENV
      },
      ignore_watch: ["node_modules", "uploads"],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
};
