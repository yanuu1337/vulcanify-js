exports.ROUTING_RULES_URL =
  "http://komponenty.vulcan.net.pl/UonetPlusMobile/RoutingRules.txt";
exports.appId = '4609707972546570896:3626695765779152704'
exports.device = exports.appId.split(':')[0];
exports.app ="pl.edu.vulcan.hebe"
exports.firebaseData = {
  "sender": "987828170337",
  "X-scope": "*",
  "X-gmp_app_id": "1:987828170337:android:ac97431a0a4578c3",
  "app": exports.app,
  "device": exports.device,
}

exports.firebaseHeaders = {
  "Authorization": `AidLogin ${exports.appId}`,
  "User-Agent": "Android-GCM/1.5",
  "app": exports.app
}
exports.firebaseUrl = `https://android.clients.google.com/c2dm/register3`