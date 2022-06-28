const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther("0.3").toString();
  let _listingPrice = ethers.utils.parseEther("0.025").toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("owner of first token should be address 0", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(
        owner,
        accounts[0],
        "Owner of token is not matching address 0"
      );
    });

    it("first token should point to the correct token URI", async () => {
      const actualTokenUri = await _contract.tokenURI(1);
      assert.equal(actualTokenUri, tokenURI, "TokenURI is not correctly set");
    });

    it("should not be possible to create an NFT with an existing tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
          value: _listingPrice,
        });
      } catch (error) {
        assert(error, "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItem = await _contract.listedItemsCount();
      assert.equal(listedItem.toNumber(), 1, "Listed item count is not 1");
    });

    it("should have created NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);
      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, _nftPrice, "Nft price is not correct");
      assert.equal(
        nftItem.creator,
        accounts[0],
        "Token creator is not accounts[0]"
      );
      assert.equal(nftItem.isListed, true, "Token is not listed");
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(
        listedItem.isListed,
        false,
        "Item is still listed after purchase"
      );
    });

    it("should decrease the listed items count", async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(
        listedItemsCount.toNumber(),
        0,
        "Listed item count has not been decremented"
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(
        currentOwner,
        accounts[1],
        "Owner has not changed after purchase"
      );
    });
  });

  describe("Token transfers", () => {
    const tokenURI = "https://test-json-2.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(
        totalSupply.toNumber(),
        2,
        "Total supply of tokens is not correct"
      );
    });

    it("should be able to retrieve NFTs by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);
      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    });

    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has the wrong id");
    });

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has the wrong id");
    });

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has the wrong id");
    });
  });

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(
        ownedNfts.length,
        0,
        "accounts[0] has more tokens than it should"
      );
    });

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(
        ownedNfts.length,
        2,
        "accounts[1] less tokens than it should"
      );
    });
  });

  describe("Burn token", () => {
    before(async () => {
      const tokenURI = "https://test-json-3.com";
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[2],
        value: _listingPrice,
      });
    });

    it("accounts[2] should own one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });
      assert.equal(ownedNfts.length, 1, "accounts[2] incorrect amount of NFTs");
    });

    it("accounts[2] should own zero NFTs after burn", async () => {
      await _contract.burnToken(3, { from: accounts[2] });
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[2] });
      assert.equal(ownedNfts.length, 0, "accounts[2] should have owned 0 NFTs");
    });
  });

  describe("List an NFT", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();
      assert.equal(listedNfts.length, 3, "Invalid listed items quantity");
    });

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(
        ownedNfts.length,
        2,
        "accounts[1] less tokens than it should"
      );
    });

    it("should set new listing price", async () => {
      await _contract.setListingPrice(_listingPrice, { from: accounts[0] });
      const listingPrice = await _contract.listingPrice();
      assert.equal(
        listingPrice.toString(),
        _listingPrice,
        "accounts[1] less tokens than it should"
      );
    });
  });
});
