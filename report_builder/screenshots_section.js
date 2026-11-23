export const screenshotsSection = {
  num: "4.5",
  title: "Visual Demonstration and Application Execution Screenshots",
  content: `This section presents an exhaustive graphical walkthrough and visual validation of the cryptosystem across every operational state. Each screenshot illustrates a critical operational phase, including key generation, parameter configuration, SPKI/PKCS#8 key serialization, live key state synchronization, message encryption, one-click ciphertext transfer, private-key decryption, and automated error handling.

The interface captures are sequentially indexed and formatted according to institutional report standards, providing definitive photographic evidence of correct system execution.`,
  screenshots: [
    {
      id: "fig4_7",
      fileName: "fig4_7_launch.png",
      caption: "Figure 4.7: Initial Application Launch and Key Generation Interface",
      title: "Initial Application Launch and Parameter Selection View",
      description: `Upon initial load, the application renders the glassmorphic Key Generator view. The header prominently displays "End to end RSA". The key size selection dropdown provides options for 2048-bit (Standard Security), 3072-bit (High Security), and 4096-bit (Maximum Security, selected by default). The primary glowing "Generate Keys" button is prominently displayed in the idle state, ready for asynchronous execution.`
    },
    {
      id: "fig4_8",
      fileName: "fig4_8_keygen.png",
      caption: "Figure 4.8: High-Performance Key Generation Execution State with Loading Spinner",
      title: "Asynchronous Key Generation in Progress with Non-Blocking UI",
      description: `When the user clicks "Generate Keys", the button transitions to a disabled state and activates a CSS-animated circular loading spinner. The application dispatches the prime generation task to the background Web Crypto worker thread via microtask yielding, ensuring that the browser UI event loop remains completely fluid and responsive without thread freezing.`
    },
    {
      id: "fig4_9",
      fileName: "fig4_9_keys_display.png",
      caption: "Figure 4.9: Generated 4096-bit RSA Key Pair (SPKI Public & PKCS#8 Private PEM Outputs)",
      title: "Display of Generated Public and Private Key PEM Outputs",
      description: `Upon completion of the Miller-Rabin primality search and modular inverse derivations, the side-by-side textareas populate with the canonical PEM strings: SubjectPublicKeyInfo (SPKI) for the Public Key and PKCS#8 for the Private Key. Each key container includes dedicated clipboard copy and .pem file download icon buttons.`
    },
    {
      id: "fig4_10",
      fileName: "fig4_10_banner.png",
      caption: "Figure 4.10: Automated Key Synchronization and Notification Banner",
      title: "Real-Time State Synchronization and Navigation Prompt Banner",
      description: `An emerald green notification toast confirms: "Generated 4096-bit RSA Key Pair!". Simultaneously, an automated callout banner appears beneath the keys: "✓ Keys generated successfully! Ready to encrypt & decrypt." with a direct action button: "Go to Encrypt & Decrypt Tool →", facilitating a seamless transition to the message processing workspace.`
    },
    {
      id: "fig4_11",
      fileName: "fig4_11_encrypt.png",
      caption: "Figure 4.11: Encrypt Message Panel with Active Public Key Status Indicator",
      title: "Encrypt Workspace with Live Key Status and Plaintext Input Area",
      description: `Switching to the "Encrypt & Decrypt" tab reveals the symmetric dual-panel layout. The left card (Encrypt Message) automatically detects the generated public key, displaying a green status pill: "✓ Active (4096-bit)". The plaintext input textarea provides a live character and UTF-8 byte counter.`
    },
    {
      id: "fig4_12",
      fileName: "fig4_12_encrypted.png",
      caption: "Figure 4.12: Plaintext Input and Successful Base64 Ciphertext Output Generation",
      title: "Message Encryption Execution and Ciphertext Generation View",
      description: `The user enters a confidential plaintext message into the input field. Clicking "🔒 Encrypt Message" invokes the native RSA-OAEP engine (triggering multi-block chunking if the payload exceeds single-block capacity). The resulting Base64 ciphertext appears in the output field, and a green toast confirms: "Message encrypted successfully!".`
    },
    {
      id: "fig4_13",
      fileName: "fig4_13_transfer.png",
      caption: "Figure 4.13: One-Click Ciphertext Transfer Pipeline to Decrypt Panel",
      title: "Transfer Pipeline Routing Ciphertext Between Cards",
      description: `Clicking the right-facing transfer arrow icon in the Encrypt header (or "Paste from Encrypt ↑" in the Decrypt card) immediately transfers the Base64 ciphertext into the Decrypt input field. A confirmation toast alerts: "Ciphertext transferred to Decrypt!", eliminating manual copy-pasting.`
    },
    {
      id: "fig4_14",
      fileName: "fig4_14_decrypt.png",
      caption: "Figure 4.14: Decrypt Message Panel with Active Private Key Status and Inbound Ciphertext",
      title: "Decrypt Workspace Ready for Private Key Execution",
      description: `The right card (Decrypt Message) displays an active status pill: "✓ Active (4096-bit)", verifying that the corresponding PKCS#8 private key is loaded in memory. The transferred Base64 ciphertext is staged in the input textarea, ready for atomic private-key decryption.`
    },
    {
      id: "fig4_15",
      fileName: "fig4_15_decrypted.png",
      caption: "Figure 4.15: Successful Message Decryption and Plaintext Recovery (Exact Match)",
      title: "Plaintext Recovery and Mathematical Integrity Verification",
      description: `Clicking "🔓 Decrypt Message" executes modular exponentiation and OAEP unpadding. The original plaintext message is reconstructed in the "Decrypted Plaintext" output box with 100% byte-for-byte fidelity. A green toast confirms: "Message decrypted successfully!".`
    },
    {
      id: "fig4_16",
      fileName: "fig4_16_drawer.png",
      caption: "Figure 4.16: Collapsible Key Drawer for Viewing, Editing, and Custom Key Pasting",
      title: "Collapsible Key Configuration Drawer and Custom PEM Management",
      description: `Clicking "View/Edit" next to the status pill expands the collapsible key drawer. Users can inspect the raw PEM string, paste external PEM keys from OpenSSL, or click "Load Generated Key" to re-synchronize active session keys. When custom keys are pasted, the badge dynamically transitions to a blue "Custom Key" indicator.`
    },
    {
      id: "fig4_17",
      fileName: "fig4_17_error.png",
      caption: "Figure 4.17: Error Boundary Trapping and Tampered Ciphertext Security Notification",
      title: "Security Exception Trapping and User Warning Notification",
      description: `Demonstrating negative test resilience: when a bit-flipped or corrupted ciphertext is submitted for decryption, the OAEP mask verification fails safely. The application traps the native OperationError and displays a high-visibility red toast alert: "Decryption failed: Private key mismatch or corrupted ciphertext.", preventing unhandled script crashes.`
    },
    {
      id: "fig4_18",
      fileName: "fig4_18_console.png",
      caption: "Figure 4.18: Developer Console Programmatic Verification of window.encryptMessage API",
      title: "Browser Developer Console Execution of Global Cryptographic APIs",
      description: `The browser developer console (F12) shows successful execution of the programmatic API: window.encryptMessage("Cyber Security 2026") and window.decryptMessage(cipher). The console log displays the initialization banner and outputs verified roundtrip matches, demonstrating programmatic access for automated testing.`
    }
  ]
};
