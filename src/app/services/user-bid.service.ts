import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserBidService {
  constructor(private httpClient: HttpClient) {}

  getBids(): Observable<any> {
    return this.httpClient.get(`${environment.api}/api/rent/user`);
  }
  getBid(id: string) {
    return this.httpClient.get(`${environment.api}/api/rent/user/${id}`);
  }
  addBid(bid: { service_id: string; user_message: string; user_bid: number }) {
    return this.httpClient.post(
      `${environment.api}/api/rent/user/request`,
      bid
    );
  }
  acceptBid(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/user/accept/${id}`,
      {}
    );
  }
  pay(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/user/pay/${id}`,
      {}
    );
  }
  cancelBid(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/user/cancel/${id}`,
      {}
    );
  }
}
