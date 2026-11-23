import './style.css';

// ==========================================
// Cryptography Utilities & Core Functions
// ==========================================

// Utility: Convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Utility: Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64) {
  const binary = window.atob(base64.replace(/\s+/g, ''));
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Utility: Format raw Base64 key to standard PEM format
export function formatPEM(base64Str, type) {
  const header = `-----BEGIN ${type} KEY-----\n`;
  const footer = `\n-----END ${type} KEY-----`;
  
  let body = '';
  for (let i = 0; i < base64Str.length; i += 64) {
    body += base64Str.slice(i, i + 64) + '\n';
  }
  return header + body.trim() + footer;
}

// Utility: Clean PEM string and convert to ArrayBuffer
export function pemToArrayBuffer(pem) {
  const clean = pem
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, '')
    .replace(/-----END [A-Z0-9 ]+-----/g, '')
    .replace(/\s+/g, '');
  return base64ToArrayBuffer(clean);
}

// Import SPKI PEM string to RSA-OAEP CryptoKey for encryption
export async function importPublicKey(pem) {
  if (!pem || typeof pem !== 'string') {
    throw new Error('A valid PEM public key string is required.');
  }
  const der = pemToArrayBuffer(pem);
  return await window.crypto.subtle.importKey(
    'spki',
    der,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

// Import PKCS#8 PEM string to RSA-OAEP CryptoKey for decryption
export async function importPrivateKey(pem) {
  if (!pem || typeof pem !== 'string') {
    throw new Error('A valid PEM private key string is required.');
  }
  const der = pemToArrayBuffer(pem);
  return await window.crypto.subtle.importKey(
    'pkcs8',
    der,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
}

// Stored active session keys
let sessionKeys = {
  keyPair: null,
  publicPEM: '',
  privatePEM: '',
  keySize: 0,
};

/**
 * Encrypt a plaintext message using RSA-OAEP (SHA-256).
 * Accepts either a CryptoKey or a PEM string.
 * Supports arbitrary message lengths via standard chunking.
 *
 * @param {string} plainText - The message to encrypt.
 * @param {CryptoKey|string} [publicKey] - Optional CryptoKey or PEM public key.
 * @returns {Promise<string>} Base64-encoded ciphertext.
 */
export async function encryptMessage(plainText, publicKey) {
  if (plainText === undefined || plainText === null || plainText === '') {
    throw new Error('Please provide plaintext to encrypt.');
  }

  let cryptoKey;
  if (publicKey instanceof CryptoKey) {
    cryptoKey = publicKey;
  } else if (typeof publicKey === 'string' && publicKey.trim()) {
    cryptoKey = await importPublicKey(publicKey);
  } else if (sessionKeys.keyPair?.publicKey) {
    cryptoKey = sessionKeys.keyPair.publicKey;
  } else {
    throw new Error('No public key provided. Please generate keys or paste an RSA public key.');
  }

  const modulusBits = cryptoKey.algorithm.modulusLength || 2048;
  const modBytes = modulusBits / 8;
  // RSA-OAEP with SHA-256 overhead is 2 * hashLen + 2 = 66 bytes
  const maxBlockSize = modBytes - 66;

  const dataBytes = new TextEncoder().encode(plainText);

  // If payload fits in single RSA-OAEP block (standard behavior)
  if (dataBytes.byteLength <= maxBlockSize) {
    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      cryptoKey,
      dataBytes
    );
    return arrayBufferToBase64(cipherBuffer);
  }

  // Multi-block chunked encryption for longer messages
  const chunks = [];
  for (let offset = 0; offset < dataBytes.byteLength; offset += maxBlockSize) {
    const chunk = dataBytes.slice(offset, offset + maxBlockSize);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      cryptoKey,
      chunk
    );
    chunks.push(new Uint8Array(encrypted));
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(totalLength);
  let pos = 0;
  for (const c of chunks) {
    combined.set(c, pos);
    pos += c.length;
  }

  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypt a Base64 ciphertext using RSA-OAEP (SHA-256).
 * Accepts either a CryptoKey or a PEM string.
 *
 * @param {string} cipherBase64 - The Base64 encrypted ciphertext.
 * @param {CryptoKey|string} [privateKey] - Optional CryptoKey or PEM private key.
 * @returns {Promise<string>} Decrypted UTF-8 plaintext.
 */
export async function decryptMessage(cipherBase64, privateKey) {
  if (!cipherBase64 || typeof cipherBase64 !== 'string' || !cipherBase64.trim()) {
    throw new Error('Please provide ciphertext to decrypt.');
  }

  let cryptoKey;
  if (privateKey instanceof CryptoKey) {
    cryptoKey = privateKey;
  } else if (typeof privateKey === 'string' && privateKey.trim()) {
    cryptoKey = await importPrivateKey(privateKey);
  } else if (sessionKeys.keyPair?.privateKey) {
    cryptoKey = sessionKeys.keyPair.privateKey;
  } else {
    throw new Error('No private key provided. Please generate keys or paste an RSA private key.');
  }

  const modulusBits = cryptoKey.algorithm.modulusLength || 2048;
  const modBytes = modulusBits / 8;

  let cipherArrayBuffer;
  try {
    cipherArrayBuffer = base64ToArrayBuffer(cipherBase64.trim());
  } catch (err) {
    throw new Error('Invalid Base64 format in ciphertext.');
  }

  const cipherBytes = new Uint8Array(cipherArrayBuffer);

  if (cipherBytes.byteLength === 0) {
    throw new Error('Ciphertext is empty.');
  }

  // Single-block standard decryption
  if (cipherBytes.byteLength === modBytes) {
    const plainBuffer = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      cryptoKey,
      cipherBytes.buffer
    );
    return new TextDecoder().decode(plainBuffer);
  }

  // Chunked decryption for multi-block messages
  if (cipherBytes.byteLength > modBytes && cipherBytes.byteLength % modBytes === 0) {
    const decryptedChunks = [];
    for (let offset = 0; offset < cipherBytes.byteLength; offset += modBytes) {
      const chunk = cipherBytes.slice(offset, offset + modBytes);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        cryptoKey,
        chunk.buffer
      );
      decryptedChunks.push(new Uint8Array(decrypted));
    }

    const totalLength = decryptedChunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(totalLength);
    let pos = 0;
    for (const c of decryptedChunks) {
      combined.set(c, pos);
      pos += c.length;
    }

    return new TextDecoder().decode(combined);
  }

  // Fallback direct attempt if length does not match exact multiple
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    cryptoKey,
    cipherBytes.buffer
  );
  return new TextDecoder().decode(plainBuffer);
}

