"use client";

import { useState, useEffect } from "react";
import { Building2, User, Calendar, Clock, Briefcase } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui-signature/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Company {
  aboutUs: string;
  brandName: string;
  id: string;
  legalName: string;
  metadata: Record<string, unknown>;
  profileName: string;
  taxId: string;
  yearFounded: number;
}

interface ConnectedUser {
  aboutMe: string | null;
  birthdate: string;
  firstName: string;
  id: string;
  lastName: string;
  metadata: Record<string, unknown>;
  middleName: string | null;
  username: string;
}

interface Connection {
  company: Company;
  connectedUser: ConnectedUser;
  id: string;
  insertedAt: string;
  startedAt: string | null;
  type: "OWNER" | "PARTNER";
  updatedAt: string;
}

export function Contacts() {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchConnections = async () => {
      // Simulating API call with the provided data
      const data = [
        {
          company: {
            aboutUs: "One stop shop for car mods",
            brandName: "YLK",
            id: "43129874-4974-4fcf-a2b7-0b3494a480ef",
            legalName: "YLK Auto",
            metadata: {},
            profileName: "founder",
            taxId: "10398e",
            yearFounded: 2021,
          },
          connectedUser: {
            aboutMe: null,
            birthdate: "1998-04-18",
            firstName: "Suraj",
            id: "eb76d800-16c0-44f4-881e-3a92a9a1aa26",
            lastName: "Shiva Kumar",
            metadata: {},
            middleName: null,
            username: "suraj36",
          },
          id: "c928b431-c1f0-44a9-b827-856b81223576",
          insertedAt: "2024-10-22T03:10:11",
          startedAt: null,
          type: "OWNER",
          updatedAt: "2024-10-22T03:10:11",
        },
        {
          company: {
            aboutUs: "One stop shop for car mods",
            brandName: "YLK",
            id: "43129874-4974-4fcf-a2b7-0b3494a480ef",
            legalName: "YLK Auto",
            metadata: {},
            profileName: "founder",
            taxId: "10398e",
            yearFounded: 2021,
          },
          connectedUser: {
            aboutMe: null,
            birthdate: "1997-09-13",
            firstName: "Saurav",
            id: "332711e9-d81b-440f-9f9a-02f8ed4f3a62",
            lastName: "K",
            metadata: {},
            middleName: null,
            username: "sauravkrishna1397@gmail-com",
          },
          id: "54267f91-3d05-49bd-9ea7-0049b9976ce4",
          insertedAt: "2024-10-23T00:36:37",
          startedAt: "2024-10-23T00:36:37.765394",
          type: "PARTNER",
          updatedAt: "2024-10-23T00:36:37",
        },
      ];
      setConnections(data);
    };

    fetchConnections();
  }, []);

  const b2bConnections = connections.filter((conn) => conn.type === "PARTNER");
  const b2cConnections = connections.filter((conn) => conn.type === "OWNER");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contacts</h1>
        <Tabs defaultValue="b2b" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="b2b">B2B Connections</TabsTrigger>
            <TabsTrigger value="b2c">B2C Connections</TabsTrigger>
          </TabsList>
          <TabsContent value="b2b">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {b2bConnections.map((connection) => (
                <Card
                  key={connection.id}
                  className="bg-gray-800 border-gray-700"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {connection.company.brandName}
                    </CardTitle>
                    <CardDescription>
                      {connection.company.aboutUs}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {connection.connectedUser.firstName[0]}
                          {connection.connectedUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {connection.connectedUser.firstName}{" "}
                          {connection.connectedUser.lastName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {connection.connectedUser.username}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {connection.company.legalName}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Founded: {connection.company.yearFounded}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Connected:{" "}
                        {new Date(connection.insertedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary">{connection.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="b2c">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {b2cConnections.map((connection) => (
                <Card
                  key={connection.id}
                  className="bg-gray-800 border-gray-700"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {connection.connectedUser.firstName}{" "}
                      {connection.connectedUser.lastName}
                    </CardTitle>
                    <CardDescription>
                      {connection.connectedUser.username}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Birthdate:{" "}
                        {new Date(
                          connection.connectedUser.birthdate
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company: {connection.company.brandName}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Connected:{" "}
                        {new Date(connection.insertedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary">{connection.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
