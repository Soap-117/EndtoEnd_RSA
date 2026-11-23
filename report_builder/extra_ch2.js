export const extraChapter2Sections = [
  {
    num: "2.1.6",
    title: "Cryptanalytic Investigation of Low Public Exponents and Coppersmith's Theorem",
    content: `Historically, software implementations of RSA evaluated small public exponents such as e = 3 or e = 17 to optimize public key modular exponentiation. In 1996, Don Coppersmith proved a foundational theorem concerning the computation of small roots of modular polynomial equations.

Coppersmith's Theorem states that let N be an integer of unknown factorization, and let f(x) be a monic polynomial of degree d. Then all integer solutions x_0 satisfying:
f(x_0) = 0 mod N and |x_0| < N^(1/d)
can be found in polynomial time using the Lenstra-Lenstra-Lovasz (LLL) lattice basis reduction algorithm.

In the context of RSA encryption with e = 3, if a message m satisfies m < N^(1/3), then m^3 < N. Under this condition, modular reduction never occurs:
c = m^3 mod N = m^3
The ciphertext c can be inverted simply by computing the standard real cube root m = c^(1/3) over the integers, completely defeating the cryptosystem. Even when randomized padding is naively prepended (e.g., m = 2^k * r + pad), Hastad's Broadcast Attack demonstrates that sending the same message encrypted under 3 distinct RSA moduli allows full message recovery via the Chinese Remainder Theorem.

These historical vulnerabilities directly informed our specification selection in Chapter 3: the Fermat prime F4 (e = 65537 = 2^16 + 1) is strictly enforced. Because 65537 requires e = 2^16 + 1, Coppersmith's bound N^(1/65537) is cryptographically infinitesimal, rendering lattice-based low-exponent root extraction computationally impossible.`
  },
  {
    num: "2.1.7",
    title: "Mathematical Foundations of Integer Factorization and Modulus Sizing",
    content: `The security of the RSA cryptosystem rests entirely upon the presumed computational intractability of the Integer Factorization Problem: given a composite integer n = p * q, find primes p and q. Over four decades, integer factorization algorithms have evolved across three primary complexity classes:

1. Trial Division and Fermat Factorization:
Fermat's method factors n by expressing it as the difference of two squares: n = a^2 - b^2 = (a - b)(a + b). If p and q are close to sqrt(n), Fermat's method terminates in O(|p - q|) steps. Consequently, modern RSA key generators must enforce:
|p - q| > 2^(k/2 - 100)
where k is the modulus length.

2. Pollard's p - 1 and p + 1 Algorithms:
If all prime factors of p - 1 are smaller than a chosen smoothness bound B (i.e., p - 1 is B-powersmooth), Pollard's p - 1 algorithm computes d = gcd(a^(B!) - 1, n) in polynomial time. To defeat Pollard's attack, modern standards mandate "safe primes" or "strong primes" where p = 2*p' + 1 and p' is itself prime.

3. The General Number Field Sieve (GNFS):
The General Number Field Sieve remains the most asymptotically efficient classical algorithm for factoring large composite integers. The heuristic asymptotic complexity of GNFS is:
L_n[1/3, c] = exp( (c + o(1)) * (ln n)^(1/3) * (ln ln n)^(2/3) )
where c = (64/9)^(1/3) ~ 1.923 for general integers.

[Table 2.4: GNFS Asymptotic Complexity and Historical RSA Factoring Milestones]
| RSA Challenge Modulus | Bit Length | Date Factored | Organization / Research Group | Computational Effort (Core-Years) |
|---|---|---|---|---|
| RSA-100 | 330 Bits | April 1991 | Arjen Lenstra et al. | 7 Core-Years |
| RSA-129 | 425 Bits | April 1994 | Atkins, Graff, Lenstra, Leyland | 5,000 MIPS-Years |
| RSA-140 | 465 Bits | February 1999| Cavallar et al. (CWI, INRIA) | 2,000 MIPS-Years |
| RSA-155 (512-bit) | 512 Bits | August 1999 | CWI, INRIA, University of Bonn | 8,000 MIPS-Years (Deprecated) |
| RSA-768 | 768 Bits | December 2009| Kleinjung, Bahr, Lenstra et al. | 2,000 Core-Years |
| RSA-250 (829-bit) | 829 Bits | February 2020| Boudot, Gaudry, Guillevic et al. | 2,700 Core-Years (GNFS) |
| RSA-2048 | 2048 Bits | Unbroken | Current Global Standard | ~ 10^15 Core-Years (Classical GNFS)|
| RSA-4096 | 4096 Bits | Unbroken | Current Long-Term Sovereign Standard| ~ 10^30 Core-Years (Classical GNFS)|

This mathematical reality confirms that 1024-bit RSA provides less than 80 bits of symmetric security, validating NIST's mandate that modern systems enforce a minimum modulus of 2048 bits and recommend 4096 bits for long-term security.`
  }
];
