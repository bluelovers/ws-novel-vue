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
    sitemap.add({
        url: url_1.default.resolve(project_config_1.siteUrl, `history`),
        changefreq: 'daily',
        priority: 0.3,
    });
    sitemap.add({
        url: url_1.default.resolve(project_config_1.siteUrl, `tool/cjk-conv`),
        changefreq: 'monthly',
        priority: 0.3,
    });
    sitemap.add({
        url: url_1.default.resolve(project_config_1.siteUrl, `static/opds.xml`),
        changefreq: 'daily',
        priority: 0.3,
    });
    novel_1.listChapterRange(NovelData.max_chapter)
        .forEach(row => {
        addSitemap(sitemap, {
            url: createVueLink(row.label, novel_1.EnumEventLabel.CHAPTER_RANGE),
            changefreq: 'daily',
            priority: 0.5,
        }, 3);
    });
    NovelData.tags
        .forEach(title => {
        addSitemap(sitemap, {
            url: createVueLink(title, novel_1.EnumEventLabel.TAG),
            changefreq: 'daily',
            priority: 0.8,
        }, 3);
    });
    NovelData.authors
        .forEach(title => {
        addSitemap(sitemap, {
            url: createVueLink(title, novel_1.EnumEventLabel.AUTHOR),
            changefreq: 'daily',
            priority: 0.8,
        }, 2);
    });
    NovelData.publishers.forEach(title => {
        addSitemap(sitemap, {
            url: createVueLink(title, novel_1.EnumEventLabel.PUBLISHER),
            changefreq: 'monthly',
            priority: 0.9,
        }, 1);
    });
    Object.keys(NovelData.alias).forEach(title => {
        let data = NovelData.alias[title].sort((a, b) => {
            return a.update_date - b.update_date;
        })[0];
        let _append = {};
        try {
            if (data.mdconf.novel.cover) {
                _append.img = [
                    {
                        url: data.mdconf.novel.cover,
                        caption: data.title,
                        title: data.title,
                    }
                ];
            }
        }
        catch (e) {
        }
        sitemap.add({
            url: createVueLink(title),
            changefreq: 'daily',
            priority: 1,
            lastmod: novel_1.createMoment(data.update_date).toDate(),
            ..._append,
        });
    });
    [
        '魔王',
        '姬騎士',
        '蜘蛛',
        '四度目',
        '幼女',
    ]
        .forEach(title => {
        sitemap.add({
            url: createVueLink(title),
            changefreq: 'monthly',
            priority: 0.5,
        });
    });
    NovelData.illusts.forEach(title => {
        addSitemap(sitemap, {
            url: createVueLink(title, novel_1.EnumEventLabel.ILLUST),
            changefreq: 'monthly',
            priority: 0.6,
        }, 2);
    });
    NovelData.contributes.forEach(title => {
        addSitemap(sitemap, {
            url: createVueLink(title, novel_1.EnumEventLabel.CONTRIBUTE),
            changefreq: 'monthly',
            priority: 0.1,
        }, 1);
    });
    let xml = sitemap.toXML();
    //console.log(xml);
    util_1.default.success(`[build] sitemap.xml`);
    return fs.writeFileSync(path.join(project_config_1.default.ProjectRoot, 'public/sitemap.xml'), xml);
}
function createVueLink(text, type = novel_1.EnumEventLabel.KEYWORD) {
    let u = new URL([novel_1.EnumEventAction.SEARCH, type, encodeURIComponent(text)].join('/'), project_config_1.siteUrl);
    return u.toString();
    /*
    return url.resolve(siteUrl, [
        EnumEventAction.SEARCH,
        `${type}?searchValue=${text}`,
    ].join('/'))
     */
}
function addSitemap(sitemap, data, pages) {
    let { url, changefreq, priority } = data;
    sitemap.add({
        url, changefreq, priority
    });
    if (pages && pages > 1) {
        let u = new URL(url, project_config_1.siteUrl);
        let i = 1;
        while (i++ <= pages) {
            u.searchParams.set('page', i);
            sitemap.add({
                url: u.href,
                changefreq,
                priority
            });
        }
    }
}
module.exports = runBuild();
