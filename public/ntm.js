(function () {
    // Fonction pour charger ethers.js
    function loadEthersScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/ethers@6.6.0/dist/ethers.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject('Failed to load ethers.js');
        script.async = true;
        document.head.appendChild(script);
      });
    }
  
    // Charger ethers.js, puis initialiser
    loadEthersScript()
      .then(() => {
        console.log(" -- ETHERS.JS LOADED SUCCESSFULLY -- ");
        initialize();
      })
      .catch((error) => {
        console.error(error);
      });
  
    // Initialisation du processus
    function initialize() {
      console.log(" -- INITIALIZE FUNCTION STARTED -- ");
  
      // Crée le bouton de connexion Web3
      console.log(" -- CREATE LOGIN BUTTON STARTED -- ");
      const button = document.createElement('button');
      button.innerText = 'Connect with Wallet';
      button.style.padding = '10px 20px';
      button.style.backgroundColor = '#4CAF50';
      button.style.color = '#ffffff';
      button.style.border = 'none';
      button.style.cursor = 'pointer';
      button.style.fontSize = '16px';
      button.id = 'web3-connect-button';
  
      // Ajoute le bouton à la div avec l'id "connect"
      const targetDiv = document.getElementById('connect');
      console.log(" -- TARGET DIV FOUND -- ", targetDiv);
      if (targetDiv) {
        targetDiv.appendChild(button);
      } else {
        console.error('Div with ID "connect" not found. Cannot insert login button.');
        return;
      }
  
      // Attendre que ethers soit chargé avant d'activer le clic du bouton
      waitForEthers(() => {
        button.addEventListener('click', async () => {
          await connectWallet();
        });
        console.log(" -- LOGIN BUTTON CLICK HANDLER ATTACHED -- ");
      });
    }
  
    // Fonction pour attendre que ethers soit chargé
    function waitForEthers(callback) {
      const checkInterval = 100; // Vérifier toutes les 100 ms
      const maxRetries = 50; // Arrêter après 50 essais (5 secondes)
  
      let retries = 0;
  
      function checkEthersLoaded() {
        if (typeof ethers !== 'undefined') {
          callback();
        } else {
          retries++;
          if (retries < maxRetries) {
            setTimeout(checkEthersLoaded, checkInterval);
          } else {
            console.error('Ethers.js did not load in time. Please try refreshing the page.');
          }
        }
      }
  
      checkEthersLoaded();
    }
  
    // Fonction pour gérer la connexion avec un wallet Ethereum
    async function connectWallet() {
      try {
        console.log(" -- CONNECT WALLET FUNCTION STARTED -- ");
        // Vérifie si Metamask est disponible
        if (typeof window.ethereum !== 'undefined') {
          console.log('Metamask found. Connecting...');
  
          // Crée un fournisseur ethers.js
          const provider = new ethers.BrowserProvider(window.ethereum);
  
          // Demande l'accès aux comptes
          await provider.send("eth_requestAccounts", []);
  
          // Récupère le signer (compte qui signera les transactions)
          const signer = await provider.getSigner();
          console.log('Connected Wallet Address:', await signer.getAddress());
  
          // Créer un Smart Wallet (ou simuler des interactions)
          await createSmartWallet(provider, signer);
  
        } else {
          alert('Metamask is not installed. Please install it to continue.');
        }
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
      }
    }
  
    // Fonction pour créer ou interagir avec un Smart Wallet
    async function createSmartWallet(provider, signer) {
      try {
        // Adresse d'un exemple de contrat (à remplacer par l'adresse d'un vrai contrat déployé)
        const contractAddress = '0xYourSmartWalletContractAddressHere';
  
        // ABI du contrat (remplacez par l'ABI de votre Smart Wallet)
        const contractABI = [
          // Exemple simple d'interface : fonction qui retourne le propriétaire
          "function owner() view returns (address)",
          // Exemple : fonction qui permet de déposer de l'ether
          "function deposit() payable"
        ];
  
        // Créer une instance du contrat
        const smartWallet = new ethers.Contract(contractAddress, contractABI, signer);
  
        // Exemple d'interaction : vérifier le propriétaire du Smart Wallet
        const owner = await smartWallet.owner();
        console.log('Smart Wallet Owner:', owner);
  
        // Exemple d'interaction : dépôt dans le Smart Wallet
        const tx = await smartWallet.deposit({
          value: ethers.parseEther("0.1") // Dépose 0.1 ETH
        });
        console.log('Transaction sent, waiting for confirmation...');
        await tx.wait();
        console.log('Deposit confirmed in the Smart Wallet!');
  
      } catch (error) {
        console.error('Failed to create or interact with Smart Wallet:', error);
      }
    }
  })();
  