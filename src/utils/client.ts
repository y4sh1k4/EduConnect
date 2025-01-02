import { Client, type Signer } from "@xmtp/browser-sdk";
 
const accountAddress = "0x...";
const signer: Signer = {
  getAddress: () => accountAddress,
  signMessage: async (message: string) => {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, accountAddress]
    });
    return signature;
  },
};
 
// this value should be generated once per installation and stored securely
const encryptionKey = window.crypto.getRandomValues(new Uint8Array(32));
 
const client = await Client.create(
  signer,
  encryptionKey
);