import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CustomToastrService {
  constructor(public toastr: ToastrService) {}

  showErrorToast(msg: string, title: string, options: any = null) {
    return this.toastr.error(msg, title, {
      positionClass: 'toast-top-right',
      timeOut: 4000,
      ...options,
    });
  }
  showToast(msg: string, title: string, options: any = null) {
    return this.toastr.info(msg, title, {
      positionClass: 'toast-top-right',
      timeOut: 4000,
      ...options,
    });
  }
}
