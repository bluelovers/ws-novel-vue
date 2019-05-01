"use strict";
/**
 * Created by user on 2019/5/1.
 */
const tslib_1 = require("tslib");
const novel_1 = require("../../src/lib/novel");
const project_config_1 = tslib_1.__importStar(require("../../project.config"));
const url_1 = tslib_1.__importDefault(require("url"));
const sm = require("sitemap");
const fs = require("fs-extra");
const path = require("path");
const util_1 = tslib_1.__importDefault(require("../util"));
async function runBuild() {
    let sitemap = sm.createSitemap({
        hostname: project_config_1.siteUrl,
        cacheTime: 24 * 3600 * 1000,
        urls: [],
    });
    let NovelData = novel_1.dataAll();
    NovelData.publishers.forEach(title => {
        sitemap.add(createVueLink(title, novel_1.EnumEventLabel.AUTHOR));
    });
    novel_1.listChapterRange(NovelData.max_chapter)
        .forEach(row => {
        sitemap.add(createVueLink(row.label, novel_1.EnumEventLabel.CHAPTER_RANGE));
    });
    NovelData.tags
        .forEach(title => {
        sitemap.add(createVueLink(title, novel_1.EnumEventLabel.TAG));
    });
    NovelData.authors
        .forEach(title => {
        sitemap.add(createVueLink(title, novel_1.EnumEventLabel.AUTHOR));
    });
    /*
    Object.keys(NovelData.alias).forEach(title => {
        sitemap.add(createVueLink(title))
    });
    */
    let xml = sitemap.toXML();
    //console.log(xml);
    util_1.default.success(`[build] sitemap.xml`);
    return fs.writeFileSync(path.join(project_config_1.default.ProjectRoot, 'public/sitemap.xml'), xml);
}
function createVueLink(text, type = novel_1.EnumEventLabel.KEYWORD) {
    return url_1.default.resolve(project_config_1.siteUrl, [
        novel_1.EnumEventAction.SEARCH,
        `${type}?searchValue=${text}`,
    ].join('/'));
}
module.exports = runBuild();
//# sourceMappingURL=build-sitemap.js.map