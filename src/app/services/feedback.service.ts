import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private httpClient: HttpClient) {}
  rate(rating: number, id: string | number) {
    return this.httpClient.post(
      `${environment.api}/api/apartment/${id}/feedback`,
      { rating }
    );
  }
}
