import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, EmailValidator } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { BootstrapOptions } from '@angular/core/src/application_ref';

// PrimeNg
import {OverlayPanel} from 'primeng/primeng';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

// React
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Checkout } from './checkout';
import { CheckoutService } from './checkout.service';
import { Owner } from './owner';


// Validates Date Fields
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
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servers: any[];
  selectedServer: any;
  errorMessage: any;
  growlMessage: any;
  display: boolean = false;
  selectedOwners: Owner[];
  ownersList: Owner[];
  checkouts: Checkout[];
  checkout: Checkout;
  lastSort: string;
  filteredCheckouts: Checkout[];
  server: string;
  today: string;
  disabled: boolean = false;
  test: string;
  _listFilter: string;
  public get listFilter(): string {
    return this._listFilter;
  }

  public set listFilter(value: string) {
    this._listFilter = value;
                            // If _listFilter exist than performFilter() else display full list of checkouts
    this.filteredCheckouts = this._listFilter ? this.performFilter(this.listFilter) : this.checkouts;
  }


  error: any = {isError: false, errorMessage: ''};
  checkoutForm: FormGroup;
  formTitle: string;

  get owners(): FormArray {
    return <FormArray>this.checkoutForm.get('owners');
}
  get existingOwnersGroup(): FormArray {
    return <FormArray>this.checkoutForm.get('owners');
}

  constructor(private checkoutService: CheckoutService,
              private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private messageService: MessageService ) {
  }

  ngOnInit() {

  // SelectItem API with label-value pairs
  this.servers = [
    {name: 'UX04: PAS/HARP/CRM DEV', code: 'UX04'},
    {name: 'QXA: HARP Production', code: 'QXA'},
    {name: 'QXB: Quick Processing', code: 'QXB'},
    {name: 'QXC: Old Development', code: 'QXC'},
    {name: 'QXE: HP 3000 Development', code: 'QXE'},
    {name: 'UX02: Suprtool', code: 'UX02'}
];
    this.today = this.getTodaysDate();
  /*  this.sub = this.route.params.subscribe(
      params => {
        let id = +params['id'];
        this.getCheckouts();
      }
    );
    */
    this.checkoutService.getAllCheckouts()
              .subscribe(checkouts => {
                this.checkouts = checkouts;
                this.filteredCheckouts = this.checkouts;
              });
    this.checkoutForm = this.fb.group({
      server: [],
      clientCode: ['', [ Validators.required, Validators.maxLength(4)]],
      dateRangeGroup: this.fb.group({
          startDate: ['', [ Validators.required]],
          endDate: ['', [ Validators.required]],
      }, {validator: dateRangeValidator}),
      permanent: false,
      jira: [],
      hdEvent: [],
      notes: [],
      owners: this.fb.array([])
  });
  this.checkoutForm.get('permanent').valueChanges.subscribe(value => this.toggleDisable(value));
  this.checkoutForm.get('owners.client').valueChanges.subscribe(value => this.toggleClient(value));
  }

  getServerCheckouts(server): void {
   this.server = server;
  }

// handles all filtering results
  performFilter(filterBy: string): Checkout[] {
    filterBy = filterBy.toLocaleLowerCase();
          return this.checkouts.filter((checkout: Checkout) =>
          checkout.clientCode.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
          checkout.startDate.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
          checkout.endDate.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
          checkout.jira.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
          checkout.hdEvent.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
          checkout.owners.some((owner: Owner) => owner.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1)  ||
          checkout.owners.some((owner: Owner) => owner.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1)   ||
          checkout.owners.some((owner: Owner) => owner.department.toLocaleLowerCase().indexOf(filterBy) !== -1) ||
          checkout.owners.some((owner: Owner) => owner.email.toLocaleLowerCase().indexOf(filterBy) !== -1));
  }
  // determines if DB is checked out
  isCheckedout(startDate, endDate, permanent: Boolean): boolean {
    const sDate = Date.parse(startDate);
    const tDate = Date.parse(this.today);
    const eDate = Date.parse(endDate);
 
    if (permanent) {
      return true;
    }
    if (sDate <= tDate && eDate >= tDate) {
      return true;
    } else {
      return false;
    }
}

getTodaysDate(): string {
return new Date().toLocaleDateString();
}
 // Toggles Diaglog Display
showDialog() {
  this.display =  !this.display;
}

