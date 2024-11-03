"use client";
import Link from "next/link";
import { debounce } from "lodash";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  User,
  Users,
  PenTool,
  Home,
  FileText,
  Settings,
  Bell,
  LogOut,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui-dashboard/dropdown-menu";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui-search/avatar";
import { Badge } from "@/app/components/ui-search/badge";

interface SearchResult {
  companies: any[];
  users: {
    aboutMe: string | null;
    birthdate: string | null;
    firstName: string | null;
    id: string;
    lastName: string | null;
    metadata: Record<string, unknown>;
    middleName: string | null;
    username: string;
  }[];
}

export default function Page() {
  const searchParams = useSearchParams();
  //   const query =
  const [query, setQuery] = useState(searchParams.get("query"), "");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    users: [],
    companies: [],
  });
  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const handleStatusChange = async (companyId) => {
    const updatedCompanies = searchResults.companies.map((company) => {
      if (company.id === companyId) {
        if (company.connectionStatus.toLowerCase() === "connected") {
          return company;
        } else {
          // Change status to "pending" and send API request
          company.connectionStatus = "pending";
          // Make API call to update the backend
          fetch(`http://localhost:8000/b2b/send-connection/${companyId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.token}`,
            },
            body: JSON.stringify({
              connection_type: status === "Pending" ? "PARTNER" : "OWNER", // Adjust based on logic
            }),
            // body: JSON.stringify({ status: "pending" }),
          }).catch((error) => console.error("Error updating status:", error));
        }
      }
      return company;
    });
    setSearchResults({ ...searchResults, companies: updatedCompanies });
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
      //   const results = await fetchAutocompleteResults(value);
      //   setSearchResults(results);
      setIsLoading(false);
    }, 300),
    []
  );
  useEffect(() => {
    const fetchSearchResults = async () => {
      // In a real application, you would fetch this data from your API
      // using the query parameter
      const response = await fetch(
        `http://localhost:8000/search-with-status?name=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.token}`,
          },
        }
      );

      const res = await response.json();
      console.log(res);
      const data =
        res.companies.length === 0 && res.users.length === 0 ? [] : res;
      setSearchResults(data);
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  //   if (!query) {
  //     return (
  //       <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
  //         <p>Please provide a search query.</p>
  //       </div>
  //     );
  //   }

  if (!searchResults) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

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
        <div className="max-w-7xl mx-3 mb-10">
          {/* <h1 className="text-3xl font-bold mb-6">
            Search Results for &quot;{query}&quot;
          </h1> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {searchResults?.users?.length > 0 ? (
              searchResults.users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>
                        {user.firstName} {user.middleName} {user.lastName}
                      </CardTitle>
                      <CardDescription>{user.username}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {user.aboutMe && (
                        <p className="text-sm text-gray-400">{user.aboutMe}</p>
                      )}
                      {/* {user.birthdate && (
                    <p className="text-sm text-gray-400">
                      Born: {new Date(user.birthdate).toLocaleDateString()}
                    </p>
                  )} */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          User
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p></p>
            )}
            {searchResults?.companies?.length > 0 ? (
              searchResults.companies.map((company) => (
                <Card
                  key={company.id}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${company.legalName}`}
                        alt={company.legalName}
                      />
                      <AvatarFallback>{company.legalName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{company.legalName}</CardTitle>
                      <CardDescription>{company.profileName}</CardDescription>
                    </div>
                    <button
                      className="
                      ml-4 px-3 py-1.5 
                      bg-blue-600 hover:bg-blue-700 
                      text-white font-semibold text-sm 
                      rounded-full shadow-md 
                      transition duration-300 ease-in-out 
                      transform hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    "
                      onClick={() => handleStatusChange(company.id)}
                    >
                      {capitalizeWords(company.connectionStatus)}
                    </button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {company.aboutUs && (
                        <p className="text-sm text-gray-400">
                          {company.aboutUs}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        Founded: {company.yearFounded}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Building2 className="h-3 w-3 mr-1" />
                          Company
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
