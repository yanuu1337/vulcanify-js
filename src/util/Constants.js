const FormData = require('form-data')
exports.ROUTING_RULES_URL =
  "http://komponenty.vulcan.net.pl/UonetPlusMobile/RoutingRules.txt";
exports.aid = '4609707972546570896:3626695765779152704'
exports.device = exports.aid.split(':')[0];
exports.app ="pl.edu.vulcan.hebe"
exports.firebaseData = {
  "sender": "987828170337",
  "X-scope": "*",
  "X-gmp_app_id": "1:987828170337:android:ac97431a0a4578c3",
  "app": exports.app,
  "device": exports.device,
}

exports.deviceModel = `Vulcanify - Vulcan API Wrapper for Node.JS`

exports.APP_NAME = "DzienniczekPlus 2.0";
exports.APP_VERSION = "1.4.2";
exports.APP_OS = "Android";
exports.APP_USER_AGENT = "Dart/2.10 (dart:io)";


exports.firebaseHeaders = {
  "Authorization": `AidLogin ${exports.aid}`,
  "User-Agent": "Android-GCM/1.5",
  "app": exports.app,
  
}
exports.firebaseUrl = `https://android.clients.google.com/c2dm/register3`