"use client";
import Link from "next/link";
import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Calendar,
  Clock,
  Briefcase,
  PenTool,
  Home,
  FileText,
  Users,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui-dashboard/dropdown-menu";
import { Input } from "../components/ui-dashboard/input";
import { Button } from "@/app/components/ui-dashboard/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui-contacts/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui-contacts/avatar";
import { Badge } from "../components/ui-contacts/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui-contacts/tabs";

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

export default function Contacts() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Next.js router for navigation

  const fetchAutocompleteResults = async (query: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/search?name=${query}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
          },
        }
      );

      const data = await response.json();

      const companyNames = data.companies.map(
        (company: Company) => company.brandName
      );
      const userNames = data.users.map((user: ConnectedUser) => {
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        return `${firstName} ${lastName}`.trim();
      });
      return [...companyNames, ...userNames];
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
      return [];
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      debouncedFetch(value);
    } else {
      setSearchResults([]); // Clear results if input is too short
    }
  };

  const debouncedFetch = useCallback(
    debounce(async (value: string) => {
      setIsLoading(true);
      const results = await fetchAutocompleteResults(value);
      setSearchResults(results);
      setIsLoading(false);
    }, 300),
    []
  );

  const handleResultSelect = (result: string) => {
    setQuery(result); // Set selected result in the input field
    setSearchResults([]); // Clear dropdown
    router.push(`/search?query=${encodeURIComponent(result)}`); // Navigate to the new route
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch("http://localhost:8000/b2CConnections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
          },
        });
        const data: Connection[] = await response.json();
        console.log(data);
        setConnections(data);
      } catch (error) {
        console.error("Failed to fetch connections:", error);
      }
    };
    fetchConnections();
  }, []);

  const b2bConnections = connections.filter((conn) => conn.type === "PARTNER");
  const b2cConnections = connections.filter((conn) => conn.type === "OWNER");

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <div className="flex items-center mb-8">
          <PenTool className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold ml-2">TNSign</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3" />
                Documents
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5 mr-3" />
                Contacts
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="relative flex items-center justify-between p-4 bg-gray-800">
          <div className="relative w-64">
            <Input
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 w-full"
              placeholder="Search ..."
            />
            {isLoading && <p className="text-gray-400">Loading...</p>}
            {searchResults.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 w-full bg-gray-800 text-white rounded shadow-lg z-10">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="p-2 border-b border-gray-600 cursor-pointer hover:bg-gray-700"
                    onClick={() => handleResultSelect(result)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt="@username"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Rest of the component */}
        <div className="max-w-7xl mx-5 mt-3">
          <Tabs defaultValue="b2b" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="b2b">B2B Connections</TabsTrigger>
              <TabsTrigger value="b2c">B2C Connections</TabsTrigger>
            </TabsList>
            <TabsContent value="b2b">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
                {b2bConnections.map((connection) => (
                  <Card
                    key={connection.id}
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {connection.company.legalName}
                        <button
                          className={`
                        ml-4 px-3 py-1.5 
                        text-white font-semibold text-sm 
                        rounded-full shadow-md 
                        transition duration-300 ease-in-out 
                        transform hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-opacity-50
                        bg-red-500
                      `}
                          onClick={() => handleStatusChange(company.id)}
                        >
                          {"Revoke"}
                        </button>
                      </CardTitle>

                      <CardDescription>
                        {connection.company.aboutUs}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-white">
                        <Avatar>
                          <AvatarFallback className="text-black">
                            {connection.connectedUser.firstName[0]}
                            {connection.connectedUser.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">
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
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {connection.connectedUser.firstName}{" "}
                        {connection.connectedUser.lastName}
                        <button
                          className={`
                        ml-4 px-3 py-1.5 
                        text-white font-semibold text-sm 
                        rounded-full shadow-md 
                        transition duration-300 ease-in-out 
                        transform hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-opacity-50
                        bg-red-500
                      `}
                          onClick={() => handleStatusChange(company.id)}
                        >
                          {"Revoke"}
                        </button>
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
    </div>
  );
}
