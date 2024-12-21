import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { TextareaComponent } from '../textarea/textarea.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule} from "@angular/material/icon";

export type TaskProps = {
  id: string;
  task: string;
  public: boolean;
  user: string | null;
  created: Date;
};

@Component({
    selector: 'app-dashboard',
    imports: [TextareaComponent, FormsModule, RouterModule, MatIconModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  input: string = '';
  publicTask: boolean = false;
  tasks: TaskProps[] = [];
  userEmail: string | null = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.observeUser((user) => {
      this.userEmail = user?.email || null;
      if (this.userEmail) {
        this.loadTasks();
      }
    });
  }

  handleChangePublic(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.publicTask = checkbox.checked;
  }

  handleChangeInput(event: { text: string} ) {
    this.input = event.text;
  }

  async handleRegisterTask(event: Event) {
    event.preventDefault();
    if (this.input === '') return;

    try {
      const taskData = {
        task: this.input,
        public: this.publicTask,
        user: this.userEmail,
        created: new Date(),
      };
      await this.firebaseService.addTask(taskData);
      this.input = '';
      this.publicTask = false;
      this.loadTasks();
    } catch (error) {
      console.error('Erro ao registrar tarefa:', error);
    }
  }

  async handleDeleteTask(id: string) {
    try {
      await this.firebaseService.deleteTask(id);
      this.tasks = this.tasks.filter((task) => task.id !== id);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }

  async handleShare(id: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/task/${id}`);
      alert('URL copiada com sucesso!');
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
    }
  }

  async loadTasks() {
    try {
      if (!this.userEmail) return;
      const tasks = await this.firebaseService.getUserTasks(this.userEmail);
      this.tasks = tasks;
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }


}
