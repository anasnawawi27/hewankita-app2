import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encription.service';
import { ToastService } from './toast.service';

@Injectable()
export class ApiService {
  private accessToken = localStorage.getItem('token')
    ? this._encriptionService.decryption(
        JSON.parse(localStorage.getItem('token') ?? '')
      )
    : '';

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private _encriptionService: EncryptionService
  ) {}

  setHeader() {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.accessToken,
      'Access-Control-Allow-Origin': '*',
    });
  }

  find(endpoint: string, params: any): Observable<{ results: [] }> {
    return this.http.get<{ results: [] }>(environment.apiUrl + endpoint, {
      headers: this.setHeader(),
      params,
    });
  }

  get(endpoint: string, params: any) {
    return this.http.get<any>(environment.apiUrl + endpoint, {
      headers: this.setHeader(),
      params,
    });
  }

  post(endpoint: string, data: any, withHeader = true) {
    const headers = withHeader ? this.setHeader() : {};
    return this.http.post<any>(environment.apiUrl + endpoint, data, {
      headers: headers,
    });
  }

  login(endpoint: string, data: any) {
    return this.http.post<any>(environment.apiUrl + endpoint, data);
  }

  put(endpoint: string, data: any) {
    return this.http.put<any>(environment.apiUrl + endpoint, data, {
      headers: this.setHeader(),
    });
  }

  patch(endpoint: string, data: any) {
    return this.http.patch<any>(environment.apiUrl + endpoint, data, {
      headers: this.setHeader(),
    });
  }

  delete(endpoint: string, data: any) {
    return this.http.delete<any>(environment.apiUrl + endpoint, {
      headers: this.setHeader(),
      params: data,
    });
  }

  async getComponents(param: string){
    return await lastValueFrom(
      this.get(param, {})
    ).then((res) => {
      let data = []
      if(res.statusCode == 200) data = res.data;
      return data
    }).catch((err) => {
      this.toast.handleError(err)
    })
  }
}
