import { useHooks } from "@providers/web3";

export const useAccount = () => {
  const hooks = useHooks();
  const swrRes = hooks.useAccount();

  return {
    account: swrRes,
  };
};

export const useNetwork = () => {
  const hooks = useHooks();
  const swrRes = hooks.useNetwork();

  return {
    network: swrRes,
  };
};

export const useListedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useListedNfts();

  return {
    nfts: swrRes,
  };
};

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts();

  return {
    nfts: swrRes,
  };
};

export const useListingPrice = () => {
  const hooks = useHooks();
  return {
    listingPrice: hooks.useListingPrice()
  }
}