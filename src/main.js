const app = require("./app");
const config = require("./app/config");

app.listen(config.APP_PORT, () => {
  console.log("端口9999,http://127.0.0.1:9999");
});
