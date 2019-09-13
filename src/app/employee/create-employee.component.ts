import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder, Validators, ValidationErrors, AbstractControl, FormControl, FormArray} from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm:FormGroup;
  employee: IEmployee;
  pageTitle:string;
   validationMessages = {
     'fullName' :{
       'required' : 'Full Name is required.',
       'minlength' : 'Full Name must be greater than 2 characters.',
       'maxlength': 'Full Name must be less than 10 characters'
      },
      'email' :{
        'required': 'Email is required.',
        'emailDomain':'Email domain should be sora.com'
      },
      'confirmEmail' :{
        'required': 'Confirm Email is required.',
        'emailDomain':'Confirm Email domain should be sora.com'
      },
      'emailGroup':{
        'emailMismatch':'Email and Confirm Email do not match'
      },
      'phone' :{
        'required': 'Phone is required.'
      },
      // 'skillName': {
      //   'required':'Skill Name is required.'
      // },
      // 'experienceInYears':{
      //   'required':'Experience is required.'        
      // },
      // 'proficiency':{
      //   'required':'Proficiency is required.'    
      // }
   };

   formErrors = {
    //  'fullName':'',
    //  'email': '',
    //  'confirmEmail': '',
    //  'emailGroup':'',
    //  'phone':'',
    //  'skillName':'',
    //  'experienceInYears':'',
    //  'proficiency':''
   }

  constructor(private fb:FormBuilder,
    private route:ActivatedRoute,
    private employeeService:EmployeeService,
    private _router: Router) { }

  ngOnInit() { 
    //creating forms using explicitly using new formgroup and new formcontrols
    // this.employeeForm = new FormGroup({
    //   fullName : new FormControl(),
    //   email: new FormControl(),
    //   //create skills nested form group 
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });

    // Creating forms using FormBuilder class
    this.employeeForm = this.fb.group({
      fullName: ['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
      contactPreference:['email'],
      emailGroup: this.fb.group({
        email: ['',[Validators.required,CustomValidators.emailDomain('sora.com')]],
        confirmEmail:['',Validators.required],
      },{validator: MatchEmails}),
      phone:[''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      console.log(data);
      this.onContactPreferenceChange(data);
    });

    this.employeeForm.valueChanges.subscribe((data: any)  =>{
       //this.fullNameLength = value.length;
       this.logValidationErrors(this.employeeForm);
    });

    this.route.paramMap.subscribe(params =>{
      const empId = +params.get('id')
      if(empId){
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else{
        this.pageTitle = 'Create Employee';
         this.employee = {
           id:null,
           fullName :'',
           contactPreference:'',
           email:'',
           phone:null,
           skills:[]
         };
      }
    })
  }
  getEmployee(empId: number) {
     this.employeeService.getEmployee(empId).subscribe((employee:IEmployee) =>{
        {
          this.editEmployee(employee);
          this.employee = employee
        }
        (err:any) => console.log(err);
     });
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName : employee.fullName,
      contact: employee.contactPreference,
      emailGroup: {
         email : employee.email,
         confirmEmail : employee.email
      },
      phone:employee.phone
    });

    this.employeeForm.setControl('skills',this.setExistingFormGroup(employee.skills))

  }
  setExistingFormGroup(skillSets: import("./ISkill").ISkill[]): AbstractControl {
    const formArray = new FormArray([]);
    skillSets.forEach(s=>{
      formArray.push(this.fb.group({
         skillName: s.skillName,
         experienceInYears:s.experienceInYears,
         proficiency:s.proficiency
      }));
    });
    return formArray;
  }

  addSkillFormGroup() : FormGroup{
    return this.fb.group({
      skillName : ['',Validators.required],
      experienceInYears: ['',Validators.required],
      proficiency :['',Validators.required]
   })
  }

  addSkillButtonClick():void{
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  //Dynamically add or remove validators
  onContactPreferenceChange(selectedValue: string){
    const phoneFormControl = this.employeeForm.get('phone');
    if(selectedValue === 'phone'){
      phoneFormControl.setValidators(Validators.required);
    } else if( selectedValue === 'email'){
      phoneFormControl.clearValidators();
    }

    phoneFormControl.updateValueAndValidity(); //updateValueAndValidity allows you to modify the value of one or 
    //more form controls and the flag allows you to specify if you want this to emit the value to valueChanges subscribers.
  }
  
  logValidationErrors(group: FormGroup = this.employeeForm): void{
    Object.keys(group.controls).forEach((key:string)=>{
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
        if(abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')){
          const messages = this.validationMessages[key];

          for (const errorKey in abstractControl.errors){
            if(errorKey){
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
      }

      if(abstractControl instanceof FormGroup){
        this.logValidationErrors(abstractControl);
      } 

      // if(abstractControl instanceof FormArray){
      //   for (const control of abstractControl.controls){
      //     if(control instanceof FormGroup){
      //       this.logValidationErrors(control);
      //     }
      //   }
      // } 
  });  
}

  onSubmit():void{
    this.mapFormValuesToEmployeeModel();
    if(this.employee.id){
    this.employeeService.updateEmployee(this.employee).subscribe(
      () => this._router.navigate(['/employees']),
      (err:any) => console.log(err)
    );
    } else{
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this._router.navigate(['/employees']),
        (err:any) => console.log(err)
      )
    }
  }

  mapFormValuesToEmployeeModel(){
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  loadData():void {
    // this.employeeForm.patchValue({
    //   fullName: "SoRa Inc.",
    //   email: "mail@sorainc.com",
    //   skills:{
    //       skillName: 'C#',
    //       experienceInYears:9,
    //       proficiency:'beginner'
    //   }
    // })
    
    //this.logValidationErrors(this.employeeForm);
    //console.log(this.formErrors)

    //We can either use a formarray or formgroup to create form controls
    const formArray1 = this.fb.array([
      new FormControl('John',Validators.required),
      new FormControl('IT',Validators.required),
      new FormControl('',Validators.required),
    ]);
    console.log(formArray1);

    const formGroup = this.fb.group([
      new FormControl('John',Validators.required),
      new FormControl('IT',Validators.required),
      new FormControl('',Validators.required),
    ]);
    //When to use FormGroup and FormArray?
    //A formarray data is serialized as array where as a formgroup is serialized as an object
    //A Form arraytracks controls as part of an array and is very useful when we want to generate dynamic formgroup and form controls 
    console.log(formGroup);

  }

  removeSkillClick(skillGroupIndex: number):void {
    const skillsFormArray = (<FormArray>this.employeeForm.get('skills'));
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAllAsTouched();
  }
}

function MatchEmails(group:AbstractControl): {[key:string]:any} | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if(emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine &&
    confirmEmailControl.value === '')){
    return null;    
  } else {
    return {'emailMismatch': true};
  }
}

