import { Component } from '@angular/core';
import { BaseComponent } from '@app/class/base.component';
import { Auction } from '@app/interface';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '@app/service/auction.service';
import { AlertService, LayoutService, LoadingService } from '@app/service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-auction-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss'],
})
export class AuctionRemoveComponent extends BaseComponent {
  auction: Auction;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auctionService: AuctionService,
    public loadingService: LoadingService,
    public layoutService: LayoutService,
    public alertService: AlertService,
  ) {
    super();
  }

  init() {
    this.activatedRoute.params
      .pipe(
        map(params => Number(params.auctionId)),
      )
      .subscribe((auctionId) => {
        this.auctionService.fetchOne(auctionId).pipe(
          catchError((err) => {
            this.layoutService.processApiError(err);
            this.layoutService.navigate(['auction']);
            return of();
          }),
        ).subscribe();
      });

    this.subscriptions.push(
      this.auctionService.auction$.subscribe(auction => this.auction = auction),
    );
  }

  remove() {
    this.auctionService.remove(this.auction.auctionId).pipe(
      catchError(err => this.layoutService.processApiError(err)),
    ).subscribe(() => this.onSuccess());
  }

  onSuccess() {
    console.log(111);
    this.alertService.show({ text: 'auction.remove.error.success', type: 'success' });
    this.layoutService.navigate(['auction']);
  }
}
