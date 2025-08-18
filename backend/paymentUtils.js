import { ethers } from 'ethers';

export const validatePayment = async (txHash, expectedAmount, chain = 'goerli') => {
  const provider = new ethers.InfuraProvider(chain, process.env.INFURA_API_KEY); // or use Alchemy
  const tx = await provider.getTransaction(txHash);

  if (!tx) throw new Error('Transaction not found');
  if (tx.to.toLowerCase() !== process.env.ADMIN_WALLET_ADDRESS.toLowerCase())
    throw new Error('Payment not sent to admin');
  if (ethers.formatEther(tx.value) < expectedAmount)
    throw new Error('Insufficient amount');

  return true;
};
