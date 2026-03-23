import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: Firestore) {}

  getCategories(): Observable<Category[]> {
    const ref = collection(this.firestore, 'categories');
    return collectionData(ref, { idField: 'id' }) as Observable<Category[]>;
  }

  addCategory(category: Category) {
    const ref = collection(this.firestore, 'categories');
    return addDoc(ref, category);
  }

  deleteCategory(id: string) {
    const ref = doc(this.firestore, `categories/${id}`);
    return deleteDoc(ref);
  }

  updateCategory(id: string, data: any) {
    const ref = doc(this.firestore, `categories/${id}`);
    return updateDoc(ref, data);
  }
}