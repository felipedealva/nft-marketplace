import { setupHooks, Web3Hooks } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Dependencies } from "@_types/hooks";
import { Contract, ethers, providers } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const createDefaultState = () => ({
  ethereum: null,
  contract: null,
  provider: null,
  isLoading: true,
  hooks: setupHooks({ isLoading: true } as any),
});

export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Dependencies) => ({
  ethereum,
  contract,
  provider,
  isLoading: false,
  hooks: setupHooks({ ethereum, provider, contract, isLoading }),
});

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const response = await fetch(`/contracts/${name}.json`);
  const Artifact = await response.json();

  const artifactAddress = Artifact.networks[NETWORK_ID].address;
  if (artifactAddress) {
    const contract = new ethers.Contract(
      artifactAddress,
      Artifact.abi,
      provider
    );

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] cannot be loaded`);
  }
};
