import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const mainnetClient = createPublicClient({
    chain: sepolia,
    transport: http(),
});

const ensCache = new Map<string, string | null>();

export async function resolveEnsName(address: string): Promise<string | null> {
    if (ensCache.has(address)) {
        return ensCache.get(address) ?? null;
    }

    try {
        const ensName = await mainnetClient.getEnsName({
            address: address as `0x${string}`,
        });
        ensCache.set(address, ensName);
        return ensName;
    } catch (error) {
        console.error(`Failed to resolve ENS for ${address}:`, error);
        ensCache.set(address, null);
        return null;
    }
}

export function truncateAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
