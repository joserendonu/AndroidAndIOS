import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class Todo {
  constructor(private firestore: Firestore) { }

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

  updateTaskStatus(id: string, completed: boolean) {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return updateDoc(taskDocRef, { completed: completed });
  }
}