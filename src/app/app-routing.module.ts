import { NgModule } from '@angular/core';
import { Routes,RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { CustomPreloadingService } from './custom-preloading.service';

const appRoutes :Routes = [
  {path:'home',component: HomeComponent},
  {path:'', redirectTo:'/home',pathMatch:'full'},
  {path:'employees', data:{ preload:true }, loadChildren:'./employee/employee.module#EmployeeModule'},
  {path:'**',component:PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes,{preloadingStrategy:CustomPreloadingService})
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
