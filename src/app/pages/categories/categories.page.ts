import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { NgFor } from '@angular/common';
import { IonContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.page.html',
  imports: [
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    NgFor,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle]
})
export class CategoriesPage implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addCategory() {
    const name = prompt('Nombre de la categoría');
    if (name) {
      this.categoryService.addCategory({
        name,
        createdAt: Date.now()
      });
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }
}