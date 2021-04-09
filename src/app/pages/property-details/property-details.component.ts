import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { PropertyService } from 'src/app/services/property.service';
import { UserBidService } from 'src/app/services/user-bid.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
})
export class PropertyDetailsComponent implements OnInit {
  id: any;
  property: any;
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userBidService: UserBidService,
    private customToastrService: CustomToastrService,
    private userService: UserService
  ) {
    this.id = this.route.snapshot.params.id;
  }

  getService() {
    this.propertyService.getProperty(this.id).subscribe((res: any) => {
      this.property = res;
    });
  }
  bid() {
    Swal.fire({
      title: 'Place Bid',
      html: `<input type="text" id="message" class="swal2-input" placeholder="Message" minLength="4" class="w-100">
            <input type="number" id="amount" class="swal2-input" placeholder="Amount" min=0 style="max-width:100%">
            <input type="date" id="start" class="swal2-input" placeholder="Start" min=0 style="max-width:100%">
            <input type="date" id="end" class="swal2-input" placeholder="End" min=0 style="max-width:100%">`,
      confirmButtonText: 'Confirm Bid',
      focusConfirm: false,
      preConfirm: () => {
        const message = (<HTMLInputElement>(
          Swal.getPopup()!.querySelector('#message')
        ))!.value;
        const amount = (<HTMLInputElement>(
          Swal.getPopup()!.querySelector('#amount')
        ))!.value;
        const start = (<HTMLInputElement>(
          Swal.getPopup()!.querySelector('#start')
        ))!.value;
        const end = (<HTMLInputElement>Swal.getPopup()!.querySelector('#end'))!
          .value;
        if (
          !message ||
          !amount ||
          !start ||
          !end ||
          Number.parseFloat(amount) <= 0
        ) {
          Swal.showValidationMessage(`Please enter message and amount`);
        }
        return {
          apartment_id: this.id,
          user_message: message,
          start,
          end,
          user_bid: amount,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.placeBid(result.value);
      }
    });
  }
  placeBid(bid: any) {
    this.userBidService.addBid(bid).subscribe(
      (res) => {
        this.customToastrService.showToast('Bid Placed', 'Success');
      },
      (err) => {
        let errMsg = '';
        for (const [key, value] of Object.entries(err?.error?.errors)) {
          errMsg = value as any;
          errMsg = errMsg[0];
          break;
        }
        this.customToastrService.showErrorToast(
          errMsg || "Couldn't Add Bid",
          'Failed'
        );
      }
    );
  }
  ngOnInit(): void {
    this.getService();
    this.userService.userSubject.subscribe((user) => {
      this.user = user;
    });
  }
}
