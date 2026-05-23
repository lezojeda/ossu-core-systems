1. 47
2. Before. The initial TCP SYN corresponds to number 47 while the first TLS `Client Hello` to number 63.
3. 63
4. 1.3
5. 16 suites
6. The random value was 72de2505d3f716b638deb3d66650e157818701c4bf23fbee2f0de07818d502f4. Stripping the GMT UNIX Time 0x72de2505 we get d3 for the answer of this question.
7. It's used to compute the Master Secret. As per RFC 5246 6.3:

```
To generate the key material, compute

      key_block = PRF(SecurityParameters.master_secret,
                      "key expansion",
                      SecurityParameters.server_random +
                      SecurityParameters.client_random);
```

Where `SecurityParameters.client_random` corresponds to this random bytes field.

8. 94
9. TLS_AES_256_GCM_SHA384 (0x1302)
10. Yes. Because the server also computes the Master Secret and supplies randomness.
11. 37, but used the provided trace since couldn't find the certificate for gaia host in mine
12. No, not all certificates are for www.cs.umass.edu, the other certs are for the intermediate certifiers of cs.umass.edu, the complete chain.
13. InCommon RSA Server CA, which is https://incommon.org
14. The algorithm used was `sha256` with RSA encryption
15. 00b3