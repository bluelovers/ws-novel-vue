"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2019/1/13/013.
 */
const path = require("path");
exports.ProjectRoot = path.join(__dirname);
exports.publicPath = path.join(exports.ProjectRoot, 'public');
exports.distPath = path.join(exports.ProjectRoot, 'dist');
exports.srcPath = path.join(exports.ProjectRoot, 'src');
exports.siteUrl = 'https://demonovel.netlify.com/';
exports.ProjectConfig = exports;
exports.default = exports.ProjectConfig;
