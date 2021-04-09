import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { CustomToastrService } from 'src/app/services/CustomToastr.service';
import { ProviderBidService } from 'src/app/services/provider-bid.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-received-bid',
  templateUrl: './received-bid.component.html',
  styleUrls: ['./received-bid.component.scss'],
})
export class ReceivedBidComponent implements OnInit {
  bidSelectedSubject$ = new Subject<number>();
  refreshBidsSubject = new BehaviorSubject<boolean>(false);
  bidsData$: Observable<any> = this.providerBidService.getBids().pipe(
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
    private providerBidService: ProviderBidService,
    private customToastrService: CustomToastrService
  ) {}

  ngOnInit(): void {}
  cancelBid(bid: any) {
    this.providerBidService.cancelBid(bid.id).subscribe(
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
    this.providerBidService.acceptBid(bid.id).subscribe(
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
          provider_message: message,
          provider_bid: amount,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.placeBid(result.value, bid.id);
      }
    });
  }
  placeBid(bid: any, id: string) {
    this.providerBidService.addBid(id, bid).subscribe(
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
