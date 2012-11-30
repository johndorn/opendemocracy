
# This is just for testing and not intended for production

# create private key for CA for key signing
#openssl genrsa -des3 -out keys/ca.key 1024
# passphrase used was '1234'

# Generate signing certificate, will be used for server as well
#openssl req -config openssl.conf -new -x509 -days 1001 -key keys/ca.key -out certs/ca.crt

echo Create the CA Key and Certificate for signing Client Certs
echo
openssl genrsa -des3 -out keys/ca.key 1024 &&
openssl req -config openssl.conf -new -x509 -days 365 -key keys/ca.key -out certs/ca.crt &&

echo
echo Create the Server Key, CSR, and Certificate
echo
openssl genrsa -des3 -out keys/server.key 1024 &&
openssl req -new -key keys/server.key -out requests/server.csr &&

echo
echo We are self signing our own server cert here.  This is a no-no in production.
echo
openssl x509 -req -days 365 -in requests/server.csr -CA certs/ca.crt -CAkey keys/ca.key -set_serial 01 -out certs/server.crt &&

echo
echo Create the Client Key and CSR
echo
openssl genrsa -des3 -out keys/client.key 1024 &&
openssl req -new -key keys/client.key -out requests/client.csr &&

echo
echo Sign the client certificate with our CA cert.  Unlike signing our own server cert, this is what we want to do.
echo
openssl x509 -req -days 365 -in requests/client.csr -CA certs/ca.crt -CAkey keys/ca.key -set_serial 01 -out certs/client.crt
