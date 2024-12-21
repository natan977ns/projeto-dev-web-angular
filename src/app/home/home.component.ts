import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  posts: number = 0;
  comments: number = 0;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    try {
      const totals = await this.firebaseService.getTotals();
      this.posts = totals.tasks | 0;
      this.comments = totals.comments | 0;
    }
    catch(error) {
      console.log("Erro ao carregar dados: ", error);
    }
  }
}
