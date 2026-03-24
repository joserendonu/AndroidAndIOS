# AndroidAndIOS
Prueba Técnica Desarrollador Fullstack

Video guía: https://www.youtube.com/watch?v=A_i0vFN4950
se usa gemini, antigravity y firebase


TEXTO PARA CREAR LA APP:
deseo crear una aplicacion similar a trello donde tendremos un CRUD para las tareas y aparte las tareas se pueden categorizar por prioridad(urgente, secundaria, largo plazo) , la aplicacion debe ser  usando ionic y angular y con base de datos en firebase

npm install -g @ionic/cli
ya que tengo ionic sigo con angular
ionic start miTrello blank --type=angular
Seleccioné standalone(creo que es con NgModules)

Se instala firebase
npm install @angular/fire firebase

Voy en el minuto 8:40

Estoy haciendo lo de docker con chatgpt

SIGUEN ESTOS PASOS:
3. Configurar Firebase
Ve a Firebase Console.
Crea un proyecto y añade una "Web App".
Copia las credenciales (firebaseConfig).
En tu proyecto de Ionic, abre src/environments/environment.ts y pega los datos:
code
TypeScript
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
4. Estructura de Datos (Modelo)
Crea una interfaz para tus tareas en src/app/models/task.model.ts:
code
TypeScript
export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'urgente' | 'secundaria' | 'largo-plazo';
  status: 'pendientes' | 'en-proceso' | 'completadas';
  createdAt: number;
}
5. Servicio de Firebase (CRUD)
Genera un servicio para manejar los datos: ionic g service services/todo
code
TypeScript
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private firestore: Firestore) {}

  // Crear
  addTask(task: Task) {
    const taskRef = collection(this.firestore, 'tasks');
    return addDoc(taskRef, task);
  }

  // Leer
  getTasks(): Observable<Task[]> {
    const taskRef = collection(this.firestore, 'tasks');
    return collectionData(taskRef, { idField: 'id' }) as Observable<Task[]>;
  }

  // Actualizar
  updateTask(task: Task) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskDocRef, { ...task });
  }

  // Eliminar
  deleteTask(id: string) {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDocRef);
  }
}
6. Interfaz de Usuario (UI)
En el archivo home.page.html, organizaremos las tareas por su prioridad usando colores o secciones.
code
Html
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Mi Trello</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <!-- Botón para añadir -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button (click)="openAddModal()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- Listado de Tareas -->
  <ion-list>
    <ion-item-group *ngFor="let p of ['urgente', 'secundaria', 'largo-plazo']">
      <ion-item-divider sticky>
        <ion-label class="ion-text-uppercase">{{ p }}</ion-label>
      </ion-item-divider>

      <ion-item-sliding *ngFor="let task of getTasksByPriority(p)">
        <ion-item>
          <ion-label>
            <h2>{{ task.title }}</h2>
            <p>{{ task.description }}</p>
          </ion-label>
          <ion-badge [color]="getPriorityColor(task.priority)" slot="end">
            {{ task.priority }}
          </ion-badge>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="danger" (click)="deleteTask(task.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-item-group>
  </ion-list>
