import { CryptoHookFactory } from "@_types/hooks";
import { ethers } from "ethers";
import useSWR from "swr";

type ListingPriceHookFactory = CryptoHookFactory<string>;

export type UseListingPriceHook = ReturnType<ListingPriceHookFactory>;

export const hookFactory: ListingPriceHookFactory =
  ({ contract }) =>
    () => {
      const { data, ...swr } = useSWR(
        contract ? "web3/useListingPrice" : null,
        async () => {
          const listingPriceWei = await contract!.listingPrice()
          const listingPrice = ethers.utils.formatEther(listingPriceWei.toString())

          return listingPrice;
        }
      );

      return {
        data: data || "",
        ...swr,
      };
    };
