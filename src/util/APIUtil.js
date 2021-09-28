module.exports = class APIUtil {
    
    constructor(keystore, account) {
        this.keystore = keystore;
        this.account = null;

        if(account) {
            this.account = account;
        }

    }
    buildPayload = (envelope) => ({
        AppName: APP_NAME,
        AppVersion: APP_VERSION,
        CertificateId: this.keystore
    })
}