import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { LoadingService } from '@app/service';
import { AuctionService } from '@app/service/auction.service';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { Auction } from '@app/interface';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '@app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auction-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class AuctionEditComponent extends BaseComponent {
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
