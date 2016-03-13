/**
 * Created by alexvizcaino on 10/3/16.
 */
var gcm = require('node-gcm');

var message = new gcm.Message();

message.addNotification({
    "body": "this is notification",
    "title": "New notification",
    "icon": "myicon"
});

message.addData('key', 'msg');

var regTokens = ['d_vmlwTR154:APA91bGR_5Cc0ukY7HufO-nAnMKF2kSTSbqRtqTFMPF0yCN7ra1NW3339McxEgIISvoyqzOhRlDdwt9RkFTGEZXngjOpN6238F9vs92DBReaPJ0lhFNCDENXPZ8NyqoPzZcQ3yTxvGzG'];
var sender = new gcm.Sender('AIzaSyCNrubXlovvA-rtrtX8SVKXGMFE1aS6HSY');

sender.send(message, {registrationTokens: regTokens}, function(err, response){
    if(err) console.error(err);
    else console.log(response);
});

sender.sendNoRetry(message, {topic: '/topics/global'}, function(err, response){
    if(err) console.error(err);
    else console.log(response);
});