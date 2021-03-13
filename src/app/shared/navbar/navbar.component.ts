import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  activeUser: any = null;
  loaded = false;
  constructor(private userService: UserService) {}
  logout() {
    this.userService.logout();
  }

  ngOnInit(): void {
    this.userService.userSubject.subscribe((res: any) => {
      this.activeUser = res;
      this.loaded = true;
    });
  }
}
