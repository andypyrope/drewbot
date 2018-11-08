const fs = require("fs");

const authFile = "auth.json";
const defaultPassword = "mysecretpassword";

const dbDir = "dist/main/db";
const cli = {
   "entitiesDir": dbDir + "/entities",
   "migrationsDir": dbDir + "/migrations",
   "subscribersDir": dbDir + "/subscribers",
};
const pathSuffix = "/**/*.js";

module.exports = [
   makeLocalhostDatabaseConfig("development", "drewbot"),
   makeLocalhostDatabaseConfig("test", "drewbot-test"),
];

function makeLocalhostDatabaseConfig(name, database) {
   return {
      "name": name,
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "postgres",
      "password": fs.existsSync(authFile)
         ? JSON.parse(fs.readFileSync("auth.json", "utf8")).localhostDbPassword || defaultPassword
         : defaultPassword,
      "database": database,
      "synchronize": true,
      "logging": false,
      "entities": [cli.entitiesDir + pathSuffix],
      "migrations": [cli.migrationsDir + pathSuffix],
      "subscribers": [cli.subscribersDir + pathSuffix],
      "cli": cli,
   };
}
