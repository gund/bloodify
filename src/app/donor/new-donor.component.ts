/**
 * Created by alex on 6/7/16.
 */

import { Component, Output, Input, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/compiler/src/facade/async';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PopupComponent } from '../popup/popup.component';
import { Donor, createDonor, Coords } from './donor.store';
import { DonorService } from './donor.service';

@Component({
  selector: 'bdfy-new-donor',
  providers: [],
  directives: [PopupComponent],
  template: require('./new-donor.html')
})
export class NewDonorComponent implements OnInit {
  @Input() show: BehaviorSubject<boolean>;
  @Input() coords: Coords;
  @Input() address: string;
  @Input() useDonor = new BehaviorSubject(null);
  @Output() donorAdd = new EventEmitter<Donor>();
  @Output() donorAdded = new EventEmitter<Donor>();

  phoneRegex = '^(\+|00)[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}\s?[0-9]{3}$';
  emailRegex = '/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/';

  showPopup = new BehaviorSubject(false);
  newDonor: Donor = createDonor();
  donorFormActive = true;
  isSaving = false;
  isSaved = false;
  isEditing = false;
  createdHash: string;

  constructor(protected donorService: DonorService) {
  }

  ngOnInit(): any {
    this.show
      .distinctUntilChanged()
      .do(val => this.showPopup.next(val))
      .partition(val => val)[0] // Chain for all `true` values
      .subscribe(() => this.resetDonorForm());
  }

  closePopup() {
    this.show.next(false);
  }

  resetDonorForm() {
    this.donorFormActive = false;
    this.isSaved = false;
    setTimeout(() => this.donorFormActive = true);

    let donor = this.useDonor.getValue();

    if (donor) {
      this.isEditing = true;
      this.newDonor = Object.assign({}, donor);
    } else {
      this.isEditing = false;
      this.newDonor = createDonor();
    }
  }

  submit() {
    this.newDonor.coord = this.coords;
    this.newDonor.address = this.address;

    this.isSaving = true;

    this.donorService.saveDonor(this.newDonor).then(
      (donor: Donor) => {
        this.isSaved = true;
        this.isSaving = false;
        this.createdHash = donor.hash;
        this.donorAdded.emit(this.newDonor);
      }
    ).catch(
      () => this.isSaving = false
    );

    this.donorAdd.emit(this.newDonor);
  }
}
