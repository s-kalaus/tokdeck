import { Routes } from '@angular/router';
import { ErrorComponent } from '@app/component/error.component';
import { DashboardComponent } from '@app/component/dashboard/dashboard.component';
import { AuthRouteService } from '@app/service';
import { AuctionComponent } from '@app/component/auction/auction.component';
import { BotComponent } from '@app/component/bot/bot.component';
import { SubscriptionComponent } from '@app/component/subscription/subscription.component';
import { AuctionListComponent } from '@app/component/auction/list.component';
import { AuctionAddComponent } from '@app/component/auction/add.component';
import { AuctionEditComponent } from '@app/component/auction/edit.component';
import { AuctionShowComponent } from '@app/component/auction/show.component';
import { AuctionProductComponent } from '@app/component/auction/product.component';
import { AuctionRemoveComponent } from '@app/component/auction/remove.component';
import { SignupComponent } from '@app/component/signup.component';
import { SigninComponent } from '@app/component/signin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthRouteService] },
  { path: 'auction', component: AuctionComponent, canActivate: [AuthRouteService], children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: AuctionListComponent },
    { path: 'add', component: AuctionAddComponent },
    { path: 'edit/:auctionId', component: AuctionEditComponent },
    { path: 'show/:auctionId', component: AuctionShowComponent },
    { path: 'product/:auctionId', component: AuctionProductComponent },
    { path: 'remove/:auctionId', component: AuctionRemoveComponent },
  ] },
  { path: 'bot', component: BotComponent, canActivate: [AuthRouteService] },
  { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthRouteService] },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: ErrorComponent },
];
