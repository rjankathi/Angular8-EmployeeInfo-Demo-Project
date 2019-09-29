import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {RxFormsValidationModule} from 'ng-rxforms-validation';

@NgModule({
  declarations: [],
  imports: [
    
  ],
  exports:[CommonModule,ReactiveFormsModule,RxFormsValidationModule]
})
export class SharedModule { }
