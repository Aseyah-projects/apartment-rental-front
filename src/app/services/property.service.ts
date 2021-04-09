import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private httpClient: HttpClient) {}
  getProperties() {
    return this.httpClient.post(`${environment.api}/api/apartment/index`, {});
  }
  getProperty(id: string | number) {
    return this.httpClient.get(`${environment.api}/api/apartment/${id}`);
  }
  updateProperty(id: string, property: any) {
    return this.httpClient.put(
      `${environment.api}/api/apartment/${id}`,
      property
    );
  }
  addProperty(property: any) {
    return this.httpClient.post(`${environment.api}/api/apartment`, property);
  }
  deleteProperty(id: string) {
    return this.httpClient.delete(`${environment.api}/api/apartment/${id}`);
  }
  addPropertyImage(images: any, id: string) {
    return this.httpClient.post(
      `${environment.api}/api/apartment/${id}/image`,
      images
    );
  }
}
