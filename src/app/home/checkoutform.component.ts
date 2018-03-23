import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, EmailValidator } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { HomeComponent } from './home.component';
function dateRangeValidator(c: AbstractControl):
{[key: string ]: boolean} | null {
    const startDtCntrl = c.get('startDate');
    const endDtCntrl = c.get('endDate');
    if (endDtCntrl.pristine || startDtCntrl.pristine) {
        return null;
    }
    if (new Date(endDtCntrl.value) < new Date(startDtCntrl.value)) {
        return {'range': true };
    }
    return null;
}

@Component({
  selector: 'pm-checkoutform',
  templateUrl: './checkoutform.component.html',
  styleUrls: ['./checkoutform.component.css']
})
export class CheckoutformComponent implements OnInit {
  display: boolean = false;
  error: any = {isError: false, errorMessage: ''};
  checkoutForm: FormGroup;
 // checkout: Checkout;
  errorMessage: string;
  servers: any[];
  selectedServer: any;

  get subOwnersGroup(): FormArray {
    return <FormArray>this.checkoutForm.get('subOwnersGroup');
}
public validationMessages: {
  required: 'Please enter you first name.'
  minlength: 'First Name must be 3 characters long.'
};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
        server: [],
        clientCode: ['', [ Validators.required, Validators.maxLength(4)]],
        firstName: ['', [ Validators.required]],
        lastName: ['', [ Validators.required]],
        department: ['', [ Validators.required]],
        dateRangeGroup: this.fb.group({
            startDate: ['', [ Validators.required]],
            endDate: ['', [ Validators.required]],
        }, {validator: dateRangeValidator}),
        email: ['', [Validators.email]],
        alert: true,
        permanent: false,
        addSubOwner: true,
        subOwnersGroup: this.fb.array([])
    });
    this.servers = [
        {name: 'UX04: PAS/HARP/CRM DEV', code: 'UX04'},
        {name: 'QXA: HARP Production', code: 'QXA'},
        {name: 'QXB: Quick Processing', code: 'QXB'},
        {name: 'QXC: Old Development', code: 'QXC'},
        {name: 'QXE: HP 3000 Development', code: 'QXE'},
        {name: 'UX02: Suprtool', code: 'UX02'}
    ];
    // Use this instead of (click)=toggleDisable() on checkbox element
    this.checkoutForm.get('permanent').valueChanges.subscribe(value => this.toggleDisable(value));
   // const firstnameControl = this.checkoutForm.get('firstName');
 //   firstnameControl.valueChanges.debounceTime(1000).subscribe(value =>
//             this.setMessage(firstnameControl));
}
save() {
    console.log(this.checkoutForm);
    console.log('Saved: ' + JSON.stringify(this.checkoutForm.value));
}
update(): void {
    this.checkoutForm.setValue({
        server: 'UX04',
        clientCode: 'FU',
        firstName: 'Thomas',
        lastName: 'Poti',
        department: 'Integrations',
        startDate: '01/01/2018',
        endDate: '12/31/2018',
        email: 'scotty2hotty@gmail.com',
        alert: true,
        permanent: false,
        addSubOwner: false
    });
}
toggleDisable(permanent: boolean): void {
    if (permanent) {
      this.checkoutForm.patchValue({
        startDate: '',
          endDate: ''});
      this.checkoutForm.get('dateRangeGroup.startDate').clearValidators();
      this.checkoutForm.get('dateRangeGroup.startDate').disable();
      this.checkoutForm.get('dateRangeGroup.endDate').clearValidators();
      this.checkoutForm.get('dateRangeGroup.endDate').disable();

    } else {
      this.checkoutForm.get('dateRangeGroup.startDate').setValidators(Validators.required);
      this.checkoutForm.get('dateRangeGroup.startDate').enable();
      this.checkoutForm.get('dateRangeGroup.endDate').setValidators(Validators.required);
      this.checkoutForm.get('dateRangeGroup.endDate').enable();
    }
    this.checkoutForm.get('dateRangeGroup.startDate').updateValueAndValidity();
    this.checkoutForm.get('dateRangeGroup.endDate').updateValueAndValidity();
}
setMessage(c: AbstractControl): void {
  this.errorMessage = '';
  if ((c.touched || c.dirty) && c.errors) {
      this.errorMessage = Object.keys(c.errors).map(key =>
     this.validationMessages[key]).join(' ');
  }
}
// Builds new instance of Form Group
buildSubOwner(): FormGroup {
    return this.fb.group({
        firstName: [ '', [Validators.required, Validators.minLength(3)]],
        lastName: [ '', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        alert: true
    });
}
// Adds new SubOwner to Form Array
addSubOwner(): void {
    this.subOwnersGroup.push(this.buildSubOwner());
}
    // Remove SubOwner from Form Array
removeSubOwner(): void {
    this.subOwnersGroup.removeAt(this.subOwnersGroup.length - 1);
}

}
