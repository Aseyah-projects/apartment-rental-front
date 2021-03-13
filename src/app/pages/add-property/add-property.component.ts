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
    images: new FormControl(null),
  });
  imagesSelected: any[] = [];

  constructor(
    private propertyService: PropertyService,
    private customToastrService: CustomToastrService
  ) {}

  ngOnInit(): void {}

  getImages(event: Event) {
    let imagesList = (<HTMLInputElement>event?.target)?.files;
    let imagesCount: number = imagesList?.length ?? [].length;
    if (imagesCount > 0) {
      for (let i = 0; i < imagesCount; i++) {
        this.readImage((<FileList>imagesList)[i]);
      }
    }
  }
  readImage(image: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.imagesSelected.push(reader.result);
    };
  }
  addProperty() {
    let newPropery = Object.assign({}, this.propertyForm.value);
    newPropery.images = this.imagesSelected;
    this.propertyService.addProperty(newPropery).subscribe(
      (res) => {
        this.customToastrService.showToast('Property Added.', 'Added');
        this.propertyForm.reset();
      },
      (err) => {
        this.customToastrService.showToast(`Couldn't Add Property.`, 'Failed');
      }
    );
  }
}
