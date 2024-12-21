import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';
import { TaskProps } from '../dashboard/dashboard.component';

export type UserProp = {
  uid: string;
  email: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService  {
  app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  auth = getAuth(this.app);


  constructor() {}

  // Função que puxa o total de comentarios e o total de tarefas para exibir na home

  async getTotals() {
    try {
      const tasksRef = collection(this.db, 'tasks');
      const commentsRef = collection(this.db, 'comments');

      const tasksSnapshot = await getDocs(tasksRef);
      const commentsSnapshot = await getDocs(commentsRef);

      return {
        tasks: tasksSnapshot.size,
        comments: commentsSnapshot.size,
      };
      
    } catch (error) {
      console.error('Erro ao buscar dados no Firestore:', error);
      throw error;
    }
  }

  // Funções referentes ao usuário

  async registerUser(email: string, password: string) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log("USUARIO CRIADO!");
      return user.user
    }
    catch(error) {
      console.log("Erro ao cadastrar usuário: ", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("USUARIO LOGADO!");
      return user.user
    }
    catch(error) {
      console.log("Erro ao logar usuário: ", error);
      throw error;
    }
  }

  logoutUser = async () => {
    try {
      await signOut(this.auth);
      console.log("Usuário deslogado com sucesso.");
    } catch (error) {
      console.error("Erro ao deslogar usuário:", error);
      throw error;
    }
  };

  observeUser = (callback: (user: UserProp | null) => void) => {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("Usuário logado:");
      } else {
        console.log("Nenhum usuário logado.");
      }
      callback(user);
    });
  };

  // Funções referentes as tarefas 

  async addTask(task: Partial<TaskProps>) {
    try {
      const tasksRef = collection(this.db, 'tasks');
      await addDoc(tasksRef, task);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  }
  
  async deleteTask(taskId: string) {
    try {
      const taskRef = doc(this.db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }
  
  async getUserTasks(userEmail: string): Promise<TaskProps[]> {
    try {
      const tasksRef = collection(this.db, 'tasks');
      const tasksQuery = query(
        tasksRef,
        where('user', '==', userEmail),
        orderBy('created', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TaskProps[];
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
  }

  async getTaskById(taskId: string) {
    try {
      const taskDoc = doc(this.db, 'tasks', taskId);
      return await getDoc(taskDoc);
    } catch (error) {
      console.error('Erro ao obter tarefa:', error);
      throw error;
    }
  }

  // Funções referentes aos comentários

  async getCommentsByTaskId(taskId: string) {
    try {
      const commentsQuery = query(collection(this.db, 'comments'), where('taskId', '==', taskId));
      return await getDocs(commentsQuery);
    } catch (error) {
      console.error('Erro ao obter comentários:', error);
      throw error;
    }
  }

  async addComment(commentData: any) {
    try {
      return await addDoc(collection(this.db, 'comments'), commentData);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string) {
    try {
      const commentDoc = doc(this.db, 'comments', commentId);
      await deleteDoc(commentDoc);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      throw error;
    }
  }
  

}
