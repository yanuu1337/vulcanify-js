const Constants = require("./Constants");
const centra = require("centra");
const { Error, TypeError } = require("../errors");
const crypto = require("crypto");
const forge = require('node-forge')
module.exports = class Utils {
  constructor() {
    throw new Error(`CLASS_INSTANTIATED_ERROR`, this.constructor.name);
  }

  /**
   *
   * @param {string} token
   */
  static async getBaseUrl(token) {
    let tokenCode = token.slice(0, 3);
    let components = await this.getVulcanComponents();

    if (!components[tokenCode]) throw new TypeError(`INVALID_TOKEN_CODE`);
  }

  get payload() {
    return {
      AppName: Constants.app,
    };
  }

  //This piece of utility is loosely inspired by the `vulcan-api-js` module
  async generateKeyPair() {
    const keys = await new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        "rsa",
        { modulusLength: 2048 },
        (err, publicKey, privateKey) => {
          if (err) reject(err);
          else resolve({ publicKey, privateKey });
        }
      );
      const publicKey = keys.publicKey
        .export({ format: "pem", type: "spki" })
        .toString();
      const privateKey = keys.privateKey
        .export({ format: "pem", type: "spki" })
        .toString();

      const certificate = forge.pki.createCertificate()
      certificate.publicKey = forge.pki.publicKeyFromPem(publicKey)
      certificate.privateKey = forge.pki.privateKeyFromPem(privateKey)
      certificate.serialNumber = "1";
      certificate.validity.notBefore = new Date()
      certificate.validity.notAfter
    });
  }

  /**
   * Acquires the Firebase messaging token from Firebase (recommended to save it for later use)
   * @returns {response} Firebase Messaging token
   */
  static async getFirebaseToken() {
    const {
      firebaseUrl: url,
      firebaseHeaders: headers,
      firebaseData,
    } = require("./Constants");

    const firebaseResponse = await centra(url, "POST")
      .header(headers)
      .body(firebaseData, "form")
      .send();

    if (firebaseResponse.statusCode !== 200) {
      throw new Error(`FIREBASE_API_ERROR`, firebaseResponse.statusCode);
    }
    const response = await firebaseResponse.text()
    return response;
  }


  /**
   * Fetches all vulcan routing rules from their API and returns them in one object
   * @returns {Object} An object of all vulcan component routing rules
   * 
   * @example
   * const routingRules = await Util.getVulcanComponents()
   * const myVulcanComponent = routingRules['3S1']
   * // use it for something
   * 
   */

  static async getVulcanComponents() {
    let response = await centra(`${Constants.ROUTING_RULES_URL}`).send();
    if (response.statusCode !== 200) {
      throw new Error(`VULCAN_API_ERROR`, response.statusCode);
    }

    if (response?.headers["content-type"] !== "text/plain") {
      throw new Error(
        `INVALID_CONTENT_TYPE`,
        "text/plain",
        response.headers["content-type"]
      );
    }
    const components = {};
    const content = await response.text();
    for (let i of content.split("\r\n")) {
      let componentCode = i.split(",")[0];
      let componentUrl = i.split(",")[1];
      if (componentUrl === undefined) break;
      Object.assign(components, { [`${componentCode}`]: componentUrl });
    }
    return components;
  }

  get secondsSinceEpoch() {
    return Math.round(Date.now() / 1000);
  }
  
  /**
   * 
   * @param {Date} date The date to add years to
   * @param {number} numberOfYears Amount of years
   * @returns {Date} New formatted date
   */
  appendYears(date, numberOfYears) {
    return new Date(date.setFullYear(date.getFullYear() + numberOfYears))
  }
};
