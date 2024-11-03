"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, Plus, Trash, Upload } from "lucide-react";
import Link from "next/link";
import { debounce } from "lodash";
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

export default function CreateEnvelope() {
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState([{ name: "", email: "" }]);
  const [documents, setDocuments] = useState([]);

  const addSigner = () => {
    setSigners([...signers, { name: "", email: "" }]);
  };

  const removeSigner = (index) => {
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setSigners(newSigners);
  };

  const updateSigner = (index, field, value) => {
    const newSigners = [...signers];
    newSigners[index][field] = value;
    setSigners(newSigners);
  };

  const handleFileUpload = (event) => {
    const newDocuments = [...documents, ...event.target.files];
    setDocuments(newDocuments);
  };

  const removeDocument = (index) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };
  const handleInputChange = (index, field, value) => {
    updateSigner(index, field, value);

    if (value.length >= 2) {
      // Only trigger autocomplete after 2 characters
      debouncedFetch(index, field, value);
    } else {
      setSearchResults((prev) => ({
        ...prev,
        [index]: [], // Clear results if input is too short
      }));
    }
  };
  const fetchAutocompleteResults = async (query) => {
    try {
      const response = await fetch("http://localhost:8000/b2CConnections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.token}`,
        },
      });
      const data = await response.json();

      const result = data
        .map((item) => {
          const name = item.connectedUser
            ? `${item.connectedUser.firstName} ${item.connectedUser.lastName}`
            : item.company.brandName;

          const id = item.connectedUser
            ? item.connectedUser.id
            : item.company.id;

          return {
            name,
            id,
          };
        })
        .filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      // console.log(result);
      return result; // Adjust this to access actual suggestions if nested
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
      return [];
    }
  };
  const debouncedFetch = useCallback(
    debounce(async (index, field, value) => {
      // setLoading(true);
      const results = await fetchAutocompleteResults(value);
      setSearchResults((prev) => ({
        ...prev,
        [index]: results,
      }));
      setLoading(false);
    }, 300),
    [] // Dependencies - empty here because we don't need to recreate the function
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-500 hover:text-blue-400 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-6">Create New Envelope</h1>
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Envelope Details</CardTitle>
            <CardDescription>
              Provide the details for your new envelope
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="envelopeName" className="text-white">
                  Envelope Name
                </Label>
                <Input
                  id="envelopeName"
                  placeholder="Enter envelope name"
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="envelopeDescription" className="text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="envelopeDescription"
                  placeholder="Enter envelope description"
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Add Signers</CardTitle>
            <CardDescription>
              Add people who need to sign this envelope
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signers.map((signer, index) => (
              <div key={index} className="flex gap-4 mb-4 relative">
                <div className="flex-1">
                  <Input
                    placeholder="Name"
                    value={signer.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    className="bg-gray-700 text-gray-100 border-gray-600"
                  />
                  {loading && <div>Loading...</div>}
                  {searchResults[index] && searchResults[index].length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-600 rounded mt-1">
                      {searchResults[index].map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            updateSigner(index, "name", result.name);
                            updateSigner(index, "email", result.id);
                            setSearchResults((prev) => ({
                              ...prev,
                              [index]: [],
                            }));
                          }}
                          className="p-6 cursor-pointer hover:bg-gray-700 text-white"
                        >
                          {result.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={signer.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                    className="bg-gray-700 text-gray-100 border-gray-600"
                  />
                  {loading && <div>Loading...</div>}
                  {searchResults[index] && (
                    <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-600 rounded mt-1">
                      {searchResults[index].map((result, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            updateSigner(index, "email", result.email)
                          }
                          className="p-2 cursor-pointer hover:bg-gray-700"
                        >
                          {result.email}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Upload Documents</CardTitle>
            <CardDescription>
              Upload the documents that need to be signed
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOCX, or TXT (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                  />
                </label>
              </div>
              {documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Uploaded Documents:
                  </h4>
                  <ul className="space-y-2">
                    {documents.map((doc, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-700 p-2 rounded"
                      >
                        <span>{doc.name}</span>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeDocument(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Link href={"/send-doc"}>
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Envelope
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
