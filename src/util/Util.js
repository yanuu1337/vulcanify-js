const Constants = require("./Constants");
const centra = require("centra");
const { Error, TypeError } = require("../errors");
const crypto = require("crypto");
const forge = require("node-forge");
module.exports = class Util {
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

  

  //This piece of utility is loosely inspired by the `vulcan-api-js` module
  static async generateKeyPair() {
    const keys = await new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        "rsa",
        { modulusLength: 2048 },
        (err, publicKey, privateKey) => {
          if (err) {reject(err);}
          else {resolve({ publicKey, privateKey })};
        }
      );
      })
      const publicKey = keys.publicKey
        .export({ format: "pem", type: "spki" })
        .toString();
      const privateKey = keys.privateKey
        .export({ format: "pem", type: "spki" })
        .toString();
    
      const fullCert = forge.pki.createCertificate();
      fullCert.publicKey = forge.pki.publicKeyFromPem(publicKey);
      fullCert.privateKey = forge.pki.privateKeyFromPem(privateKey);
      fullCert.serialNumber = "1";
      fullCert.validity.notBefore = new Date();
      fullCert.validity.notAfter = this.appendYears(new Date(), 30);
      const attributes = [
        { shortName: "CN", value: "APP_CERTIFICATE CA Certificate" },
      ];
      fullCert.setSubject(attributes);
      fullCert.setIssuer(attributes);
      fullCert.sign(fullCert.privateKey, forge.md.sha256.create());
      const fingerprint = crypto
        .createHash(`sha1`)
        .update(
          forge.asn1
            .toDer(forge.pki.certificateToAsn1(fullCert))
            .getBytes()
            .toString(),
          "latin1"
        ).digest().toString("hex");
      const certificate = forge.pki.certificateToPem(fullCert).replace(`-----BEGIN CERTIFICATE-----`, "").replace(`-----END CERTIFICATE-----`, "").replace(/\r?n|\r/g, "").trim()
      const returnablePrivateKey = privateKey.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\r?n|\r/g, "").trim()
      return {certificate, fingerprint, privateKey: returnablePrivateKey}
   
  }
  
  /**
   * Acquires the Firebase messaging token from Firebase (recommended to save it for later use)
   * @returns {Promise<string>} Firebase Messaging token
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

    return firebaseResponse.text();
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
    return new Date(date.setFullYear(date.getFullYear() + numberOfYears));
  }
  
};
