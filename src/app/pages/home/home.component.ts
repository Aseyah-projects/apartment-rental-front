import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserService } from 'src/app/services/user.service';

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
  getProperties() {
    this.propertyService.getProperties().subscribe((res) => {
      this.properties = res;
    });
  }
  deleteProperty(property: any) {
    if (confirm(`Are you sure you want to delete ${property?.title} property?`))
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
  openProperty(property: any) {
    this.router.navigate(['/properties', property.id]);
  }
}
