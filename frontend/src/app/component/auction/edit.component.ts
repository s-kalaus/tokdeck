import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { LoadingService } from '@app/service';
import { AuctionService } from '@app/service/auction.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Auction } from '@app/interface';

@Component({
  selector: 'app-auction-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class AuctionEditComponent extends BaseComponent {
  private auction: Auction;

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
