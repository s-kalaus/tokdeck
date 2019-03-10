import { Component, Inject } from '@angular/core';

import { CustomerService, LayoutService, LoadingService } from '@app/service';
import { BaseComponent } from '@app/class/base.component';
import { TranslateService } from '@ngx-translate/core';
import { AuctionService } from '@app/service/auction.service';
import { Auction } from '@app/interface';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-auction-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class AuctionListComponent extends BaseComponent {
  auctions: Auction[] = [];

  constructor(
    private auctionService: AuctionService,
    public layoutService: LayoutService,
    public loadingService: LoadingService,
  ) {
    super();
  }

  init() {
    this.auctionService.fetchAll().subscribe();
    this.subscriptions.push(
      this.auctionService.auctions$.subscribe(auctions => this.auctions = auctions),
    );
  }
}
