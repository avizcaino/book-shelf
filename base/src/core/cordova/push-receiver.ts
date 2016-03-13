/**
 * Created by Alex on 08/03/2016.
 */
import {InitOptions, NotificationEventResponse, RegistrationEventResponse, PushNotification} from 'PhonegapPluginPush';
import {IPushReceiver} from "push-notifications";

class PushEvents{
  public static registration = 'registration';
  public static notification = 'notification';
  public static error = 'error';
}

export class PushReceiver implements IPushReceiver{
  get puller():PushNotification{
    return this._puller;
  }

  get options():InitOptions{
    return this._options;
  }

  private _puller: PushNotification;
  private _options: InitOptions;

  constructor(){
    this._options = {
      android: {
        senderID: '158532792965',
        //icon: '',
        //iconColor: '',
        sound: true,
        vibrate: true,
        clearNotifications: false
      }
    }
  }

  initialize(){
    document.addEventListener('deviceready', (()=>{
      this._puller = (<any>window).PushNotification.init(this._options);
      this.register();
    }).bind(this));
  }

  register(){
    this._puller.on(PushEvents.registration, this.onRegistration.bind(this));
    this._puller.on(PushEvents.notification, this.onNotification.bind(this));
    this._puller.on(PushEvents.error, this.onError.bind(this));
  }

  unregister(){
    this._puller.unregister(() => {
      console.log('Push Notifications unregistered');
    });
  }

  onRegistration(data: RegistrationEventResponse){
    console.log(data.registrationId);
  }

  onNotification(data: NotificationEventResponse){
    console.log(data.title);
    console.log(data.message)
    alert(data.title+" Message: " +data.message);
  }

  onError(error: Error){
    console.log(error);
  }
}
