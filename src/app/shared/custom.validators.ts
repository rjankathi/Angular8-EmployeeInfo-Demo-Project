import {AbstractControl} from '@angular/forms';
//Custom validator in three steps
//1. Create the custom validator function
//2. attach the custom validator to the control you want to validate
//3. display the validation error
export class CustomValidators {
    //parameterizing custom validators using the closure: 
//Closures: function inside another function 
//Inner function has access to the outer functions variables and parameters in addition to its own variables and parameters
static emailDomain(domainName: string) {
    return (control: AbstractControl) : { [key:string]: any} | null => {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@')+1);
  
    if(email === '' || domain.toLowerCase() === domainName.toLowerCase()){
      return null;
    }else {
      return {'emailDomain':true};
    }
   };
  }
}