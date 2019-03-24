import { Component, Inject, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { CustomerService, LayoutService, LoadingService } from '@app/service';
import { BaseComponent } from '@app/class/base.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '@app/service/product.service';
import { Auction, Product } from '@app/interface';
import { IAppState } from '@app/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
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
        this.productService.fetchAll(auctionId).subscribe();
        this.products$ = this.ngRedux.select(['productAll', auctionId]);
      });
  }
}
