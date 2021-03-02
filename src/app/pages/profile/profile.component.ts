import { Component, OnInit } from '@angular/core';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: any = {
    name: '',
    email: '',
    current_password: '',
  };
  password = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  };
  constructor(
    private userService: UserService,
    private customToastrService: CustomToastrService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.userService.getMe().subscribe((user: any) => {
      this.profile.name = user?.name;
      this.profile.email = user?.email;
    });
  }
  updateProfile(updatePassword = false) {
    let updatedData: any = updatePassword ? this.password : this.profile;

    this.userService.updateUser(updatedData).subscribe(
      (res: any) => {
        let msg = updatePassword ? 'Password Updated' : 'Profile Updated';

        this.customToastrService.showToast(msg, 'Updated');
        this.profile = {
          name: '',
          email: '',
          current_password: '',
        };
        this.password = {
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        };
        this.getProfile();
      },
      (err: any) => {
        let errMsg = '';
        for (const [key, value] of Object.entries(err?.error?.errors)) {
          errMsg = value as any;
          errMsg = errMsg[0];
          break;
        }
        this.customToastrService.showErrorToast(
          errMsg || "Couldn't Update Profile",
          'Failed'
        );
      }
    );
  }
}
