/**
 * Created by user on 2019/1/13/013.
 */
import path = require('path');

export const ProjectRoot = path.join(__dirname);

export const publicPath = path.join(ProjectRoot, 'public');
export const distPath = path.join(ProjectRoot, 'dist');

export const ProjectConfig = exports as typeof import('./project.config');

export default ProjectConfig;
