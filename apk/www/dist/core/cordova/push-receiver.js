"use strict";
var PushEvents = (function () {
    function PushEvents() {
    }
    PushEvents.registration = 'registration';
    PushEvents.notification = 'notification';
    PushEvents.error = 'error';
    return PushEvents;
}());
var PushReceiver = (function () {
    function PushReceiver() {
        this._options = {
            android: {
                senderID: '158532792965',
                sound: true,
                vibrate: true,
                clearNotifications: false
            }
        };
    }
    Object.defineProperty(PushReceiver.prototype, "puller", {
        get: function () {
            return this._puller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PushReceiver.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    PushReceiver.prototype.initialize = function () {
        var _this = this;
        document.addEventListener('deviceready', (function () {
            _this._puller = window.PushNotification.init(_this._options);
            _this.register();
        }).bind(this));
    };
    PushReceiver.prototype.register = function () {
        this._puller.on(PushEvents.registration, this.onRegistration.bind(this));
        this._puller.on(PushEvents.notification, this.onNotification.bind(this));
        this._puller.on(PushEvents.error, this.onError.bind(this));
    };
    PushReceiver.prototype.unregister = function () {
        this._puller.unregister(function () {
            console.log('Push Notifications unregistered');
        });
    };
    PushReceiver.prototype.onRegistration = function (data) {
        console.log(data.registrationId);
    };
    PushReceiver.prototype.onNotification = function (data) {
        console.log(data.title);
        console.log(data.message);
        alert(data.title + " Message: " + data.message);
    };
    PushReceiver.prototype.onError = function (error) {
        console.log(error);
    };
    return PushReceiver;
}());
exports.PushReceiver = PushReceiver;
//# sourceMappingURL=push-receiver.js.map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS9jb3Jkb3ZhL3B1c2gtcmVjZWl2ZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzIjpbImNvcmUvY29yZG92YS9wdXNoLXJlY2VpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFNQTtJQUFBO0lBSUEsQ0FBQztJQUhlLHVCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCLHVCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCLGdCQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hDLGlCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDtJQVlFO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsY0FBYztnQkFHeEIsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLElBQUk7Z0JBQ2Isa0JBQWtCLEVBQUUsS0FBSzthQUMxQjtTQUNGLENBQUE7SUFDSCxDQUFDO0lBdEJELHNCQUFJLGdDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGlDQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQWtCRCxpQ0FBVSxHQUFWO1FBQUEsaUJBS0M7UUFKQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEMsS0FBSSxDQUFDLE9BQU8sR0FBUyxNQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsaUNBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsSUFBK0I7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELHFDQUFjLEdBQWQsVUFBZSxJQUErQjtRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxZQUFZLEdBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCw4QkFBTyxHQUFQLFVBQVEsS0FBWTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUF6REQsSUF5REM7QUF6RFksb0JBQVksZUF5RHhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSBBbGV4IG9uIDA4LzAzLzIwMTYuXHJcbiAqL1xyXG5pbXBvcnQge0luaXRPcHRpb25zLCBOb3RpZmljYXRpb25FdmVudFJlc3BvbnNlLCBSZWdpc3RyYXRpb25FdmVudFJlc3BvbnNlLCBQdXNoTm90aWZpY2F0aW9ufSBmcm9tICdQaG9uZWdhcFBsdWdpblB1c2gnO1xyXG5pbXBvcnQge0lQdXNoUmVjZWl2ZXJ9IGZyb20gXCJwdXNoLW5vdGlmaWNhdGlvbnNcIjtcclxuXHJcbmNsYXNzIFB1c2hFdmVudHN7XHJcbiAgcHVibGljIHN0YXRpYyByZWdpc3RyYXRpb24gPSAncmVnaXN0cmF0aW9uJztcclxuICBwdWJsaWMgc3RhdGljIG5vdGlmaWNhdGlvbiA9ICdub3RpZmljYXRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgZXJyb3IgPSAnZXJyb3InO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHVzaFJlY2VpdmVyIGltcGxlbWVudHMgSVB1c2hSZWNlaXZlcntcclxuICBnZXQgcHVsbGVyKCk6UHVzaE5vdGlmaWNhdGlvbntcclxuICAgIHJldHVybiB0aGlzLl9wdWxsZXI7XHJcbiAgfVxyXG5cclxuICBnZXQgb3B0aW9ucygpOkluaXRPcHRpb25ze1xyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9wdWxsZXI6IFB1c2hOb3RpZmljYXRpb247XHJcbiAgcHJpdmF0ZSBfb3B0aW9uczogSW5pdE9wdGlvbnM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICB0aGlzLl9vcHRpb25zID0ge1xyXG4gICAgICBhbmRyb2lkOiB7XHJcbiAgICAgICAgc2VuZGVySUQ6ICcxNTg1MzI3OTI5NjUnLFxyXG4gICAgICAgIC8vaWNvbjogJycsXHJcbiAgICAgICAgLy9pY29uQ29sb3I6ICcnLFxyXG4gICAgICAgIHNvdW5kOiB0cnVlLFxyXG4gICAgICAgIHZpYnJhdGU6IHRydWUsXHJcbiAgICAgICAgY2xlYXJOb3RpZmljYXRpb25zOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKCl7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VyZWFkeScsICgoKT0+e1xyXG4gICAgICB0aGlzLl9wdWxsZXIgPSAoPGFueT53aW5kb3cpLlB1c2hOb3RpZmljYXRpb24uaW5pdCh0aGlzLl9vcHRpb25zKTtcclxuICAgICAgdGhpcy5yZWdpc3RlcigpO1xyXG4gICAgfSkuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlcigpe1xyXG4gICAgdGhpcy5fcHVsbGVyLm9uKFB1c2hFdmVudHMucmVnaXN0cmF0aW9uLCB0aGlzLm9uUmVnaXN0cmF0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5fcHVsbGVyLm9uKFB1c2hFdmVudHMubm90aWZpY2F0aW9uLCB0aGlzLm9uTm90aWZpY2F0aW9uLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5fcHVsbGVyLm9uKFB1c2hFdmVudHMuZXJyb3IsIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHVucmVnaXN0ZXIoKXtcclxuICAgIHRoaXMuX3B1bGxlci51bnJlZ2lzdGVyKCgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ1B1c2ggTm90aWZpY2F0aW9ucyB1bnJlZ2lzdGVyZWQnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25SZWdpc3RyYXRpb24oZGF0YTogUmVnaXN0cmF0aW9uRXZlbnRSZXNwb25zZSl7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhLnJlZ2lzdHJhdGlvbklkKTtcclxuICB9XHJcblxyXG4gIG9uTm90aWZpY2F0aW9uKGRhdGE6IE5vdGlmaWNhdGlvbkV2ZW50UmVzcG9uc2Upe1xyXG4gICAgY29uc29sZS5sb2coZGF0YS50aXRsZSk7XHJcbiAgICBjb25zb2xlLmxvZyhkYXRhLm1lc3NhZ2UpXHJcbiAgICBhbGVydChkYXRhLnRpdGxlK1wiIE1lc3NhZ2U6IFwiICtkYXRhLm1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgb25FcnJvcihlcnJvcjogRXJyb3Ipe1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=
