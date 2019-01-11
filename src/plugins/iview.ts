import Vue from 'vue'
import { Button } from 'iview'
import lang from 'iview/dist/locale/zh-TW'
// @ts-ignore
import { locale } from 'iview'
import iView from 'iview';

locale(lang);

Vue.use(iView);

//Vue.component('Button', Button)

import 'iview/dist/styles/iview.css'
