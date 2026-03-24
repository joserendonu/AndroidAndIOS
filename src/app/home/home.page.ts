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
import { RemoteConfigService } from '../services/remote-config.service';

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
  enableCategories = true;


  constructor(private todoService: Todo, private alertCtrl: AlertController,
    private categoryService: CategoryService, private remoteConfigService: RemoteConfigService) { }

  ngOnInit() {
    this.enableCategories = this.remoteConfigService.getBoolean('enable_categories');
    console.log("******************************");
    console.log('FLAG:', this.enableCategories);
    console.log(this.remoteConfigService.getBoolean('enable_categories'));
    this.todoService.getTasks().subscribe(res => {
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
  async openAddModal() {

    const title = prompt('Título de la tarea');
    if (!title) return;

    const description = prompt('Descripción de la tarea');
    if (!description) return;

    // 🔥 Mostrar categorías en texto
    const categoryList = this.categories
      .map((cat, index) => `${index + 1}. ${cat.name}`)
      .join('\n');

    const selected = prompt(`Selecciona categoría:\n${categoryList}`);

    if (!selected) return;

    const index = parseInt(selected) - 1;

    // 🔥 Validar índice
    if (isNaN(index) || !this.categories[index]) {
      console.log('Categoría inválida');
      return;
    }

    const categoryId = this.categories[index].id;

    // ✅ CREAR TAREA
    this.todoService.addTask({
      title,
      description,
      categoryId,
      completed: false,
      createdAt: Date.now(),
      priority: 'urgente',
      status: 'pendientes'
    });

    console.log('Tarea creada correctamente');
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