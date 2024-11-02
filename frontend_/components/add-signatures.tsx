"use client";

import { useState } from "react";
import { ArrowLeft, Send, Trash, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/ui-signature/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui-signature/card";
import { Input } from "@/components/ui-signature/input";
import { Label } from "@/app/components/ui-signature/label";
import { Textarea } from "@/app/components/ui-signature/textarea";
import { useToast } from "@/components/ui/use-toast";

export function AddSignaturesComponent() {
  const [signatures, setSignatures] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  const addSignature = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setSignatures([
      ...signatures,
      { id: Date.now(), x, y, signer: "John Doe" },
    ]);
  };

  const deleteSignature = (id) => {
    setSignatures(signatures.filter((sig) => sig.id !== id));
  };

  const clearAllSignatures = () => {
    setSignatures([]);
  };

  const handleSend = () => {
    // Here you would typically send the envelope with signatures to your backend
    // For now, we'll just simulate this with a timeout
    setTimeout(() => {
      toast({
        title: "Envelope Sent Successfully",
        description: "Your envelope has been sent to all signers.",
        duration: 5000,
      });
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/create-envelope"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Create Envelope
        </Link>
        <h1 className="text-3xl font-bold mb-6">Add Signatures</h1>
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
            <CardDescription>
              Click on the document to add signature fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div
                className="w-full h-[600px] bg-white relative cursor-crosshair"
                onClick={addSignature}
              >
                {/* This would be replaced with an actual document preview */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Document Preview
                </div>
                {signatures.map((sig) => (
                  <div
                    key={sig.id}
                    className="absolute w-40 h-20 border-2 border-blue-500 flex items-center justify-center text-blue-500"
                    style={{ left: sig.x, top: sig.y }}
                  >
                    <div className="flex flex-col items-center">
                      <span>Signature: {sig.signer}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSignature(sig.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={clearAllSignatures}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear All Signatures
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle>Email Message</CardTitle>
            <CardDescription>
              Customize the email message sent to signers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Please sign this document"
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message to the signers"
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
          >
            <Send className="mr-2 h-4 w-4" /> Send Envelope
          </Button>
        </div>
      </div>
    </div>
  );
}
