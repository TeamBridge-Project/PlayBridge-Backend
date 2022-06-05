'use strict';

module.exports = {
  apps: [
    {
      name: "PlayBridge",
      script: "node autogen.js ; ts-node ./main.ts",
      ignore_watch: ["node_modules"]
    }
  ]
};
