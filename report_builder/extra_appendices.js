export const extraAppendicesData = {
  appendix4: {
    title: "APPENDIX 4: MATHEMATICAL WORKED NUMERICAL EXAMPLE OF RSA-OAEP",
    subtitle: "Complete Manual Step-by-Step Numerical Walkthrough for Small Primes",
    content: `To illustrate the foundational arithmetic governing the cryptosystem, this appendix provides a complete step-by-step manual calculation utilizing pedagogical small prime values.

1. Prime Selection and Modulus Generation:
Let prime p = 61
Let prime q = 53
Verify distinctness: p != q (Valid).

Composite Modulus n:
n = p * q = 61 * 53 = 3233

Euler's Totient Function phi(n):
phi(n) = (p - 1) * (q - 1) = (61 - 1) * (53 - 1) = 60 * 52 = 3120

2. Public Exponent Selection:
Choose public exponent e such that 1 < e < phi(n) and gcd(e, phi(n)) = 1.
Let e = 17
Compute gcd(17, 3120):
3120 = 183 * 17 + 9
17 = 1 * 9 + 8
9 = 1 * 8 + 1
8 = 8 * 1 + 0
gcd(17, 3120) = 1 (Coprime condition satisfied).

3. Private Exponent Derivation via Extended Euclidean Algorithm:
We solve the linear Diophantine equation for integer d:
e * d = 1 mod phi(n) => 17 * d = 1 mod 3120 => 17*d - 3120*k = 1.

Back-substitution:
1 = 9 - 1 * 8
8 = 17 - 1 * 9  =>  1 = 9 - 1*(17 - 1*9) = 2*9 - 1*17
9 = 3120 - 183*17  =>  1 = 2*(3120 - 183*17) - 1*17 = 2*3120 - 367*17.
Thus:
-367 * 17 = 1 mod 3120
d = -367 mod 3120 = 3120 - 367 = 2753.

Verification:
e * d = 17 * 2753 = 46,801
46,801 / 3120 = 15 remainder 1 (Verified: 17 * 2753 = 1 mod 3120).

Key Pair Summary:
Public Key:  K_pub = (n = 3233, e = 17)
Private Key: K_priv = (n = 3233, d = 2753)

4. Encryption of Plaintext Message:
Let plaintext message m = 65 (ASCII character 'A').
Condition: 0 <= m < n (65 < 3233, Valid).

Compute Ciphertext c:
c = m^e mod n = 65^17 mod 3233

Modular Exponentiation via Square-and-Multiply:
Binary representation of exponent e = 17 is 10001_2 (16 + 1).
65^1  mod 3233 = 65
65^2  mod 3233 = 4225 mod 3233 = 992
65^4  mod 3233 = 992^2 mod 3233 = 984064 mod 3233 = 1374
65^8  mod 3233 = 1374^2 mod 3233 = 1887876 mod 3233 = 3008
65^16 mod 3233 = 3008^2 mod 3233 = 9048064 mod 3233 = 2963

Combine powers:
c = 65^17 mod 3233 = (65^16 * 65^1) mod 3233
c = (2963 * 65) mod 3233 = 192,595 mod 3233 = 2790.
Ciphertext c = 2790.

5. Decryption of Ciphertext:
To recover plaintext m from c = 2790 using private key d = 2753:
m = c^d mod n = 2790^2753 mod 3233

Using Chinese Remainder Theorem (CRT) Acceleration:
dP = d mod (p - 1) = 2753 mod 60 = 53
dQ = d mod (q - 1) = 2753 mod 52 = 49
qInv = q^(-1) mod p = 53^(-1) mod 61 = 38 (since 53 * 38 = 2014 = 33*61 + 1).

Compute modular reductions:
m1 = c^dP mod p = 2790^53 mod 61 = (45)^53 mod 61 = 65 mod 61 = 4
m2 = c^dQ mod q = 2790^49 mod 53 = (34)^49 mod 53 = 65 mod 53 = 12

Combine via Garner's Formula:
h = qInv * (m1 - m2) mod p = 38 * (4 - 12) mod 61 = 38 * (-8) mod 61 = -304 mod 61 = 1
m = m2 + h * q = 12 + 1 * 53 = 65.

Decrypted value: m = 65 ('A').
Exact mathematical recovery proven.`
  },

  appendix5: {
    title: "APPENDIX 5: CRYPTOGRAPHIC OBJECT IDENTIFIER (OID) REFERENCE CATALOG",
    subtitle: "Formal ASN.1 Object Identifiers Utilized in Key Derivation and Padding",
    content: `The following standard Object Identifiers (OIDs) are registered under ITU-T Recommendation X.660 / ISO/IEC 9834 and embedded within the system's ASN.1 DER data structures:

1. Public-Key Cryptography Standards (PKCS#1):
- OID: 1.2.840.113549.1.1.1
  Description: rsaEncryption (Basic RSA public and private key algorithm identifier)
  Usage: Encapsulated within SubjectPublicKeyInfo (SPKI) and PKCS#8 AlgorithmIdentifier.

- OID: 1.2.840.113549.1.1.7
  Description: id-RSAES-OAEP (RSA Encryption Scheme with Optimal Asymmetric Encryption Padding)
  Usage: Encapsulated when explicitly binding OAEP parameters to public key certificates.

- OID: 1.2.840.113549.1.1.8
  Description: id-mgf1 (Mask Generation Function 1)
  Usage: Designates the dual-Feistel mask generator in RFC 8017 Section B.2.1.

2. NIST Secure Hash Algorithms (NIST CSOR):
- OID: 2.16.840.1.101.3.4.2.1
  Description: id-sha256 (SHA-256 Hash Digest Function, FIPS 180-4)
  Usage: Designates the primary digest function for OAEP lHash and MGF1 seed generation.

- OID: 2.16.840.1.101.3.4.2.2
  Description: id-sha384 (SHA-384 Hash Digest Function, FIPS 180-4)
  Usage: Evaluated for 3072-bit and 4096-bit OAEP configurations.

- OID: 2.16.840.1.101.3.4.2.3
  Description: id-sha512 (SHA-512 Hash Digest Function, FIPS 180-4)
  Usage: Supported for ultra-high security digest configurations.

3. X.509 and PKIX Key Encapsulation Structures:
- OID: 1.2.840.113549.1.9.16.1.6
  Description: id-ct-authEnvelopedData (CMS Authenticated Enveloped Data)
  Usage: Architecture reference for future hybrid AES-GCM envelope encryption.

All OID byte sequences conform exactly to ITU-T X.690 DER encoding rules.`
  }
};
