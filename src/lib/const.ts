/**
 * Created by user on 2019/1/13/013.
 */

export const production = process.env.NODE_ENV === 'production';
export const development = !production;
