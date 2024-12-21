import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService, UserProp } from '../services/firebase.service';
import { TextareaComponent } from '../textarea/textarea.component';
import { MatIconModule } from '@angular/material/icon';

type CommentProps = {
  id: string;
  comment: string;
  name: string;
  photo: string;
  taskId: string;
  user: string;
}

type TaskProps = {
  item: {
      taskId: string;
      user: string;
      created: string;
      task: string;
      public: boolean;
  },
  allComments: CommentProps[]
}

@Component({
    selector: 'app-task',
    imports: [TextareaComponent, MatIconModule],
    templateUrl: './task.component.html',
    styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit{

  taskId!: string;
  item: TaskProps['item'] = { taskId: '', user: '', created: '', task: '', public: false }; 
  input: string = '';
  comments: CommentProps[] = []; 
  session: UserProp | null = null;

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router
      ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
          this.observeUser();
            this.taskId = params.get('id') || '';
            if (this.taskId) {
              this.loadTaskData();
              this.loadComments();
            }
          });
    }

    observeUser() {
        this.firebaseService.observeUser(user => {
          this.session = user;
        });
    }

    handleChangeInput(event: { text: string} ) {
      this.input = event.text;
    }  

    loadTaskData() {
        this.firebaseService.getTaskById(this.taskId).then(taskDoc => {
            if (taskDoc.exists()) {
              this.item = taskDoc.data() as TaskProps['item'];
            }
            else {
              this.router.navigate(['/home']);
            }
        }).catch(error => {
          console.error("Erro ao carregar dados da tarefa:", error)
          this.router.navigate(['/home']);
          alert("Tarefa não encontrada!");
        })
    }

    loadComments() {
    this.firebaseService.getCommentsByTaskId(this.taskId).then(commentsSnapshot => {
      this.comments = commentsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as CommentProps[];
    }).catch(error => console.error("Erro ao carregar comentários:", error));
    }

    handleComment(event: Event) {
        event.preventDefault();
        if (this.input.trim()) {
          this.firebaseService.addComment({
            taskId: this.taskId,
            user: this.session?.email,
            comment: this.input,
            createdAt: new Date(),
            name: this.session?.email,
            photo: 'link_da_foto_perfil'
          }).then(() => {
            this.input = '';
            this.loadComments();
          }).catch(error => console.error("Erro ao adicionar comentário:", error));
        }
    }

    handleDeleteComment(commentId: string) {
        this.firebaseService.deleteComment(commentId).then(() => {
          this.loadComments();
        }).catch(error => console.error("Erro ao deletar comentário:", error));
    }

}
