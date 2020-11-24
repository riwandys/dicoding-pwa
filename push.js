const webPush = require('web-push');

const vapidKeys = {
  publicKey:
    'BFnUSRFhN3x3q7IY9CVtNhnJPvyyDxeSpHGkISt3h5_G9rw5XL1Wd7P_8m89rnd2Z1mfOJ534pPGLXwPk0e0Zls',
  privateKey: 'zdfPhc9ruWCrLVaZc69C5VMYmdl6MsZY-uwQsl2afC8',
};

webPush.setVapidDetails(
  'mailto:riwandys@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var pushSubscription = {
  endpoint:
    'https://fcm.googleapis.com/fcm/send/fZ8yKoBdxrA:APA91bGAymPV4-87KOfiR_IAmz0H1BgQ-5WURq8HCSF6rV2IPal4R1K_vUheGe_LmMA9cXKvexPzQyVFz7BtZWnHkOGesx802L8jD9laavQtkIyFiMu_caI3y-E5U7ipVDg8c2ot6rUM',
  keys: {
    p256dh:
      'BMKpfFyiU+m2pghEL9eIs3/0PdjV9Na+csrLJTI0GM8XzVa9gqQqDV227Ij8TdsEx3YBT+eYi6Rr2i2Yd9i8TGw=',
    auth: 'LvqnFcnvM/xG8//JvSsBAw==',
  },
};
var payload = "Don't forget to watch your favorite team today.";

var options = {
  gcmAPIKey: '963836000395',
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
