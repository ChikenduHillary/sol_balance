"use client";
import { Connection, PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CardWithForm() {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(balance);

  const fetchBalance = async (address: string) => {
    try {
      setLoading(true);
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL!
      );
      const publicKey = new PublicKey(address);
      const lamports = await connection.getBalance(publicKey);
      const sol = lamports / 1_000_000_000; // Convert lamports to SOL
      setBalance(sol);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setError("Failed to fetch balance. Ensure the address is valid.");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchBalance(address);
  };

  return (
    <div className=" w-screen h-screen grid place-items-center">
      <Card className="w-[350px] dark">
        <form onSubmit={(e) => handleSubmit(e)}>
          <CardHeader>
            <CardTitle>Sol Balance</CardTitle>
            <CardDescription>Check the amount of sol you have</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Addres</Label>
                <Input
                  id="address"
                  placeholder="address"
                  value={address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <p>Your balance is: {balance} sol</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Check Balance"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
