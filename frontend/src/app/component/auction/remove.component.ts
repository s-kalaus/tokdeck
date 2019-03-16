import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { Auction } from '@app/interface';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '@app/service/auction.service';
import { AlertService, LayoutService, LoadingService } from '@app/service';
import { catchError, first, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '@app/store';

@Component({
  selector: 'app-auction-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss'],
})
export class AuctionRemoveComponent extends BaseComponent {
  auction$: Observable<Auction>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auctionService: AuctionService,
    public loadingService: LoadingService,
    public layoutService: LayoutService,
    public alertService: AlertService,
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
        this.auctionService.fetchOne(auctionId).pipe(
          catchError((err) => {
            this.layoutService.processApiError(err);
            this.layoutService.navigate(['auction']);
            return of();
          }),
        ).subscribe();
        this.auction$ = this.ngRedux.select(['auctionOne', auctionId]);
      });
  }

  remove(auction: Auction) {
    this.auctionService.remove(auction.auctionId).pipe(
      catchError(err => this.layoutService.processApiError(err)),
    ).subscribe(() => this.onSuccess());
  }

  onSuccess() {
    this.alertService.show({ text: 'auction.remove.error.success', type: 'success' });
    this.layoutService.navigate(['auction']);
  }
}