</ion-content>
7. Lógica del Componente
En home.page.ts:
code
TypeScript
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Task } from '../models/task.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit {
  tasks: Task[] = [];

  constructor(private todoService: TodoService, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.todoService.getTasks().subscribe(res => {
      this.tasks = res;
    });
  }

  getTasksByPriority(priority: string) {
    return this.tasks.filter(t => t.priority === priority);
  }

  getPriorityColor(priority: string) {
    switch(priority) {
      case 'urgente': return 'danger';
      case 'secundaria': return 'warning';
      case 'largo-plazo': return 'success';
      default: return 'medium';
    }
  }

  async openAddModal() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título' },
        { name: 'description', type: 'text', placeholder: 'Descripción' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Siguiente', 
          handler: (data) => this.selectPriority(data) 
        }
      ]
    });
    await alert.present();
  }

  async selectPriority(data: any) {
    const alert = await this.alertCtrl.create({
      header: 'Prioridad',
      inputs: [
        { name: 'priority', type: 'radio', label: 'Urgente', value: 'urgente', checked: true },
        { name: 'priority', type: 'radio', label: 'Secundaria', value: 'secundaria' },
        { name: 'priority', type: 'radio', label: 'Largo Plazo', value: 'largo-plazo' },
      ],
      buttons: [
        {
          text: 'Guardar',
          handler: (priority) => {
            this.todoService.addTask({
              title: data.title,
              description: data.description,
              priority: priority,
              status: 'pendientes',
              createdAt: Date.now()
            });
          }
        }
      ]
    });
    await alert.present();
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id);
  }
}
8. Próximos pasos para que sea un "Trello" real:
Drag and Drop: Utiliza @angular/cdk/drag-drop para mover tareas entre columnas (Pendiente, Proceso, Terminado).
Autenticación: Añade Firebase Auth para que cada usuario tenga sus propias tareas.
Filtros: Añade un ion-segment para filtrar rápidamente por prioridad en la parte superior.
Diseño: Usa ion-card dentro de columnas horizontales (scroll horizontal) para simular los tableros de Trello.
Para correr la aplicación:
code
Bash
ionic serve


Para ejecutar la base de datos localmente:
firebase emulators:start


VOY EN ESTE PASO:
•            Configurar la aplicación para ser compilada en Android e iOS usando Cordova.
En el chatGPT de mi correo principal

Construir tu app Angular

Primero compila tu app:

ionic build

PARA SINCRONIZAR CAMBIOS CON ANDROID

Cada vez que hagas cambios:

ionic cap sync

PARA FIREBASE CON FEATURE CONFIG
npm install firebase

Para las técnicas de optimización y rendimiento se intentó en muchos casos usar recursividad antes que ciclos for o while, se usaron componentes.
Para el manejo de la base de datos se usó córdova por requerimientos de la prueba pero se pensó en usar capacitor por mejor compatibilidad con 
mas versiones de java y otras tecnologías usadas en el proyecto.

PARA SINCRONIZAR EL PROYECTO CON EL APK GENERADO:
ionic build
cordova prepare android
cordova build android




VOY EN ESTOS PASOS PARA LA APK
🧠 2. FIRESTORE DEBE ESTAR ACTIVO

En Firebase Console:

👉 Firestore Database
👉 Debe estar creado ✔

Modo prueba:

👉 rules temporales:

allow read, write: if true;
🧠 3. REGLAS DE SEGURIDAD (MUY IMPORTANTE)

Si tienes esto:

allow read, write: if request.auth != null;

👉 En el celular NO tienes login → TODO falla ❌

✅ PARA PROBAR (temporal)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

👉 Luego: Publish

🧠 4. INTERNET EN ANDROID (CLAVE 🔥)
📁 AndroidManifest.xml

Ruta:

platforms/android/app/src/main/AndroidManifest.xml
🔧 Debe tener esto:
<uses-permission android:name="android.permission.INTERNET" />

👉 Si no está → NO conecta ❌

🧠 5. SI USAS EMULADOR FIREBASE (LOCAL)

👉 Esto es IMPORTANTÍSIMO

Si usabas:

'connectFirestoreEmulator'(firestore, 'localhost', 8080);

👉 En celular:

❌ NO funciona → localhost es el celular, no tu PC

✅ SOLUCIÓN

Reemplaza por tu IP:

connectFirestoreEmulator(firestore, '192.168.X.X', 8080);

👉 (IP de tu PC)

🧠 6. REVISA ERRORES EN CONSOLA

Conecta el celular y ejecuta:

adb logcat

👉 Busca errores como:

PERMISSION_DENIED
network error
firebase error
🧪 7. PRUEBA RÁPIDA

Agrega esto:

console.log('Intentando guardar tarea');

👉 Si no aparece → problema Angular
👉 Si aparece pero no guarda → problema Firebase

🚨 PROBLEMA MÁS COMÚN (TU CASO)

💥 Estás usando emulator local
💥 O reglas bloqueando
💥 O no tienes internet permiso