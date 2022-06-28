/* eslint-disable @next/next/no-img-element */

import type { GetStaticProps, NextPage } from "next";
import { BaseLayout, NftPreview } from "@ui";
import { useListedNfts, useNetwork } from "@hooks/web3";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Nft } from "@_types/nft";
import { useRouter } from "next/router";

const NftView: NextPage<{ tokenId: string }> = () => {
  const router = useRouter();
  const [activeNft, setActiveNft] = useState<Nft>({
    creator: "",
    isListed: true,
    meta: {
      attributes: [
        {
          trait_type: "attack",
          value: "0",
        },
        {
          trait_type: "health",
          value: "0",
        },
        {
          trait_type: "speed",
          value: "0",
        },
      ],
      description: "",
      image: "",
      name: "",
    },
    price: 0,
    tokenId: 2,
  } as Nft);
  const { network } = useNetwork();
  const { nfts } = useListedNfts();

  useEffect(() => {
    const { tokenId } = router.query as { tokenId: string };
    setActiveNft((previousNft) => {
      if (nfts.data && tokenId) {
        const nft = nfts.data.find(
          (nft) => nft.tokenId === Number(tokenId)
        ) as Nft;
        if (nft) return nft;
      }
      return previousNft;
    });
  }, [nfts.data, router, router.query]);

  return (
    <BaseLayout>
      <div className="relative bg-gray-100 pb-20 px-4 sm:px-6 lg:pb-28 lg:px-8">
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Amazing Creatures NFTs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
          {network.isConnectedToNetwork && activeNft.creator ? (
            <NftPreview buyNft={nfts.buyNft} item={activeNft} />
          ) : (
            <div className="rounded-md bg-yellow-50 p-4 mt-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationIcon
                    className="h-5 w-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention needed
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      {network.isLoading
                        ? "Loading..."
                        : `Connect to ${network.targetNetwork}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

export default NftView;
