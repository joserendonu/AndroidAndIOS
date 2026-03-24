📘 README - Aplicación Tipo Trello (Ionic + Angular + Firebase)
📌 Descripción

Aplicación móvil tipo Trello desarrollada con Ionic + Angular, que permite:

CRUD de tareas
Clasificación por prioridad
Organización por categorías
Persistencia en Firebase (Firestore)
Feature flags con Remote Config
🛠️ Tecnologías utilizadas
Frontend: Ionic + Angular (Standalone Components)
Backend (BaaS): Firebase Firestore
Mobile: Cordova
Configuración remota: Firebase Remote Config
Herramientas adicionales: Docker (opcional), ADB
🚀 Instalación del entorno
1. Instalar Ionic
npm install -g @ionic/cli
2. Crear el proyecto
ionic start miTrello blank --type=angular

👉 Se utilizó Standalone Components (sin NgModules)

3. Instalar Firebase
npm install @angular/fire firebase
🔥 Configuración de Firebase
1. Crear proyecto

Ir a Firebase Console:

Crear proyecto
Añadir Web App
Copiar credenciales
2. Configurar entorno

📁 src/environments/environment.ts

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  }
};
🧠 Modelo de datos

📁 src/app/models/task.model.ts

export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'urgente' | 'secundaria' | 'largo-plazo';
  status: 'pendientes' | 'en-proceso' | 'completadas';
  createdAt: number;
}
🧩 Servicio Firebase (CRUD)

📁 src/app/services/todo.service.ts

@Injectable({ providedIn: 'root' })
export class TodoService {

  constructor(private firestore: Firestore) {}

  addTask(task: Task) {
    const taskRef = collection(this.firestore, 'tasks');
    return addDoc(taskRef, task);
  }

  getTasks(): Observable<Task[]> {
    const taskRef = collection(this.firestore, 'tasks');
    return collectionData(taskRef, { idField: 'id' }) as Observable<Task[]>;
  }

  updateTask(task: Task) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskDocRef, { ...task });
  }

  deleteTask(id: string) {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDocRef);
  }
}
🎨 Interfaz de usuario
Listado por prioridad
Uso de ion-list, ion-item, ion-badge
Botón flotante para agregar tareas
⚙️ Lógica principal

📁 home.page.ts

Suscripción a tareas desde Firestore
Filtro por prioridad
Creación de tareas
Eliminación
🧪 Ejecución del proyecto
ionic serve
🔥 Firebase Emulator (opcional)
firebase emulators:start
📱 COMPILACIÓN MÓVIL (CORDOVA)
🔧 Construcción inicial
ionic build
cordova platform add android
📦 Generar APK
cordova prepare android
cordova build android
🔄 Sincronizar cambios
ionic build
cordova prepare android
⚠️ CONFIGURACIONES IMPORTANTES (ANDROID + FIREBASE)
🧠 1. Firestore activo

En Firebase Console:

Activar Firestore Database
🧠 2. Reglas de seguridad (modo prueba)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

👉 ⚠️ Solo para pruebas

🌐 3. Permiso de Internet

📁 AndroidManifest.xml

<uses-permission android:name="android.permission.INTERNET" />
🔥 4. Uso de Firebase Emulator en celular

❌ Esto NO funciona en celular:

connectFirestoreEmulator(firestore, 'localhost', 8080);

✅ Usar IP del PC:

connectFirestoreEmulator(firestore, '192.168.X.X', 8080);
🧪 5. Debug en Android
adb logcat

Buscar errores como:

PERMISSION_DENIED
network error
firebase error
🚨 PROBLEMAS COMUNES
Problema	Causa
No guarda tareas	Reglas Firebase
No carga datos	Emulator mal configurado
Funciona en web pero no en app	localhost mal usado
Error de red	Falta permiso INTERNET
⚡ OPTIMIZACIÓN
Uso de componentes standalone
Preferencia por recursividad sobre ciclos (según requerimiento)
Separación por servicios
Manejo reactivo con RxJS
🚀 FEATURE FLAGS (REMOTE CONFIG)

Se implementó:

Firebase Remote Config
Flag: enable_categories

Permite:

Activar/desactivar categorías dinámicamente
🔮 MEJORAS FUTURAS
Drag & Drop con Angular CDK
Autenticación con Firebase Auth
UI tipo tablero (Trello real)
Filtros avanzados
Migración completa a Capacitor
📌 NOTAS IMPORTANTES
Se utilizó Cordova por requerimiento, aunque:
👉 Se recomienda Capacitor para producción
La app está optimizada para Android
iOS requiere entorno macOS
🎥 REFERENCIA

Video guía base:

👉 https://www.youtube.com/watch?v=A_i0vFN4950

✅ ESTADO ACTUAL

✔ CRUD completo de tareas
✔ Categorías dinámicas
✔ Firebase integrado
✔ APK generado
✔ Feature flag funcional