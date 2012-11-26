# create private key for CA for key signing
openssl genrsa -des3 -out keys/ca.key 1024
# passphrase used was 'opendemocracy'

# create CA certificate
openssl req -config openssl.conf -new -x509 -days 1001 -key keys/ca.key -out certs/ca.crt

# generate the cert in DER format for sending to clients
# when sent to client, use mime type application/x-x509-ca-cert
openssl x509 -in certs/ca.crt -outform DER -out server.crt
