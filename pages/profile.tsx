/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";
import { BaseLayout } from "@ui";

import { Nft } from "@_types/nft";
import { useListingPrice, useOwnedNfts } from "@hooks/web3";
import { ChangeEvent, useEffect, useState } from "react";
import { ExclamationIcon } from "@heroicons/react/outline";

const tabs = [{ name: "Your Collection", href: "#", current: true }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Profile: NextPage = () => {
  const { nfts } = useOwnedNfts();
  const { listingPrice } = useListingPrice();
  const [nftPrice, setNftPrice] = useState(0);
  const [activeNft, setActiveNft] = useState<Nft>();

  useEffect(() => {
    if (nfts.data && nfts.data.length > 0) {
      setActiveNft(nfts.data[0]);
    }

    return () => setActiveNft(undefined);
  }, [nfts.data]);

  const onDownloadImageClicked = async () => {
    const image = await fetch(activeNft!.meta.image);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = activeNft!.meta.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onNftPriceChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const price = event.target.value;
    setNftPrice(Number(price));
  };

  return (
    <BaseLayout>
      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">
                    Your NFTs
                  </h1>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav
                        className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                        aria-label="Tabs"
                      >
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? "page" : undefined}
                            className={classNames(
                              tab.current
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                {!nfts.data?.length && (
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
                            Purchase or create an NFT to be able to view it on
                            your profile page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <section
                  className="mt-8 pb-8"
                  aria-labelledby="gallery-heading"
                >
                  <ul
                    role="list"
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                  >
                    {nfts.data?.length
                      ? (nfts.data as Nft[]).map((nft) => (
                          <li
                            key={nft.tokenId}
                            onClick={() => setActiveNft(nft)}
                            className="relative"
                          >
                            <div
                              className={classNames(
                                nft.tokenId == activeNft?.tokenId
                                  ? "ring-2 ring-offset-2 ring-indigo-500"
                                  : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500",
                                "group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden"
                              )}
                            >
                              <img
                                src={nft.meta.image}
                                alt=""
                                style={{ height: "168px", width: "168px" }}
                                className={classNames(
                                  nft.tokenId == activeNft?.tokenId
                                    ? ""
                                    : "group-hover:opacity-75",
                                  "object-cover pointer-events-none"
                                )}
                              />
                              <button
                                type="button"
                                className="absolute inset-0 focus:outline-none"
                              >
                                <span className="sr-only">
                                  View details for {nft.meta.name}
                                </span>
                              </button>
                            </div>
                            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                              {nft.meta.name}
                            </p>
                          </li>
                        ))
                      : ""}
                  </ul>
                </section>
              </div>
            </main>

            {/* Details sidebar */}
            {nfts.data?.length > 0 ? (
              <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
                {activeNft && (
                  <div className="pb-16 space-y-6">
                    <div>
                      <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                        <img
                          src={activeNft.meta.image}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            <span className="sr-only">Details for </span>
                            {activeNft.meta.name}
                          </h2>
                          <p className="text-sm font-medium text-gray-500">
                            {activeNft.meta.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Information</h3>
                      <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        {activeNft.meta.attributes.map((attr) => (
                          <div
                            key={attr.trait_type}
                            className="py-3 flex justify-between text-sm font-medium"
                          >
                            <dt className="text-gray-500">
                              {attr.trait_type}:{" "}
                            </dt>
                            <dd className="text-gray-900 text-right">
                              {attr.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    {!activeNft.isListed && (
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Price
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <img
                              className="h-6"
                              alt="ether icon"
                              src="/images/small-eth.webp"
                            />
                          </div>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            onChange={onNftPriceChanged}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center"></div>
                        </div>
                      </div>
                    )}
                    <div className="flex">
                      <button
                        type="button"
                        className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onDownloadImageClicked}
                      >
                        Download Image
                      </button>
                      <button
                        disabled={activeNft.isListed || nftPrice <= 0}
                        onClick={() => {
                          nfts.listNft(activeNft.tokenId, nftPrice);
                        }}
                        type="button"
                        className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {activeNft.isListed ? "Nft is listed" : "List Nft"}
                      </button>
                    </div>
                    {!activeNft.isListed && (
                      <div className="flex justify-center mt-6">
                        <p>
                          Listing price: <strong>{listingPrice.data}</strong>
                        </p>
                        <img
                          className="h-6"
                          alt="ether icon"
                          src="/images/small-eth.webp"
                        />
                      </div>
                    )}
                  </div>
                )}
              </aside>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Profile;