// Retrieves checkout by ID
getCheckout(id: string): void {
  this.checkoutService.getCheckout(id)
      .subscribe(
          (checkout: Checkout) => this.onCheckoutRetrieved(checkout),
          (error: any) => this.showGrowl('error', 'Error', error)
      );
}
// Fires after checkout is retrieved
onCheckoutRetrieved(checkout: Checkout): void {
  if (this.checkoutForm) {
      this.checkoutForm.reset();
  }
  this.checkout = checkout;
  this.ownersList = checkout.owners;
console.log('Checkout ID: ' + this.checkout.id);
// Checkout id = 0 signifies a new checkout
 if (this.checkout.id === 0) {

     this.enableForm('Add');
     // Clears out Owners Array
     this.checkoutForm.setControl('owners', this.fb.array([]));
     this.addOwner();
  } else {
    this.formTitle = 'Display';
    // Update the data on the form
    this.checkoutForm.patchValue({
      id: this.checkout.id,
      server: this.checkout.server,
      clientCode: this.checkout.clientCode,
      dateRangeGroup: {startDate: this.checkout.startDate, endDate: this.checkout.endDate },
      permanent: this.checkout.permanent,
      jira: this.checkout.jira,
      hdEvent: this.checkout.hdEvent,
      notes: this.checkout.notes
      });
    this.setOwners(this.ownersList);
    this.disableForm();
  }

  this.display = true;

}
enableForm(title: string): void {
    this.formTitle = title;
    this.checkoutForm.enable();
    this.disabled = false;
}
disableForm(): void {
  this.checkoutForm.disable();
  this.disabled = true;
  this.checkoutForm.get('dateRangeGroup.startDate').disable();
  this.checkoutForm.get('dateRangeGroup.endDate').disable();
}
saveCheckout() {
  this.primaryOwnerValidator();
  console.log(this.checkoutForm);
  console.log('Saved: ' + JSON.stringify(this.checkoutForm.value));

  if (this.checkoutForm.dirty && this.checkoutForm.valid) {
    // Copy the form values over the product object values
    const c = Object.assign({}, this.checkout, this.checkoutForm.value);
    const sdate = new Date(this.checkoutForm.get('dateRangeGroup.startDate').value);
    const edate = new Date(this.checkoutForm.get('dateRangeGroup.endDate').value);
    c.startDate = (sdate.getMonth() + 1) + '/' + sdate.getDate() + '/' +  sdate.getFullYear();
    c.endDate = (edate.getMonth() + 1) + '/' + edate.getDate() + '/' +  edate.getFullYear();
    this.checkoutService.saveCheckout(c)
        .subscribe(
            () => this.refreshCheckouts(),
            (error: any) => this.showGrowl('error', 'Error', error)
        );
        this.showDialog();
        this.showGrowl('success', 'Success', 'New Checkout Record Added!');
} else if (!this.checkoutForm.dirty) {
    // this.onSaveComplete();
}
}
primaryOwnerValidator() {
  const c = Object.assign({}, this.checkout, this.checkoutForm.value);
  
 const test: Owner[] =  c.owners.find((owner: Owner) => owner.primary);
}

editCheckout(): void {
  const p = Object.assign({}, this.checkout, this.checkoutForm.value);
  this.checkoutService.saveCheckout(p)
    .subscribe(
      () => this.refreshCheckouts(),
      (error: any) => this.showGrowl('error', 'Error', error)
    );
}
cancelCheckout() {
  if (this.checkoutForm.dirty) {
  confirm('Are you sure you want to cancel and lose unsaved changes?');
  this.showDialog();
  } else {
    this.showDialog();
  }
}
removeCheckout( id: number ): void {
  this.checkoutService.deleteCheckout( Number( this.checkout.id ))
  .subscribe(
    () => this.refreshCheckouts(),
    (error: any) => this.showGrowl('error', 'Error', error)
  );
  this.showDialog();
  this.showGrowl('success', 'Success', 'Checkout Record has succesfully been removed!');
}
toggleClient(client: boolean): void {
  if (client) {
// logic to disable and clear fistname, lastname, email, and email alerts
this.checkoutForm.get('owners.firstName').clearValidators();
this.checkoutForm.get('owners.firstName').disable();
this.checkoutForm.get('owners.lastName').clearValidators();
this.checkoutForm.get('owners.lastName').disable();
this.checkoutForm.get('owners.email').clearValidators();
this.checkoutForm.get('owners.email').disable();
this.checkoutForm.get('owners.department').clearValidators();
this.checkoutForm.get('owners.department').disable();
  } else {

  }
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
setOwners(owners: Owner[]) {
  const ownerFGs = owners.map(owner => this.fb.group(owner));
  const ownerFormArray = this.fb.array(ownerFGs);
  this.checkoutForm.setControl('owners', ownerFormArray);
}
// Builds new instance of Form Group
buildOwner(): FormGroup {
  return this.fb.group({
      firstName: [ '', [Validators.required]],
      lastName: [ '', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
      department: [''],
      alert: true,
      primary: [false, []]
  });
}

refreshCheckouts() {
  this.checkoutService.getAllCheckouts()
  .subscribe(checkouts => {
    this.checkouts = checkouts;
    this.filteredCheckouts = this.checkouts;
  });
}
// Adds Owner to Form Array
addOwner(): void {
  this.owners.push(this.buildOwner());
}
  // Remove Owner from Form Array
removeOwner(): void {
  if (this.owners.length > 1) {
    this.owners.removeAt(this.owners.length - 1);
    this.checkoutForm.markAsDirty();
  }

}
viewSubOwners(event, subowners: Owner[], overlaypanel: OverlayPanel) {
  this.selectedOwners = subowners.filter((owner: Owner) => !owner.primary);
  overlaypanel.toggle(event);
}
toggle(tog: boolean): void {
  tog = !tog;
  this.checkoutForm.patchValue({
    alert: tog
  });
}
onChange() {
  console.log(this.selectedServer.code);
  if (this.selectedServer) {
    this.checkoutService.getCheckoutsByServer(this.selectedServer.code)
              .subscribe(checkouts => {
                this.checkouts = checkouts;
                this.filteredCheckouts = this.checkouts;
              });
            }
}
confirm(type: string) {
  switch (type) {
    case 'cancel':
    if (this.checkoutForm.dirty) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to cancel and lose all changes?',
        header: 'Unsaved Changes',
        accept: () => {
         this.showDialog();
        }
    });
    } else {
      this.showDialog();
    }
  break;
    case 'remove' :
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this checkout record?',
      header: 'Delete Checkout',
      accept: () => {
        this.removeCheckout(this.checkout.id);
      }
  });
    break;
  }

}
showGrowl(severtity: string, summary: string, detail: string) {
  this.messageService.add({severity: severtity, summary: summary, detail: detail});
}

