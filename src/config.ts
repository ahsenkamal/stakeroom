import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'stakeroom',
  projectId: 'PROJECT_ID',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true, 
});