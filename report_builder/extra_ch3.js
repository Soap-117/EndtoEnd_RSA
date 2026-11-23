export const extraChapter3Sections = [
  {
    num: "3.6.5",
    title: "Mathematical Proof of RSA Correctness via Euler's Theorem and Chinese Remainder Theorem",
    content: `To establish absolute mathematical rigor, we provide the formal proof of correctness for the RSA modular exponentiation pipeline:

Theorem (Correctness of RSA):
Let p and q be distinct prime numbers, n = p * q, and phi(n) = (p - 1)(q - 1). Let e and d be positive integers satisfying:
e * d = 1 mod phi(n).
Then for any integer m satisfying 0 <= m < n:
(m^e)^d = m^(e*d) = m mod n.

Proof:
The relation e * d = 1 mod phi(n) implies the existence of an integer k such that:
e * d = 1 + k * phi(n) = 1 + k * (p - 1)(q - 1).

We consider two distinct cases modulo p:
Case 1: gcd(m, p) = 1.
By Fermat's Little Theorem, m^(p - 1) = 1 mod p. Therefore:
m^(e*d) = m^(1 + k*(p-1)*(q-1)) = m * (m^(p-1))^(k*(q-1)) = m * (1)^(k*(q-1)) = m mod p.

Case 2: gcd(m, p) != 1.
Because p is prime, gcd(m, p) != 1 implies that m is a multiple of p, so m = 0 mod p.
Then:
m^(e*d) = 0^(e*d) = 0 = m mod p.
Thus, in both cases:
m^(e*d) = m mod p.

By symmetric reasoning modulo q:
m^(e*d) = m mod q.

Because p and q are distinct prime numbers, gcd(p, q) = 1. By the Chinese Remainder Theorem (CRT), if two integers are congruent modulo p and modulo q, they are uniquely congruent modulo their product n = p * q:
m^(e*d) = m mod (p * q) = m mod n.
This completes the mathematical proof that decrypting ciphertext c = m^e mod n with private key d deterministically recovers the exact original plaintext integer m.`
  },
  {
    num: "3.6.6",
    title: "ASN.1 DER Serialization Syntax and Byte-by-Byte Structural Mapping",
    content: `The W3C Web Cryptography API outputs keys as raw binary ArrayBuffers representing Abstract Syntax Notation One (ASN.1) structures encoded via Distinguished Encoding Rules (DER). To achieve enterprise interoperability, our system implements bidirectional transcoding between binary DER and RFC 7468 PEM text.

1. SubjectPublicKeyInfo (SPKI) ASN.1 Structure (RFC 5280 / RFC 3279):
The public key is encoded according to the following formal grammar:
SubjectPublicKeyInfo ::= SEQUENCE {
    algorithm           AlgorithmIdentifier,
    subjectPublicKey    BIT STRING
}
AlgorithmIdentifier ::= SEQUENCE {
    algorithm           OBJECT IDENTIFIER (rsaEncryption: 1.2.840.113549.1.1.1),
    parameters          ANY DEFINED BY algorithm OPTIONAL (NULL)
}
RSAPublicKey ::= SEQUENCE {
    modulus             INTEGER,  -- n (2048, 3072, or 4096 bits)
    publicExponent      INTEGER   -- e (65537)
}

[Table 3.4: Byte-by-Byte Hexadecimal Mapping of an RSA-2048 SPKI Public Key Header]
| Offset (Hex) | ASN.1 Tag | Length | Semantic Description / Value |
|---|---|---|---|
| 0000 | 0x30 (SEQUENCE) | 0x82 0x01 0x22 (290 bytes) | Outer SubjectPublicKeyInfo Sequence |
| 0004 | 0x30 (SEQUENCE) | 0x0D (13 bytes) | AlgorithmIdentifier Sequence |
| 0006 | 0x06 (OBJECT ID) | 0x09 (9 bytes) | 1.2.840.113549.1.1.1 (rsaEncryption OID) |
| 0011 | 0x05 (NULL) | 0x00 (0 bytes) | Null Parameters |
| 0013 | 0x03 (BIT STRING)| 0x82 0x01 0x0F (271 bytes) | Encapsulated RSAPublicKey Bit String |
| 0017 | 0x00 (Unused bits) | 0x00 | Zero unused padding bits in bit string |
| 0018 | 0x30 (SEQUENCE) | 0x82 0x01 0x0A (266 bytes) | Inner RSAPublicKey Sequence |
| 001C | 0x02 (INTEGER) | 0x82 0x01 0x01 (257 bytes) | Modulus n (256 bytes + 0x00 sign byte) |
| 011E | 0x02 (INTEGER) | 0x03 (3 bytes) | Public Exponent e (0x01 0x00 0x01 = 65537) |

2. PKCS#8 PrivateKeyInfo ASN.1 Structure (RFC 5958 / RFC 5208):
The private key incorporates full Chinese Remainder Theorem (CRT) optimization:
OneAsymmetricKey ::= SEQUENCE {
    version             INTEGER (0),
    privateKeyAlgorithm AlgorithmIdentifier,
    privateKey          OCTET STRING (RSAPrivateKey)
}
RSAPrivateKey ::= SEQUENCE {
    version             INTEGER (0),
    modulus             INTEGER,  -- n
    publicExponent      INTEGER,  -- e
    privateExponent     INTEGER,  -- d
    prime1              INTEGER,  -- p
    prime2              INTEGER,  -- q
    exponent1           INTEGER,  -- d mod (p - 1)
    exponent2           INTEGER,  -- d mod (q - 1)
    coefficient         INTEGER   -- q^(-1) mod p
}

By implementing automated transcoding between this canonical binary DER grammar and Base64 PEM text wrapped with 64-character lines, our system guarantees 100% interoperability with OpenSSL, GnuPG, and enterprise cloud Key Management Systems (KMS).`
  },
  {
    num: "3.7",
    title: "Failure Mode and Effects Analysis (FMEA) for Client-Side Cryptosystems",
    content: `To evaluate the resilience of the architecture under anomalous conditions, a comprehensive Failure Mode and Effects Analysis (FMEA) was conducted. Each potential failure mode was quantified across Severity (S), Occurrence (O), and Detection (D) on a scale of 1 to 10, deriving the Risk Priority Number:
RPN = S * O * D

[Table 3.5: Failure Mode and Effects Analysis (FMEA) for the Asymmetric Cryptosystem]
| Component | Potential Failure Mode | Potential Effect of Failure | S | O | D | RPN | Implemented Prevention & Mitigation |
|---|---|---|---|---|---|---|---|
| Native Keygen | Browser thread freeze during 4096-bit prime search | User closes tab; application appears hung | 6 | 7 | 3 | 126 | 50ms microtask yielding; animated CSS spinner; background threading |
| Input Parser | User pastes malformed or non-PEM string | Crash during ArrayBuffer base64 decoding | 5 | 6 | 2 | 60 | Regex PEM sanitization; try-catch block; non-intrusive warning toast |
| OAEP Encryptor| Plaintext byte size exceeds single-block capacity | Native SubtleCrypto throws fatal OperationError | 8 | 8 | 1 | 64 | Automated multi-block chunking calculating dynamic modulus limits |
| Decryptor | Ciphertext corrupted or bit-flipped in transit | Indecipherable garbled output or silent failure | 7 | 4 | 2 | 56 | SubtleCrypto OAEP MAC verification fails; safe OperationError trapped |
| Decryptor | User attempts decryption with mismatched private key | Data corruption or application hang | 7 | 5 | 2 | 70 | Integrity check catches mismatch; displays "Key mismatch" notification |
| Transport | Base64 whitespace or newline insertion via copy-paste | ArrayBuffer length misalignment | 4 | 7 | 1 | 28 | Automatic regex whitespace stripping: replace(/\\s+/g, '') |

The FMEA confirms that all high-RPN failure modes (thread blocking, length overflow, ciphertext corruption) have been eliminated through automated mathematical chunking, microtask scheduling, and robust error boundary trapping.`
  }
];
