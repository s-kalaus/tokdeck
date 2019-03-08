import { OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
export class BaseComponent implements OnInit, OnDestroy {

  ngOnInit() {

    this.init();
  }

  ngOnDestroy() {

    this.destroy();
  }

  init() {
  }

  destroy() {
  }
}
