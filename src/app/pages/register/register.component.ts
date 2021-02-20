import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user = {
    email: '',
    password: '',
    password_confirmation: '',
    name: '',
  };
  constructor(private _UserService: UserService, protected router: Router) {}

  ngOnInit(): void {}
  register(form: NgForm) {
    this._UserService.register(this.user).subscribe(
      (res) => {},
      (err) => {
        alert(err.error.message);
      }
    );
  }
}
