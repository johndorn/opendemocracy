
# This is just for testing and not intended for production

# create private key for CA for key signing
#openssl genrsa -des3 -out keys/ca.key 1024
# passphrase used was 'opendemocracy'

# Generate signing certificate, will be used for server as well
#openssl req -config openssl.conf -new -x509 -days 1001 -key keys/ca.key -out certs/ca.crt

# Create the CA Key and Certificate for signing Client Certs
openssl genrsa -des3 -out keys/ca.key 4096 &&
openssl req -new -x509 -days 365 -key keys/ca.key -out certs/ca.crt &&

# Create the Server Key, CSR, and Certificate
openssl genrsa -des3 -out keys/server.key 1024 &&
openssl req -new -key keys/server.key -out certs/server.csr &&

# We're self signing our own server cert here.  This is a no-no in production.
openssl x509 -req -days 365 -in certs/server.csr -CA certs/ca.crt -CAkey keys/ca.key -set_serial 01 -out certs/server.crt &&

# Create the Client Key and CSR
openssl genrsa -des3 -out keys/client.key 1024 &&
openssl req -new -key keys/client.key -out requests/client.csr &&

# Sign the client certificate with our CA cert.  Unlike signing our own server cert, this is what we want to do.
openssl x509 -req -days 365 -in requests/client.csr -CA certs/ca.crt -CAkey keys/ca.key -set_serial 01 -out certs/client.crt



