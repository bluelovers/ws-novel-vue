/**
 * Created by user on 2019/1/13/013.
 */
import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(VueFire);

firebase.initializeApp({
	apiKey: "AIzaSyCtcYAFlVytda7kNqEHOqdMTiGzwsgikhI",
	authDomain: "demonovel.firebaseapp.com",
	databaseURL: "https://demonovel.firebaseio.com",
	projectId: "demonovel",
	storageBucket: "demonovel.appspot.com",
	messagingSenderId: "740140212143"
});

//firebase.firestore().settings({ timestampsInSnapshots: true })

export const db = firebase.firestore();
