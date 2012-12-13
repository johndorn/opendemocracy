
var crypto = require('crypto');

var cryptoUtil = function() {

	this.pkey = null;
	this.setPrivateKey = function(key) {
		this.pkey = key;
	};

	/**
		signObject({obj}, [keys])
		Returns signature of {obj}. Data is serialized into crypto.signer using [keys]. This ensures data is added consistently
	 */
	this.signObject = function(obj, keys) {
		
		if(!this.pkey) {
			throw new Error("Can't create signer without private key");
		}

		var signer = crypto.createSign();
		for(var i = 0, len = keys.length; i < len; i++) {
			signer.update(obj[keys[i]]);
		}
		
		var signature = signer.sign(this.pkey, 'hex');
		signer = null;
		return signature;
	};

	/**
		verifyObjectSignature({obj}, [keys], signature)
		Verifies signature of {obj}. Data is serialized into crypto.signer using [keys]. This ensures data is added consistently
	 */
	this.verifyObjectSignature = function(obj, keys, signature) {
		
		if(! signature) {
			if(obj.signature) {
				signature = obj.signature
			} else {
				throw new Error("Cannot verify object without signature");
			}
		}

		if(!this.pkey) {
			throw new Error("Can't create verifier without private key");
		}

		var verify = crypto.createVerify();
		for(var i = 0, len = keys.length; i < len; i++) {
			verify.update(obj[keys[i]]);
		}
		
		var verified = verify.verify(this.pkey, signature, 'hex');
		verify = null;
		return verified;
	};


	if(cryptoUtil.caller != cryptoUtil.getInstance) {
		throw new Error("This object cannot be instantiated directly. Use cryptoUtil.getInstance");
	}
}

cryptoUtil.getInstance = function() {
	if(typeof(this.instance) === 'undefined') {
		this.instance = new cryptoUtil();
	}
	return this.instance;
};
module.exports.getInstance = cryptoUtil.getInstance;


