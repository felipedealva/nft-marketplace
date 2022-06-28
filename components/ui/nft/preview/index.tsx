/* eslint-disable @next/next/no-img-element */
import { Nft } from "@_types/nft";
import Link from "next/link";
import { FunctionComponent } from "react";

type NftPreviewProps = {
  item: Nft;
  buyNft: (tokenId: number, value: number) => Promise<void>;
};

const NftPreview: FunctionComponent<NftPreviewProps> = ({ item, buyNft }) => {
  return (
    <div
      className="flex mt-8 shadow-md overflow-hidden mx-auto max-w-7xl"
      style={{ borderRadius: "15px" }}
    >
      <img
        className="h-50 w-50 object-cover"
        src={item.meta.image}
        alt="New NFT"
      />
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600">
            Creator: <strong>{item.creator}</strong>
          </p>
          <div className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">
              {item.meta.name}
            </p>
            <p className="mt-3 mb-3 text-base text-gray-500">
              {item.meta.description}
            </p>
          </div>
        </div>
        <div className="overflow-hidden mb-4">
          <dl className="-mx-4 -mt-4 flex flex-wrap justify-center">
            <div className="flex flex-col px-4 pt-4">
              <dt className="order-2 text-sm font-medium text-gray-500">
                Price
              </dt>
              <dd className="order-1 text-xl font-extrabold text-indigo-600">
                <div className="flex justify-center items-center">
                  {item.price}
                  <img
                    className="h-6"
                    alt="ether icon"
                    src="/images/small-eth.webp"
                  />
                </div>
              </dd>
            </div>
            {item.meta.attributes.map((attribute) => (
              <div
                key={attribute.trait_type}
                className="flex flex-col px-4 pt-4"
              >
                <dt className="order-2 text-sm font-medium text-gray-500">
                  {attribute.trait_type}
                </dt>
                <dd className="order-1 text-xl font-extrabold text-indigo-600">
                  {attribute.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <button
            type="button"
            className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
            onClick={() => {
              buyNft(item.tokenId, item.price);
            }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default NftPreview;
