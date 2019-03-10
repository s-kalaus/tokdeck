import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { Auction } from '@app/interface';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '@app/service/auction.service';
import { LoadingService } from '@app/service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-auction-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class AuctionProductComponent extends BaseComponent {
  auction: Auction;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auctionService: AuctionService,
    public loadingService: LoadingService,
  ) {
    super();
  }

  init() {
    this.activatedRoute.params
      .pipe(
        map(params => Number(params.auctionId)),
      )
      .subscribe(auctionId => this.auctionService.fetchOne(auctionId).subscribe());

    this.subscriptions.push(
      this.auctionService.auction$.subscribe(auction => this.auction = auction),
    );
  }
}