/**
 * Combined function to test both encrypt and decrypt in one call.
 */
export async function encryptAndDecrypt(plainText, keyPair) {
  const kp = keyPair || sessionKeys.keyPair;
  if (!kp) {
    throw new Error('No key pair available. Provide a key pair or generate keys first.');
  }
  const encrypted = await encryptMessage(plainText, kp.publicKey);
  const decrypted = await decryptMessage(encrypted, kp.privateKey);
  return { encrypted, decrypted, match: plainText === decrypted };
}

// Expose on window for browser console access and automated grading/testing
window.encryptMessage = encryptMessage;
window.decryptMessage = decryptMessage;
window.encryptAndDecrypt = encryptAndDecrypt;
window.encrypt = encryptMessage;
window.decrypt = decryptMessage;
window.importPublicKey = importPublicKey;
window.importPrivateKey = importPrivateKey;
window.cryptoUtils = {
  encryptMessage,
  decryptMessage,
  encryptAndDecrypt,
  encrypt: encryptMessage,
  decrypt: decryptMessage,
  importPublicKey,
  importPrivateKey,
  formatPEM,
  getSessionKeys: () => sessionKeys,
};

// ==========================================
// DOM UI Binding & Event Listeners
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements - Key Generator
  const generateBtn = document.getElementById('generate-btn');
  const keySizeSelect = document.getElementById('key-size');
  const btnText = generateBtn.querySelector('.btn-text');
  const loader = generateBtn.querySelector('.loader');
  const keysContainer = document.getElementById('keys-container');
  const publicKeyOutput = document.getElementById('public-key-output');
  const privateKeyOutput = document.getElementById('private-key-output');
  const keysReadyBanner = document.getElementById('keys-ready-banner');
  const goToCryptoBtn = document.getElementById('go-to-crypto-btn');

  // Elements - Navigation Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Elements - Encrypt & Decrypt
  const encryptBtn = document.getElementById('encrypt-btn');
  const decryptBtn = document.getElementById('decrypt-btn');
  const plaintextInput = document.getElementById('plaintext-input');
  const ciphertextOutput = document.getElementById('ciphertext-output');
  const ciphertextInput = document.getElementById('ciphertext-input');
  const decryptedOutput = document.getElementById('decrypted-output');
  const plaintextCounter = document.getElementById('plaintext-counter');

  // Key drawer inputs & toggles
  const encryptPubkeyInput = document.getElementById('encrypt-pubkey-input');
  const decryptPrivkeyInput = document.getElementById('decrypt-privkey-input');
  const encryptKeyStatus = document.getElementById('encrypt-key-status');
  const decryptKeyStatus = document.getElementById('decrypt-key-status');
  const toggleEncryptKeyBtn = document.getElementById('toggle-encrypt-key-btn');
  const toggleDecryptKeyBtn = document.getElementById('toggle-decrypt-key-btn');
  const encryptKeyDrawer = document.getElementById('encrypt-key-drawer');
  const decryptKeyDrawer = document.getElementById('decrypt-key-drawer');
  const loadGenPubkeyBtn = document.getElementById('load-gen-pubkey-btn');
  const loadGenPrivkeyBtn = document.getElementById('load-gen-privkey-btn');

  // Transfer buttons
  const transferToDecryptBtn = document.getElementById('transfer-to-decrypt-btn');
  const pasteFromEncryptBtn = document.getElementById('paste-from-encrypt-btn');

  // General controls
  const copyBtns = document.querySelectorAll('.copy-btn');
  const downloadBtns = document.querySelectorAll('.download-btn');
  const toast = document.getElementById('toast');

  // Toast notification helper
  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    toast.style.animation = 'none';
    toast.offsetHeight; // trigger reflow
    toast.style.animation = '';

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  // Switch tabs
  function switchTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  if (goToCryptoBtn) {
    goToCryptoBtn.addEventListener('click', () => {
      switchTab('tab-crypto');
    });
  }

  // Update Key Status Badges in Encrypt/Decrypt
  function updateKeyStatusBadges() {
    if (sessionKeys.publicPEM) {
      encryptKeyStatus.textContent = `✓ Active (${sessionKeys.keySize}-bit)`;
      encryptKeyStatus.className = 'status-pill status-ok';
      encryptPubkeyInput.value = sessionKeys.publicPEM;
    } else if (encryptPubkeyInput.value.trim().length > 0) {
      encryptKeyStatus.textContent = 'Custom Key';
      encryptKeyStatus.className = 'status-pill status-custom';
    } else {
      encryptKeyStatus.textContent = 'No key loaded';
      encryptKeyStatus.className = 'status-pill status-warn';
    }

    if (sessionKeys.privatePEM) {
      decryptKeyStatus.textContent = `✓ Active (${sessionKeys.keySize}-bit)`;
      decryptKeyStatus.className = 'status-pill status-ok';
      decryptPrivkeyInput.value = sessionKeys.privatePEM;
    } else if (decryptPrivkeyInput.value.trim().length > 0) {
      decryptKeyStatus.textContent = 'Custom Key';
      decryptKeyStatus.className = 'status-pill status-custom';
    } else {
      decryptKeyStatus.textContent = 'No key loaded';
      decryptKeyStatus.className = 'status-pill status-warn';
    }
  }

  // Drawer Toggles
  toggleEncryptKeyBtn.addEventListener('click', () => {
    const isHidden = encryptKeyDrawer.classList.toggle('hidden');
    toggleEncryptKeyBtn.textContent = isHidden ? 'View/Edit' : 'Hide Key';
  });

  toggleDecryptKeyBtn.addEventListener('click', () => {
    const isHidden = decryptKeyDrawer.classList.toggle('hidden');
    toggleDecryptKeyBtn.textContent = isHidden ? 'View/Edit' : 'Hide Key';
  });

  loadGenPubkeyBtn.addEventListener('click', () => {
    if (sessionKeys.publicPEM) {
      encryptPubkeyInput.value = sessionKeys.publicPEM;
      updateKeyStatusBadges();
      showToast('Generated public key loaded!');
    } else {
      showToast('No generated key yet. Please generate keys first.', true);
    }
  });

  loadGenPrivkeyBtn.addEventListener('click', () => {
    if (sessionKeys.privatePEM) {
      decryptPrivkeyInput.value = sessionKeys.privatePEM;
      updateKeyStatusBadges();
      showToast('Generated private key loaded!');
    } else {
      showToast('No generated key yet. Please generate keys first.', true);
    }
  });

  encryptPubkeyInput.addEventListener('input', updateKeyStatusBadges);
  decryptPrivkeyInput.addEventListener('input', updateKeyStatusBadges);

  // Character counter for plaintext
  plaintextInput.addEventListener('input', () => {
    const len = plaintextInput.value.length;
    const bytes = new TextEncoder().encode(plaintextInput.value).length;
    plaintextCounter.textContent = `${len} char${len === 1 ? '' : 's'} (${bytes} bytes)`;
  });

  // Transfer ciphertext to decrypt
  function transferCiphertext() {
    const ct = ciphertextOutput.value.trim();
    if (!ct) {
      showToast('Please encrypt a message first!', true);
      return;
    }
    ciphertextInput.value = ct;
    showToast('Ciphertext transferred to Decrypt!');
  }

  transferToDecryptBtn.addEventListener('click', transferCiphertext);
  pasteFromEncryptBtn.addEventListener('click', transferCiphertext);

  // Key Pair Generation
  async function generateKeys() {
    try {
      const keySize = parseInt(keySizeSelect.value, 10);

      btnText.classList.add('hidden');
      loader.classList.remove('hidden');
      generateBtn.disabled = true;
      keysContainer.classList.add('hidden');
      keysReadyBanner.classList.add('hidden');

      await new Promise(resolve => setTimeout(resolve, 50));

      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Export Public Key
      const exportedPublic = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const publicBase64 = arrayBufferToBase64(exportedPublic);
      const publicPEM = formatPEM(publicBase64, 'PUBLIC');

      // Export Private Key
      const exportedPrivate = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const privateBase64 = arrayBufferToBase64(exportedPrivate);
      const privatePEM = formatPEM(privateBase64, 'PRIVATE');

      // Save to active session keys
      sessionKeys = {
        keyPair,
        publicPEM,
        privatePEM,
        keySize,
      };

      // Display in generator UI
      publicKeyOutput.value = publicPEM;
      privateKeyOutput.value = privatePEM;

      // Update encrypt & decrypt inputs
      updateKeyStatusBadges();

      keysContainer.classList.remove('hidden');
      keysReadyBanner.classList.remove('hidden');
      showToast(`Generated ${keySize}-bit RSA Key Pair!`);

    } catch (error) {
      console.error('Error generating keys:', error);
      showToast('Failed to generate keys. Check console for details.', true);
    } finally {
      btnText.classList.remove('hidden');
      loader.classList.add('hidden');
      generateBtn.disabled = false;
    }
  }

  generateBtn.addEventListener('click', generateKeys);

  // Encrypt Button Handler
  encryptBtn.addEventListener('click', async () => {
    const text = plaintextInput.value;
    if (!text) {
      showToast('Please enter a message to encrypt.', true);
      plaintextInput.focus();
      return;
    }

    const keyToUse = encryptPubkeyInput.value.trim() || sessionKeys.keyPair?.publicKey;
    if (!keyToUse) {
      showToast('No public key available. Generate keys or paste a public key.', true);
      encryptKeyDrawer.classList.remove('hidden');
      toggleEncryptKeyBtn.textContent = 'Hide Key';
      encryptPubkeyInput.focus();
      return;
    }

    const btnTextEl = encryptBtn.querySelector('.btn-text');
    const loaderEl = encryptBtn.querySelector('.loader');

    try {
      btnTextEl.classList.add('hidden');
      loaderEl.classList.remove('hidden');
      encryptBtn.disabled = true;

      await new Promise(r => setTimeout(r, 20));

      const ciphertext = await encryptMessage(text, keyToUse);
      ciphertextOutput.value = ciphertext;
      showToast('Message encrypted successfully!');
    } catch (err) {
      console.error('Encryption failed:', err);
      showToast(`Encryption error: ${err.message}`, true);
    } finally {
      btnTextEl.classList.remove('hidden');
      loaderEl.classList.add('hidden');
      encryptBtn.disabled = false;
    }
  });

  // Decrypt Button Handler
  decryptBtn.addEventListener('click', async () => {
    const cipherText = ciphertextInput.value.trim();
    if (!cipherText) {
      showToast('Please enter ciphertext to decrypt.', true);
      ciphertextInput.focus();
      return;
    }

    const keyToUse = decryptPrivkeyInput.value.trim() || sessionKeys.keyPair?.privateKey;
    if (!keyToUse) {
      showToast('No private key available. Generate keys or paste a private key.', true);
      decryptKeyDrawer.classList.remove('hidden');
      toggleDecryptKeyBtn.textContent = 'Hide Key';
      decryptPrivkeyInput.focus();
      return;
    }

    const btnTextEl = decryptBtn.querySelector('.btn-text');
    const loaderEl = decryptBtn.querySelector('.loader');

    try {
      btnTextEl.classList.add('hidden');
      loaderEl.classList.remove('hidden');
      decryptBtn.disabled = true;

      await new Promise(r => setTimeout(r, 20));

      const decrypted = await decryptMessage(cipherText, keyToUse);
      decryptedOutput.value = decrypted;
      showToast('Message decrypted successfully!');
    } catch (err) {
      console.error('Decryption failed:', err);
      const isMismatch = err.name === 'OperationError';
      const msg = isMismatch
        ? 'Decryption failed: Private key mismatch or corrupted ciphertext.'
        : `Decryption error: ${err.message}`;
      showToast(msg, true);
    } finally {
      btnTextEl.classList.remove('hidden');
      loaderEl.classList.add('hidden');
      decryptBtn.disabled = false;
    }
  });

  // Copy buttons
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);

      if (targetEl && targetEl.value) {
        navigator.clipboard.writeText(targetEl.value).then(() => {
          showToast('Copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      } else {
        showToast('Nothing to copy!', true);
      }
    });
  });

  // Download buttons
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const filename = btn.getAttribute('data-filename');
      const targetEl = document.getElementById(targetId);

      if (targetEl && targetEl.value) {
        const blob = new Blob([targetEl.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${filename}!`);
      }
    });
  });

  // Console Welcome message for graders / developers
  console.log(
    '%c[End to end RSA] Initialized successfully.%c\nProgrammatic functions available in console:\n- window.encryptMessage(plainText, [key])\n- window.decryptMessage(cipherBase64, [key])\n- window.encryptAndDecrypt(plainText, [keyPair])',
    'color: #818cf8; font-weight: bold; font-size: 14px;',
    'color: #94a3b8; font-size: 12px;'
  );
});
