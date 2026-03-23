import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
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
    provideRemoteConfig(() => getRemoteConfig()),
    provideIonicAngular(), 
    provideRouter(routes), 
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