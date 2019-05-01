"use strict";
/**
 * Created by user on 2019/1/11/011.
 */
const tslib_1 = require("tslib");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const util_1 = tslib_1.__importStar(require("./util"));
const project_config_1 = tslib_1.__importDefault(require("../project.config"));
const cwd = project_config_1.default.ProjectRoot;
module.exports = (async () => {
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build/yarn-list'))).then(util_1.awaitImport)
        .catch(e => util_1.default.error(e));
    /*
    await CrossSpawn('node', [
        path.resolve(__dirname, './fetch-api-json'),
    ], {
        cwd,
        stdio: 'inherit',
    })
    ;
    */
    await Promise.resolve().then(() => tslib_1.__importStar(require('./fetch-api-json'))).then(util_1.awaitImport)
        .catch(e => util_1.default.error(e));
    //await Bluebird.delay(5000);
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build/build-cache'))).then(util_1.awaitImport)
        .catch(e => util_1.default.error(e));
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build/build-opds'))).then(util_1.awaitImport)
        .catch(e => util_1.default.error(e));
    await cross_spawn_extra_1.async('yarn', [
        'run',
        'build-sitemap',
    ], {
        cwd,
        stdio: 'inherit',
    })
        .catch(e => null);
    //process.exit();
    await cross_spawn_extra_1.async('yarn', [
        'run',
        'build-base',
    ], {
        cwd,
        stdio: 'inherit',
    });
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build/copy-missed-static'))).then(util_1.awaitImport);
    await Promise.resolve().then(() => tslib_1.__importStar(require('./build/check-dist'))).then(util_1.awaitImport);
})();
//# sourceMappingURL=build.js.map