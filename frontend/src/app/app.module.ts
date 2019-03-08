import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';

import { AppComponent } from '@app/component/app.component';
import { ErrorComponent } from '@app/component/error.component';
import { DashboardComponent } from '@app/component/dashboard/dashboard.component';
import { routes } from '@app/data/routes';

export function tokenGetter() {
  return null;
}

@NgModule({
  declarations: [
    ErrorComponent,
    AppComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GraphQLModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
    RouterModule.forRoot(routes),
  ],
  providers: [
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
