import * as fs from "fs";

// Travis needs access to the ormconfig.json file which, unfortunately, should not be committed
const mainOrmconfig: string = "ormconfig.json";
const testOrmconfig: string = "ormconfig-test.json";

if (!fs.existsSync(mainOrmconfig) && fs.existsSync(testOrmconfig)) {
   fs.copyFileSync(testOrmconfig, mainOrmconfig);
}
