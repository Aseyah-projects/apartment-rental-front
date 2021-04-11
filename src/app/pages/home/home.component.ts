import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  properties: any = null;
  user: any = null;
  constructor(
    private propertyService: PropertyService,
    private userService: UserService,
    private customToastrService: CustomToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProperties();
    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }
  getProperties(page: string = '1') {
    this.propertyService.getProperties(page).subscribe((res) => {
      this.properties = res;
    });
  }
  pageChanged(page: number) {
    this.getProperties(page.toString());
  }
  deleteProperty(property: any) {
    Swal.fire({
      title: `Are you sure you want to delete ${property?.title} property?`,
      showCancelButton: true,
      confirmButtonText: `Delete`,
      confirmButtonColor: '#FF1A5F',
    }).then((result) => {
      if (result.isConfirmed) {
        this.propertyService.deleteProperty(property.id).subscribe(
          (res) => {
            this.customToastrService.showToast('Property Deleted', 'Deleted');
            this.getProperties();
          },
          (err) => {
            this.customToastrService.showErrorToast(
              "Couldn't Delete Property",
              'Failed'
            );
          }
        );
      }
    });
  }
  openProperty(property: any) {
    this.router.navigate(['/properties', property.id]);
  }
}
