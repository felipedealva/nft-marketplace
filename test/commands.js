const instance = await NftMarket.deployed();
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmWn5vC9PbjFy5zvGat2xSWodPAy2cG4QJfqXyEFsJB8WF","100000000000000000",{value: "25000000000000000",from: accounts[0],});

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmNQtbuDbSAvQRkzuYnubkjKR8PKbizQo4TYMaoprDgG7m","300000000000000000",{value: "25000000000000000",from: accounts[0],});
