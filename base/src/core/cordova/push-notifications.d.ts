/**
 * Created by Alex on 09/03/2016.
 */
declare module 'push-notifications'{
  import {RegistrationEventResponse, NotificationEventResponse} from "PhonegapPluginPush";
  export interface IPushReceiver{
    initialize();
    register();
    unregister();
    onRegistration(data: RegistrationEventResponse);
    onNotification(data: NotificationEventResponse);
    onError(error: Error);
  }

  export class PushReceiver implements IPushReceiver{
    initialize();
    register();
    unregister();
    onRegistration(data: RegistrationEventResponse);
    onNotification(data: NotificationEventResponse);
    onError(error: Error);
  }
}
