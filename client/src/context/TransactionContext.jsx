import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constant";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");
      const transactionsContract = getEthereumContract();
      const availableTransactions =
        await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transactions) => ({
          addressTo: transactions.receiver,
          addressFrom: transactions.sender,
          timestamp: new Date(
            transactions.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transactions.message,
          keyword: transactions.keyword,
          amount: parseInt(transactions.amount._hex) / 10 ** 18,
        })
      );
      console.log(structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };
  const checkIfTransactionsExist = async () => {
    try {
      const transactionsContract = getEthereumContract();
      const transactionsCount =
        await transactionsContract.getTransactionCount();
      localStorage.setItem("transactionsCount", transactionsCount);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  //Connect wallet method
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };
  //Send transactions method
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { address, amount, keyword, message } = formData;
        const transactionsContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: address,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          address,
          parsedAmount,
          message,
          keyword
        );

        setLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setLoading(false);

        const transactionsCount =
          await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
        transactions,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
