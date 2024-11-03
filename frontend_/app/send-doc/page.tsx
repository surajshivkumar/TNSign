"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Plus, Trash, Move, CheckCircle, Home } from "lucide-react";
import { Button } from "../components/ui-create-envelope/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui-create-envelope/card";
import { Input } from "../components/ui-create-envelope/input";
import { Label } from "../components/ui-create-envelope/label";
import { Textarea } from "../components/ui-create-envelope/textarea";
import Link from "next/link";

export default function DocumentViewer() {
  const [signatureBoxes, setSignatureBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Simulated document pages (in a real app, these would be your actual document pages)
  const pages = [
    "/PAYMENT_RECEIPT_1622518462-images-0.jpg",
    "/PAYMENT_RECEIPT_1622518462-images-0.jpg",
  ];

  const addSignatureBox = () => {
    const newBox = {
      id: Date.now(),
      x: 100,
      y: 100,
      width: 200,
      height: 60,
      page: 0,
      type: "signature",
    };
    setSignatureBoxes([...signatureBoxes, newBox]);
  };

  const deleteSignatureBox = (id) => {
    setSignatureBoxes(signatureBoxes.filter((box) => box.id !== id));
    setSelectedBox(null);
  };

  const handleMouseDown = (e, box) => {
    if (e.target.closest(".signature-box")) {
      setSelectedBox(box);
      setDragStart({
        x: e.clientX - box.x,
        y: e.clientY - box.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (selectedBox && dragStart) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setSignatureBoxes((boxes) =>
        boxes.map((box) =>
          box.id === selectedBox.id ? { ...box, x: newX, y: newY } : box
        )
      );
    }
  };

  const handleMouseUp = () => {
    setSelectedBox(null);
    setDragStart(null);
  };

  const handleSend = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setIsSent(true); // Set sent status to true after sending
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {!isSent ? (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Document Viewer</h1>
            <div className="space-x-2">
              <Button
                onClick={addSignatureBox}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Signature
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Document"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card className="p-4 bg-gray-800">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Subject</Label>
                    <Input
                      className="text-white"
                      type="text"
                      placeholder="Enter email subject"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Message</Label>
                    <Input
                      className="text-white"
                      type="text"
                      placeholder="Enter email message"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4  bg-gray-800">
                <h3 className="font-semibold mb-2 text-white">
                  Signature Fields
                </h3>
                <div className="space-y-2 ">
                  {signatureBoxes.map((box) => (
                    <div
                      key={box.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="flex items-center">
                        <Move className="w-4 h-4 mr-2 text-gray-500" />
                        Signature Field {box.id}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSignatureBox(box.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div
              className="relative bg-white rounded-lg shadow"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pages.map((page, index) => (
                <div key={index} className="relative mb-4">
                  <img
                    src={page}
                    alt={`Page ${index + 1}`}
                    className="w-full h-auto"
                  />
                  {signatureBoxes
                    .filter((box) => box.page === index)
                    .map((box) => (
                      <div
                        key={box.id}
                        className={`signature-box absolute border-2 ${
                          selectedBox?.id === box.id
                            ? "border-blue-500"
                            : "border-gray-400"
                        } bg-blue-50 bg-opacity-30 cursor-move rounded`}
                        style={{
                          left: box.x,
                          top: box.y,
                          width: box.width,
                          height: box.height,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, box)}
                      >
                        <div className="text-xs text-center mt-2 text-gray-500">
                          Signature Required
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Sent confirmation screen
        <div className="flex items-center justify-center h-full fade-in mt-20">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-ping" />
            <h1 className="text-4xl font-bold text-green-500 mt-10">
              Document Sent!
            </h1>
            <p className="text-gray-400 mt-2">
              Your document has been successfully sent.
            </p>
            <p className="text-green-400 mt-10 mb-10"> Back to Dashboard</p>
            <div className="flex items-center justify-center">
              <Link href="/dashboard">
                <Home className="w-20 h-20  text-green-500"></Home>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
