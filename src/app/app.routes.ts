import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { TaskComponent } from './task/task.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path: "", redirectTo: "/home", pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {path: "dashboard", component: DashboardComponent, canActivate: [authGuard]},
    {path: "task/:id", component: TaskComponent},
];
