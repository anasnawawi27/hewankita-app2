import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { banks } from './banks';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private endpoint: string = 'settings'
  public loading: boolean = true;

  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  public input: any = {
    bank_account: null,
    bank_account_logo: null,
    bank_account_name: null,
    bank_account_number: null,
    service_fee: null,
  }

  public openModalBank: boolean = false;
  public bankOptions = [...banks]
  public bankOptionsTemp = [...banks]

  constructor(
    private _apiService: ApiService,
    private toast: ToastService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getSettings()
  }

  getSettings(){
    lastValueFrom(
      this._apiService.get(this.endpoint, {})
    ).then((res) => {
      if(res.statusCode == 200){
        const data = res.data;

        for (const key in this.input) {
          const find = _.find(data, (d) => d.key == key);
          if(find){
            this.input[key] = find.value;
            if(key == 'service_fee'){
              this.input[key] = parseInt(find.value.replace('%', ''));
              console.log(this.input[key])
            }
          }
        }
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.loading = false
    })
  }

  onSave(){
    this.formSubmitted = true;
    if(
      !this.input.bank_account ||
      !this.input.bank_account_logo ||
      !this.input.bank_account_name ||
      !this.input.bank_account_number ||
      !this.input.service_fee
    ) return

    this.formLoading = true;

    const keys = []
    const values = []
    for (const key in this.input) {
      keys.push(key);
      values.push(key == 'service_fee' ? (this.input[key] + '%') : this.input[key]);
    }
    const payload = { keys: JSON.stringify(keys), values: JSON.stringify(values) }
    lastValueFrom(
      this._apiService.put(this.endpoint, payload)
    ).then((res) => {
      if(res.statusCode == 200){
        this.toast.success(res.message)
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  back(){
    this.navController.back();
  }

  onSearchBank(event: any) {
    if (event.target.value) {
      const val = event.target.value.toLowerCase();
      const temp = this.bankOptionsTemp.filter(function (d: any) {
        return (
          d.name.toLowerCase().indexOf(val) !== -1 || !val
        );
      });

      this.bankOptions = temp;
    } else {
      this.bankOptions = this.bankOptionsTemp;
    }
  }

}
