import { Component, OnInit } from '@angular/core';
import { UserProp } from '../services/firebase.service';
import { FirebaseService } from "../services/firebase.service";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  user: UserProp | null = null;
  loading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.observeUser((user) => {
      this.user = user;
      this.loading = false;
    });
  }

 async register(): Promise<void> {
    const email = prompt('Digite seu e-mail:');
    const password = prompt('Digite sua senha:');

    if (!email || !password) {
      alert('Por favor, insira seu e-mail e senha.');
      return;
    }
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    // Validação da senha
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await this.firebaseService.registerUser(email, password);
      this.user = userCredential;
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar. Verifique as informações.');
  }
}


  async login(): Promise<void> {
    const email = prompt('Digite seu e-mail:');
    const password = prompt('Digite sua senha:');

    if (!email || !password) return;

    try {
      const userCredential = await this.firebaseService.login(email, password);
      this.user = userCredential;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.firebaseService.logoutUser();
      this.user = null;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
