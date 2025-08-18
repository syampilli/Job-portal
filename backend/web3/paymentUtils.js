import { ethers } from 'ethers';

export const validatePayment = async (txHash, expectedAmount, chain = 'sepolia') => {
  const provider = new ethers.JsonRpcProvider(
    `https://${chain}.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const tx = await provider.getTransaction(txHash);

  if (!tx) throw new Error('Transaction not found');

  if (tx.to.toLowerCase() !== process.env.ADMIN_WALLET_ADDRESS.toLowerCase()) {
    throw new Error('Payment not sent to admin');
  }

  const amountInEth = parseFloat(ethers.formatEther(tx.value));
  if (amountInEth < expectedAmount) {
    throw new Error('Insufficient amount');
  }

  return true;
};
