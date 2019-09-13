import { NgModule } from '@angular/core';
import { Routes,RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const appRoutes :Routes = [
  {path:'home',component: HomeComponent},
  {path:'', redirectTo:'/home',pathMatch:'full'},
  {path:'employees',loadChildren:'./employee/employee.module#EmployeeModule'},
  {path:'**',component:PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes,{preloadingStrategy:PreloadAllModules})
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
