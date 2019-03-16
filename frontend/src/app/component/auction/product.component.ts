import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { Auction } from '@app/interface';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '@app/service/auction.service';
import { LoadingService } from '@app/service';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '@app/store';

@Component({
  selector: 'app-auction-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class AuctionProductComponent extends BaseComponent {
  auction$: Observable<Auction>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auctionService: AuctionService,
    public loadingService: LoadingService,
    private ngRedux: NgRedux<IAppState>,
  ) {
    super();
  }

  init() {
    this.activatedRoute.params
      .pipe(
        first(),
        map(params => params.auctionId),
      )
      .subscribe((auctionId) => {
        this.auctionService.fetchOne(auctionId).subscribe();
        this.auction$ = this.ngRedux.select(['auctionOne', auctionId]);
      });
  }
}