sort(column: string): void {
  switch ( column ) {
case 'Client Code':
    if (this.lastSort === 'cc_asc') {
      this.lastSort = 'cc_desc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => b.clientCode.localeCompare(a.clientCode));
    } else if (this.lastSort === 'cc_desc') {
      this.lastSort = 'cc_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.clientCode.localeCompare(b.clientCode));
    } else {
      this.lastSort = 'cc_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.clientCode.localeCompare(b.clientCode));
    }
    break;
case 'Date Range':
    if (this.lastSort === 'dr_asc') {
      this.lastSort = 'dr_desc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.permanent ? 1 : -1 );
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => b.startDate < a.startDate ? 1 : -1 );
    } else if (this.lastSort === 'dr_desc') {
      this.lastSort = 'dr_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.permanent ? 1 : -1 );
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.startDate < b.startDate ? 1 : -1 );
    } else {
      this.lastSort = 'dr_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.permanent ? 1 : -1 );
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.startDate < b.startDate ? 1 : -1 );
    }
    break;
case 'Checkout Status':
    if (this.lastSort === 'cs_asc') {
      this.lastSort = 'cs_desc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout) =>
                             (!this.isCheckedout(a.startDate, a.endDate, a.permanent) ? 1 : -1 ));
    } else if (this.lastSort === 'cs_desc') {
      this.lastSort = 'cs_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout) =>
                             (this.isCheckedout(a.startDate, a.endDate, a.permanent) ? 1 : -1 ));
    } else {
      this.lastSort = 'cs_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout) =>
                             (this.isCheckedout(a.startDate, a.endDate, a.permanent) ? 1 : -1 ));

    }
    break;
case 'Jira Issue':
    if (this.lastSort === 'ji_asc') {
      this.lastSort = 'ji_desc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => b.jira.localeCompare(a.jira));
    } else if (this.lastSort === 'ji_desc') {
      this.lastSort = 'ji_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.jira.localeCompare(b.jira));
    } else {
      this.lastSort = 'ji_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.jira.localeCompare(b.jira));
    }
    break;
case 'HD Event':
    if (this.lastSort === 'he_asc') {
      this.lastSort = 'he_desc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => b.hdEvent < a.hdEvent ? 1 : -1 );
    } else if (this.lastSort === 'he_desc') {
      this.lastSort = 'he_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.hdEvent < b.hdEvent ? 1 : -1 );
    } else {
      this.lastSort = 'he_asc';
      this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.hdEvent < b.hdEvent ? 1 : -1 );
    }
    break;
case 'Primary Owner':
    if (this.lastSort === 'po_asc') {
 //     this.lastSort = 'po_desc';
 //     this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout) =>
 //     a.owners.((c: Owner, d: Owner) => c.firstName.localeCompare(d.firstName))
    } else if (this.lastSort === 'po_desc') {
 //     this.lastSort = 'po_asc';
   //   this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => b.hdEvent < a.hdEvent ? 1 : -1 );
    } else {
     // this.lastSort = 'po_asc';
     // checkout.owners.some((owner: Owner) => owner.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1)
    }
   // this.filteredCheckouts = this.filteredCheckouts.sort((a: Checkout, b: Checkout) => a.clientCode.localeCompare(b.de));
    break;
  }
}
}


