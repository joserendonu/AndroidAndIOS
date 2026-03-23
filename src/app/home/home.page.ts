import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
// , IonButton 
import { Todo } from '../services/todo';
import { Task } from '../models/task.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    NgFor,
    NgIf,
    RouterLink
  ],
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit {
  categories: Category[] = [];
  tasks: Task[] = [];

  constructor(private todoService: Todo, private alertCtrl: AlertController,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.todoService.getTasks().subscribe(res => {
      console.log("******************************");
      console.log(this.tasks);
      console.log(this.categories);
      this.tasks = res;
    });

    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;

      // 🔥 CREAR POR DEFECTO SI NO HAY
      if (res.length === 0) {
        this.createDefaultCategories();
      }
    });
  }

  createDefaultCategories() {
    const defaults = [
      { name: 'Urgente', createdAt: Date.now() },
      { name: 'Secundaria', createdAt: Date.now() },
      { name: 'Largo Plazo', createdAt: Date.now() }
    ];

    defaults.forEach(cat => {
      this.categoryService.addCategory(cat);
    });
  }
  getTasksByPriority(priority: string) {
    return this.tasks.filter(t => t.priority === priority);
  }

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'urgente': return 'danger';
      case 'secundaria': return 'warning';
      case 'largo-plazo': return 'success';
      default: return 'medium';
    }
  }
  async selectCategory(data: any) {

    const alert = await this.alertCtrl.create({
      header: 'Selecciona Categoría',

      inputs: this.categories.map(cat => ({
        name: 'category',
        type: 'radio',
        label: cat.name,
        value: cat.id
      })),

      buttons: [
        {
          text: 'Guardar',
          handler: (categoryId) => {

            // 🔥 VALIDACIÓN
            if (!categoryId) {
              console.log('No seleccionó categoría');
              return false;
            }

            // ✅ CREAR TAREA
            this.todoService.addTask({
              title: data.title,
              description: data.description,
              categoryId: categoryId, // 👈 CLAVE
              completed: false,
              createdAt: Date.now(),
              priority: 'urgente',
              status: 'pendientes'
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
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
          handler: (data) => this.selectCategory(data) // 👈 CAMBIO
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

  toggleTask(task: Task) {
    this.todoService.updateTaskStatus(task.id!, !task.completed);
  }
}