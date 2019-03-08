import { Injectable } from '@angular/core';
import * as Noty from 'noty';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {
    Noty.overrideDefaults({
      theme: 'bootstrap-v4',
      timeout: 2000,
      layout: 'topRight',
      closeWith: [
        'click',
        'button',
      ],
    });
  }

  public show(options: any) {
    const data = Object.assign({}, options);
    if (!data.type) {
      data.type = 'error';
    }
    new Noty(data).show();
  }
}
