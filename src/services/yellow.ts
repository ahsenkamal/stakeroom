import { Client } from 'yellow-ts';
import { createAppSessionMessage, RPCProtocolVersion } from '@erc7824/nitrolite';
import { keccak256, toBytes } from 'viem'; 

const CLEARNODE_URL = 'wss://clearnet-sandbox.yellow.com/ws';

export class YellowService {
  private client: Client;
  private messageSigner: any;
  private userAddress: `0x${string}`;

  constructor(signer: any, userAddress: `0x${string}`) {
    this.messageSigner = signer;
    this.userAddress = userAddress;
    this.client = new Client({url: CLEARNODE_URL});
  }

  async connect() {
    await this.client.connect();
  }

  async joinEventSession(amount: string, side: 'YES' | 'NO' | 'STAKE', eventId: string, creatorAddress: `0x${string}`) {
    const sessionTag = keccak256(toBytes(eventId)); 

    const appDefinition = {
      protocol: RPCProtocolVersion.NitroRPC_0_4,
      participants: [this.userAddress, creatorAddress], 
      weights: [50, 50],
      quorum: 100,
      challenge: 0,
      nonce: 1, 
      appData: { 
        eventId, 
        side, 
        isJoining: true, 
        sessionTag 
      }, 
      application: 'stakeroom',
    };

    const allocations = [
      { participant: this.userAddress, asset: 'eth', amount: amount },
      { participant: creatorAddress, asset: 'eth', amount: '0' }
    ];

    const sessionMessage = await createAppSessionMessage(
      this.messageSigner, 
      { definition: appDefinition, allocations }
    );

    console.log(`🚀 Joining Event Room ${eventId}...`);
    return await this.client.sendMessage(sessionMessage);
  }

  disconnect() {
    this.client.disconnect();
  }
}