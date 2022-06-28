import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

type UseListedNftsResponse = {
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
    () => {
      const { data, ...swr } = useSWR(
        contract ? "web3/useListedNfts" : null,
        async () => {
          const nfts = [] as Nft[];
          const coreNfts = await contract!.getAllNftsOnSale();

          for (let i = 0; i < coreNfts.length; i++) {
            const item = coreNfts[i];
            const tokenURI = await contract!.tokenURI(item.tokenId);
            const metaResponse = await fetch(tokenURI);
            const meta = await metaResponse.json();

            nfts.push({
              price: parseFloat(ethers.utils.formatEther(item.price)),
              tokenId: item.tokenId.toNumber(),
              creator: item.creator,
              isListed: item.isListed,
              meta,
            });
          }

          return nfts;
        }
      );
      const _contract = contract;

      const buyNft = useCallback(
        async (tokenId: number, value: number) => {
          try {
            const result = await contract!.buyNft(tokenId, {
              value: ethers.utils.parseEther(value.toString()),
            });

            await toast.promise(result?.wait(), {
              pending: "Processing transaction",
              success: "Nft has been purchased successfully",
              error: "Processing error",
            });
          } catch (e: any) {
            console.error(e.message);
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [_contract]
      );

      return {
        data: data || [],
        buyNft,
        ...swr,
      };
    };