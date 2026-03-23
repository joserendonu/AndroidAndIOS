export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: 'urgente' | 'secundaria' | 'largo-plazo';
  status: 'pendientes' | 'en-proceso' | 'completadas';
  createdAt: number;
  completed?: boolean;
  categoryId?: string;
}