import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: '',
  };
  constructor(private userService: UserService) {}

  ngOnInit(): void {}
  login(form: NgForm) {
    this.userService.login(this.user).subscribe(
      (res: any) => {},
      (err: any) => {
        alert('User is not found');
      }
    );
  }
}
