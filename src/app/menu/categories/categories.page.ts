import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { ToastService } from 'src/services/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ApiService]
})
export class CategoriesPage implements OnInit {

  private endpoint: string = 'category';

  public name: string = '';
  public id: number = 0;
  public isEdit: boolean = false;
  public isInit: boolean = true;
  public loading: boolean = true;
  public openForm: boolean = false;
  public rows: Array<any> = [];

  public formLoading: boolean = false;
  public formSubmitted: boolean = false;

  public disabled: boolean = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private _apiService: ApiService,
    private toast: ToastService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getList();
  }

  onSave(){
    this.formSubmitted = true;
    if(!this.name) return

    this.formLoading = true;
    lastValueFrom(
      !this.isEdit ? 
      this._apiService.post(this.endpoint, { name: this.name }) :
      this._apiService.put(this.endpoint + '/' + this.id, { name: this.name })
    ).then((res) => {
      if(res.statusCode == 201 || res.statusCode == 200){
        this.toast.success(res.message);
        this.openForm = false;
        this.isInit = true;
        this.getList();
      } else {
        this.toast.error(res.message)
      }
    }).catch((err) => {
      this.toast.handleError(err)
    }).finally(() => {
      this.formLoading = false
    })
  }

  onCreate(){
    this.isEdit = false;
    this.name = '';
    this.openForm = true;
  }

  onEdit(category: any){
    this.isEdit = true;
    this.id = category.id
    this.name = category.name;
    this.openForm = true;
  }

  delete(){
      this.toast.loading('Mohon Tunggu...');
      lastValueFrom(
        this._apiService.delete(this.endpoint + '/' + this.id, {})
      ).then((res) => {
        if(res.statusCode == 200){
          this.toast.success(res.message);
          this.rows = _.filter(this.rows, (d) => d.id !== this.id);
          this.openForm = false
        } else {
          this.toast.error(res.message);
        }
      }).catch((err) => {
        this.toast.handleError(err)
      }).finally(() => {
        this.toast.close('loading')
      })
  }

  async onDelete(){
    const confirm = await this.alertController.create({
      mode: 'ios',
      header: 'Anda Yakin ?',
      subHeader: 'Kategori akan dihapus',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          },
        },
        {
          text: 'Lanjutkan',
          role: 'confirm',
          handler: () => {
            this.delete()
          },
        },
      ]
    })

    await confirm.present();
  }

  refreshPage(event: any) {
    this.isInit = true;
    this.getList(true, event);
  }

  async getList(refresh = false, refreshEvent: any = null) {
    if (this.isInit) {
      this.loading = true;
    }

    await lastValueFrom(
      this._apiService.get(this.endpoint, {}),
    )
      .then((res) => {
        if (res.statusCode === 200) {
          this.rows = this.isInit
            ? res.rows
            : [...this.rows, ...res.rows];

          if (this.isInit) {
            this.isInit = false;
          }
          if (refresh) {
            refreshEvent.target.complete();
          }
        }
      })
      .catch((err) => {
        console.log(err)
        this.toast.handleError(err)
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async presentActionSheet(row: any) {
    this.id = row.id
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Action',
      mode: 'md',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
              this.onEdit(row)
          },
        },
        {
          text: 'Hapus',
          icon: 'trash',
          handler: () => {
            this.onDelete()
          },
        },
        {
          text: 'Batal',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  back(){
    this.navController.back();
  }

}
