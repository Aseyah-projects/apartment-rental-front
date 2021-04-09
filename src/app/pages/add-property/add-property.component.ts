import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
})
export class AddPropertyComponent implements OnInit {
  propertyForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    images: new FormControl([]),
  });
  imagesSelected: any = {};

  constructor(
    private propertyService: PropertyService,
    private customToastrService: CustomToastrService
  ) {}

  ngOnInit(): void {}

  selectFiles(event: any) {
    const files = event.target.files;
    this.imagesSelected = files;
  }
  addProperty() {
    let body = Object.assign({}, this.propertyForm.value);
    const formData = new FormData();
    for (let i = 0; i < this.imagesSelected?.length; i++)
      formData.append(`images[${i}]`, this.imagesSelected[i]);

    let uploadingToastr = this.customToastrService.showToast(
      'Deleting Image...',
      'Please Wait',
      {
        disableTimeOut: true,
      }
    );
    this.propertyService.addProperty(body).subscribe(
      (res: any) => {
        this.customToastrService.showToast('Property Added.', 'Added');
        this.propertyService.addPropertyImage(formData, res.id).subscribe(
          (res) => {
            this.customToastrService.toastr.clear(uploadingToastr.toastId);
            this.customToastrService.showToast('Image(s) Uploaded', 'Success');
          },
          (err) => {
            this.customToastrService.toastr.clear(uploadingToastr.toastId);

            this.customToastrService.showErrorToast(
              'Fail in Image(s) Upload.',
              'Failed'
            );
          }
        );
        this.propertyForm.reset();
        this.imagesSelected = [];
      },
      (err) => {
        this.customToastrService.showToast(`Couldn't Add Property.`, 'Failed');
      }
    );
  }
}
