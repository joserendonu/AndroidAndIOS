// import { bootstrapApplication } from '@angular/platform-browser';
// import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
// import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// import { routes } from './app/app.routes';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//     provideIonicAngular(),
//     provideRouter(routes, withPreloading(PreloadAllModules)),
//   ],
// });

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from './environments/environment';


import { provideRouter } from '@angular/router'; // 👈 IMPORTANTE
import { routes } from './app/app.routes';       // 👈 IMPORTANTE
import { provideIonicAngular } from '@ionic/angular/standalone'; // 👈 ESTE FALTABA
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // 👈 IMPORTANTE
import { connectFirestoreEmulator } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),   // 👈 NECESARIO PARA IONIC
    provideRouter(routes), // 👈 ESTO SOLUCIONA EL ERROR
    provideFirestore(() => {
      const firestore = getFirestore();

      // 👇 CONDICIÓN
      if (location.hostname === 'localhost') {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      return firestore;
    }), // 👈 ESTA LÍNEA SOLUCIONA TODO
    provideFirebaseApp(() => initializeApp(environment.firebase))

  ]
}).catch(err => console.error(err));