// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

const firebaseConfig = {
  apiKey: "AIzaSyBB8ZbHN6GJqbDkbjDcwV2355HfODMCLds",
  authDomain: "mitrellobd.firebaseapp.com",
  projectId: "mitrellobd",
  storageBucket: "mitrellobd.firebasestorage.app",
  messagingSenderId: "681808658263",
  appId: "1:681808658263:web:b79e5a1c03fa3c9f788812"
  // measurementId: "G-JN0TNJ55XL"
};



export const environment = {
  production: false,
  firebase: firebaseConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
