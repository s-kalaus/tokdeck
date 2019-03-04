import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import {UserService} from './user.service';
import { OperationDefinitionNode } from 'graphql';

const uri = 'https://tokdeck.kalaus.ru/graphql';
const uriSubscription = 'wss://tokdeck.kalaus.ru/subscriptions';

export function createApollo(httpLink: HttpLink, userService: UserService) {
  const linkHttp = httpLink.create({uri});
  const auth = setContext(() => {
    return {
      headers: {
        authorization: `Bearer ${userService.getToken()}`
      }
    };
  });

  const linkSubscription = new WebSocketLink({
    uri: uriSubscription,
    options: {
      reconnect: true,
      connectionParams: () => {
        return {
          authorization: `Bearer ${userService.getToken()}`,
        };
      }
    }
  });

  userService.subscriptionClient = (<any>linkSubscription).subscriptionClient;

  const link = split(
    ({ query }) => {
      const { kind, operation } = (getMainDefinition(query) as OperationDefinitionNode);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    linkSubscription,
    auth.concat(linkHttp),
  );
  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, UserService],
    },
  ],
})
export class GraphQLModule {}
