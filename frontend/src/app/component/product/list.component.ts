import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { LayoutService, LoadingService } from '@app/service';
import { BaseComponent } from '@app/class/base.component';
import { ProductService } from '@app/service/product.service';
import { Product } from '@app/interface';
import { IAppState } from '@app/store';
import { Observable } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ProductListComponent extends BaseComponent {
  auctionId: string;
  products$: Observable<Product[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public layoutService: LayoutService,
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
        this.auctionId = auctionId;
        this.productService.fetchAll(auctionId).pipe(
          catchError(err => this.layoutService.processApiError(err)),
        ).subscribe();
        this.products$ = this.ngRedux.select(['productAll', auctionId]);
      });
  }
}
