import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  encryption(val: string) {
    const ciphertext = CryptoTS.AES.encrypt(val, environment.encrypt);
    return ciphertext.toString();
  }

  decryption(val: string) {
    const bytes = CryptoTS.AES.decrypt(val, environment.encrypt);
    const plaintext = bytes.toString(CryptoTS.enc.Utf8);
    return plaintext;
  }
}
