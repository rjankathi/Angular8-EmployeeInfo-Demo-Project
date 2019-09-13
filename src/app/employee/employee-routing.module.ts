import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { Routes } from '@angular/router';
import { ListEmployeesComponent } from './list-employees.component';
import { CreateEmployeeComponent } from './create-employee.component';

const empRoutes: Routes =[
    {path:'list',component: ListEmployeesComponent},
    {path:'create',component:CreateEmployeeComponent},
    {path:'edit/:id',component:CreateEmployeeComponent}
]
@NgModule({
    imports:[
        RouterModule.forChild(empRoutes)
    ],
    exports:[RouterModule]
})
export class EmployeeRoutingModule{

}