import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list-assigned',
    loadChildren: () => import('./list-assigned/list-assigned.module').then(m => m.ListAssignedPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./logout/logout.module').then(m => m.LogoutPageModule)
  },
  {
    path: 'todo-creation',
    loadChildren: './todo-creation/todo-creation.module#TodoCreationPageModule' ,
    canActivate: [AuthGuard]
  },
  {
    path: 'list-assigned',
    loadChildren: './list-assigned/list-assigned.module#ListAssignedPageModule' ,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule' ,
    canActivate: [AuthGuard]
  },
  {
    path: 'appointment-creation',
    loadChildren: './appointment/appointment-creation/appointment-creation.module#AppointmentCreationPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'appointment-edit',
    loadChildren: './appointment/appointment-edit/appointment-edit.module#AppointmentEditPageModule' ,
    canActivate: [AuthGuard]
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
