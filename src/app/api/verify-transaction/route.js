// Ajoutez les configurations de votre blockchain personnalisée
// http://localhost:3000/api/verify-transaction?hash=0xb9f7fc5fb90010c86c9d7f98d114ce2ca6a5bdc1ca54df559fd8fac0f86b7b2d&public_key=0x00Eb3c754c75bfa0Ae49EC503999584F2F8971f3&product_id=1728176025&company_id=123456789123456789

import { ethers } from 'ethers';
import { createPublicClient, http } from 'viem'

import { verax } from '../utils/verax' //sepolia

export const publicClient = createPublicClient({ 
  chain: verax,
  transport: http()
})

// app/api/checkTransaction/route.js
const blockchainConfig = {
  chainId: '66666', // Remplacez par votre chainId
  rpcUrl: 'http://172.210.92.252:9650/ext/bc/YLpJMdt6ujkeuYo4oCHfn511fFzqH27PatVtTSMQZx9yfh3BL/rpc', // Remplacez par votre RPC
  tokenName: 'VRZN', // Remplacez par le nom de votre token
  smartContractAddress: '0x4475A8FBeF5Cf4a92a484B6f5602A91F3abC72D8'
};

export async function POST(request) {
  const { hash, public_key, product_id, company_id } = await request.json();

  console.log("hash ", hash);
  console.log("public_key ", public_key);
  console.log("product_id ", product_id);
  console.log("company_id ", company_id);

  if (!hash || !public_key || !product_id || !company_id) {
    return new Response(JSON.stringify({ message: 'Missing parameters' }), {
      status: 400, // Bad Request
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const userProductAdded = await addUserProduct(public_key, company_id, product_id);

  if (userProductAdded) {
    return new Response(JSON.stringify({ message: 'User product added successfully', hash, public_key, product_id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Failed to add user product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// async function checkTransaction(hash, public_key) {
//   try {
//     const response = await fetch(blockchainConfig.rpcUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         id: 1,
//         method: 'eth_getTransactionByHash',
//         params: [hash],
//       }),
//     });

//     const data = await response.json();

//     if (data.result) {
//       const transactionFrom = data.result.from.toLowerCase();

//       if (data.result.to && data.result.to.toLowerCase() === blockchainConfig.smartContractAddress.toLowerCase()) {
//         return transactionFrom === public_key.toLowerCase();
//       }
//     }

//     return false;
//   } catch (error) {
//     console.error('Error fetching transaction:', error);
//     return false;
//   }
// }

async function addUserProduct(public_key, company_id, product_id) {
  try {
    // TODO: Cette approche est biensûr fonctionnel mais pas la meilleur manière de gérer la chose.
    // L'idée serait d'utiliser un Key Manager (comme peut le faire Tatum). C'est un système secure
    // à mettre en place qui permet d'avoir plus de vérification lors de la signature ET surtout de ne
    // pas utiliser la privateKey comme ça mais d'avoir une signatureId qui permettrait de signer à la volé.
    const provider = new ethers.JsonRpcProvider(blockchainConfig.rpcUrl);
    let privateKey = process.env.NEXT_PUBLIC_PK_LEDGER;
    if (company_id === 666666)
      privateKey = process.NEXT_PUBLIC_PK_AVALANCHE

    const wallet = new ethers.Wallet(privateKey, provider);
    const functionId = "0694adb5"
    const dataToSend = `0x${functionId}${getAddUserProductABI(public_key, company_id, product_id)}`

    
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    const tx = {
      to: blockchainConfig.smartContractAddress,
      data: dataToSend,
      gasLimit: BigInt(300000),
      gasPrice: gasPrice
    };

    const response = await wallet.sendTransaction(tx);
    console.log("Transaction envoyée : ", response.hash);

    const receipt = await response.wait();
    console.log("Transaction minée : ", receipt.hash);

    return receipt.status === 1; // Retourne true si la transaction a été minée avec succès
  } catch (error) {
    console.error('Error adding user product:', error);
    return false; // En cas d'erreur, on retourne false
  }
}

// Fonction pour générer l'ABI pour appeler addUserProduct
function getAddUserProductABI(address, company_id, product_id) {
  const formattedAddress = address.toLowerCase().slice(2).padStart(64, '0');
  const formattedCompanyId = BigInt(company_id).toString(16).padStart(64, '0');
  const formattedProductId = BigInt(product_id).toString(16).padStart(64, '0');
  const data = `${formattedAddress}${formattedCompanyId}${formattedProductId}`;
  return data;
}