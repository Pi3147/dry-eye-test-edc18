import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// export const appConfig: ApplicationConfig = {
//     providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({
//         "projectId": "dry-eye-test-edc18",
//         "appId": "1:891784571055:web:8e278fd545f05ca9a34c5a",
//         "databaseURL": "https://dry-eye-test-edc18-default-rtdb.firebaseio.com",
//         "storageBucket": "dry-eye-test-edc18.appspot.com",
//         "apiKey": "AIzaSyC3jijzH4HAImEDYWZ_dFzNXCo9DFBZAHI",
//         "authDomain": "dry-eye-test-edc18.firebaseapp.com",
//         "messagingSenderId": "891784571055",
//         "measurementId": "G-4NFQ21TD66"
//     }))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
// };

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        importProvidersFrom(
            BrowserAnimationsModule,
            HttpClientModule,
            AngularFireModule.initializeApp({
                apiKey: "AIzaSyBOmeL1Ab3eGb5jQCFFSKCtqJUfe8Vd-o4",
                authDomain: "dry-eye-test-edc18.firebaseapp.com",
                projectId: "dry-eye-test-edc18",
                storageBucket: "dry-eye-test-edc18.firebasestorage.app",
                messagingSenderId: "760021343827",
                appId: "1:760021343827:web:b8edad0315d4d4eb2870a6",
                measurementId: "G-VW46GB9F8Q"
            }),
            AngularFirestoreModule,
            ToastrModule.forRoot(),
          )
    ]
};
