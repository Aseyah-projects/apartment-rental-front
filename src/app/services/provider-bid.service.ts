import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderBidService {
  constructor(private httpClient: HttpClient) {}

  getBids(): Observable<any> {
    return this.httpClient.get(`${environment.api}/api/rent/provider`);
  }
  getBid(id: string) {
    return this.httpClient.get(`${environment.api}/api/rent/provider/${id}`);
  }
  addBid(id: string, bid: { provider_message: string; provider_bid: number }) {
    return this.httpClient.post(
      `${environment.api}/api/rent/provider/${id}`,
      bid
    );
  }
  cancelBid(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/provider/cancel/${id}`,
      {}
    );
  }
  acceptBid(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/provider/accept/${id}`,
      {}
    );
  }
  completeJob(id: string) {
    return this.httpClient.post(
      `${environment.api}/api/rent/provider/complete/${id}`,
      {}
    );
  }
}
