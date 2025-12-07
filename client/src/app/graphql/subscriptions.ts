import { $, Subscription } from '@gen';
import { gql } from 'apollo-angular';

export const onNotificationAdded = gql`
  subscription OnNotificationAdded {
    notificationAdded {
      id
      message
      read
      type
      createdAt
      actor {
        id
        username
        avatar
      }
      resourceId
    }
  }
`;
