import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { UserBidService } from 'src/app/services/user-bid.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-bid',
  templateUrl: './user-bid.component.html',
  styleUrls: ['./user-bid.component.scss'],
})
export class UserBidComponent implements OnInit {
  bidSelectedSubject$ = new Subject<number>();
  refreshBidsSubject = new BehaviorSubject<boolean>(false);
  bidsData$: Observable<any> = this.userBidService.getBids().pipe(
    map((p) => {
      this.changeBidSelection(-1);
      return p.data;
    })
  );
  bids$ = this.refreshBidsSubject.asObservable().pipe(
    mergeMap(() => this.bidsData$),
    shareReplay(1)
  );

  selectedBid$ = combineLatest([this.bids$, this.bidSelectedSubject$]).pipe(
    map(([bids, selectedIndex]) => {
      return bids[selectedIndex];
    })
  );

  constructor(
    private userBidService: UserBidService,
    private customToastrService: CustomToastrService
  ) {}

  ngOnInit(): void {}
  cancelBid(bid: any) {
    this.userBidService.cancelBid(bid.id).subscribe(
      (res) => {
        this.customToastrService.showToast('Bid Cancelled', 'Success');
        this.refreshBidsSubject.next(true);
      },
      (err) => {
        this.customToastrService.showErrorToast(
          "Couldn't Cancel Bid",
          'Failed'
        );
      }
    );
  }
  changeBidSelection(index: number) {
    this.bidSelectedSubject$.next(index);
  }
  acceptBid(bid: any) {
    this.userBidService.acceptBid(bid.id).subscribe(
      (res) => {
        this.customToastrService.showToast('Bid Accepted', 'Success');
        this.refreshBidsSubject.next(true);
      },
      (err) => {
        this.customToastrService.showErrorToast(
          "Couldn't Accept Bid",
          'Failed'
        );
      }
    );
  }
  updateBid(bid: any) {
    Swal.fire({
      title: 'Place Bid',
      html: `<input type="text" id="message" class="swal2-input" placeholder="Message" minLength="4" class="w-100">
          <input type="number" id="amount" class="swal2-input" placeholder="Amount" min=0 style="max-width:100%">`,
      confirmButtonText: 'Confirm Bid',
      focusConfirm: false,
      preConfirm: () => {
        const message = (<HTMLInputElement>(
          Swal.getPopup()!.querySelector('#message')
        ))!.value;
        const amount = (<HTMLInputElement>(
          Swal.getPopup()!.querySelector('#amount')
        ))!.value;
        if (!message || !amount || Number.parseFloat(amount) <= 0) {
          Swal.showValidationMessage(`Please enter quota and reward name`);
        }
        return {
          service_id: bid.service.id,
          user_message: message,
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
        this.refreshBidsSubject.next(true);
      },
      (err) => {
        this.customToastrService.showErrorToast("Couldn't Add Bid", 'Failed');
      }
    );
  }
}
