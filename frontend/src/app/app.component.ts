import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(

    private apollo: Apollo
  ) {
    console.log(222);
  }

  ngOnInit() {

    this.apollo
      .subscribe({
        query: gql`
          subscription {
            messageAdded {
              type
              customerId
              title
              message
            }
          }
        `
      })
      .subscribe(({ data }) => {
        console.log(data);
      });
    this.get();
  }

  get() {
    this.apollo
      .watchQuery({
        query: gql`
          query {
            me{customerId}
          }
        `,
      })
      .valueChanges.subscribe(result => {
      console.log(result);
    });
  }
}
