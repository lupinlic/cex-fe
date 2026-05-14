"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";

// RPC URL
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

// confirmations
const CONFIRMATIONS = 12;

// Network ID mặc định
const NETWORK_ID = "2b630e4a-1734-455f-b9bc-9318703af255";

// API base URL
const API_BASE_URL = "http://localhost/wallet/networks";

export default function LastBlock() {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [chainBlock, setChainBlock] = useState<number | null>(null);
  const [newBlock, setNewBlock] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // provider
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // lấy latest block từ blockchain
  const handleGetCurrentBlock = async () => {
    setIsLoading(true);

    try {
      // latest block trên chain
      const latest = await provider.getBlockNumber();

      // block an toàn
      const safeBlock = latest - CONFIRMATIONS;

      setChainBlock(latest);
      setCurrentBlock(safeBlock);

      // auto fill input
      setNewBlock(String(safeBlock));
    } catch (error) {
      console.error("Failed to get current block:", error);
      toast.error("Failed to fetch blockchain block");
    } finally {
      setIsLoading(false);
    }
  };

  // set lastBlock qua API
  const handleSetBlock = async () => {
    if (!newBlock || isNaN(Number(newBlock))) {
      toast.error("Please enter a valid block number");
      return;
    }

    setIsLoading(true);

    try {
      const blockNumber = Number(newBlock);

      // gọi API backend để update network
      await axiosInstance.put(`${API_BASE_URL}/${NETWORK_ID}`, {
        lastBlock: blockNumber.toString(),
      });

      toast.success("Block updated successfully");

      setCurrentBlock(blockNumber);
      setNewBlock("");
    } catch (error) {
      console.error("Failed to set block:", error);
      toast.error("Failed to update block");
    } finally {
      setIsLoading(false);
    }
  };

  // sync latest block luôn
  const handleSyncLatest = async () => {
    setIsLoading(true);

    try {
      const latest = await provider.getBlockNumber();

      const safeBlock = latest - CONFIRMATIONS;

      // update backend
      await axiosInstance.put(`${API_BASE_URL}/${NETWORK_ID}`, {
        lastBlock: safeBlock.toString(),
      });

      setChainBlock(latest);
      setCurrentBlock(safeBlock);

      toast.success(`Synced block: ${safeBlock}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync latest block");
    } finally {
      setIsLoading(false);
    }
  };

  const lag =
    chainBlock !== null && currentBlock !== null
      ? chainBlock - currentBlock
      : null;

  return (
    <div className=" bg-white text-slate-900">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-900">
              Last Block Management
            </h1>

          <div className="space-y-6">
            {/* Current Block */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Current Last Block
              </label>

              <div className="text-3xl font-bold font-mono text-blue-600">
                {currentBlock !== null
                  ? currentBlock.toLocaleString()
                  : "Not loaded"}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleGetCurrentBlock}
                  disabled={isLoading}
                  variant="default"
                  className="hover:bg-blue-400 hover:text-white"
                >
                  {isLoading
                    ? "Loading..."
                    : "Get Latest Block"}
                </Button>

                <Button
                  onClick={handleSyncLatest}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Syncing..."
                    : "Sync Latest"}
                </Button>
              </div>
            </div>

            {/* Chain Info */}
            

            {/* Manual Set */}
            <div className="space-y-4">
              <label
                htmlFor="newBlock"
                className="block text-sm font-medium"
              >
                Set New Block
              </label>

              <div className="flex gap-2">
                <Input
                  id="newBlock"
                  type="number"
                  placeholder="Enter block number"
                  value={newBlock}
                  onChange={(e) =>
                    setNewBlock(e.target.value)
                  }
                  className="font-mono"
                />

                <Button
                  onClick={handleSetBlock}
                  disabled={isLoading || !newBlock}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading
                    ? "Setting..."
                    : "Set Block"}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-slate-50 border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-slate-900">
                Information
              </h3>

              <ul className="text-sm text-slate-600 space-y-1">
                <li>
                  • Uses ethers.js RPC provider
                </li>

                <li>
                  • Sync Latest automatically uses latest
                  block - confirmations
                </li>

                <li>
                  • Manual block setting is supported
                </li>

                <li>
                  • Recommended for deposit watcher
                  recovery
                </li>

                <li>
                  • Always use confirmations to avoid
                  reorg issues
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
