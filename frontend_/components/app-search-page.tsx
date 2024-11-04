"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui-search/card";
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

export function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      // In a real application, you would fetch this data from your API
      // using the query parameter
      const data: SearchResult = {
        companies: [],
        users: [
          {
            aboutMe: null,
            birthdate: null,
            firstName: null,
            id: "8210ab99-60f6-469e-9d2a-06b6caed15b5",
            lastName: null,
            metadata: {},
            middleName: null,
            username: "sabeeh-f-tw",
          },
          {
            aboutMe: "I am passionate about new innovations",
            birthdate: "2001-03-13",
            firstName: "Sakitha",
            id: "1c609235-069f-4a9f-be6b-6bb17dbb8cd2",
            lastName: "Jayasinghe",
            metadata: {},
            middleName: "Jananjaya",
            username: "sakithajayasinghe-yzxg",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sarah",
            id: "e2903aeb-fa5a-487b-9eaf-1177e4f0e96e",
            lastName: "Hayes",
            metadata: {},
            middleName: null,
            username: "sarah-hayes-ugpg",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sarah",
            id: "4a600a24-dc83-493c-a1ae-0416ba045f3f",
            lastName: "Rivera",
            metadata: {},
            middleName: null,
            username: "sarah-rivera-6uyv",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Samantha",
            id: "5f7ec8a5-7105-4c8b-bb47-f7fafae64dbe",
            lastName: "Flores",
            metadata: {},
            middleName: null,
            username: "samantha-flores-s-al",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Judy",
            id: "b714e50c-786e-4b22-9b49-88c0e32bc94f",
            lastName: "Sanders",
            metadata: {},
            middleName: null,
            username: "judy-sanders-sgmg",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sandra",
            id: "a34a68dc-a564-4ba4-859e-0418caea4bfd",
            lastName: "Barnes",
            metadata: {},
            middleName: null,
            username: "sandra-barnes-9l2l",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sandra",
            id: "72f711a4-3a39-4554-8cee-d37e4df036bc",
            lastName: "Bennett",
            metadata: {},
            middleName: null,
            username: "sandra-bennett-een0",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Maria",
            id: "1f2d70d0-030d-4892-8fa8-ab10fb0f42e5",
            lastName: "Sanders",
            metadata: {},
            middleName: null,
            username: "maria-sanders-2atb",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sandra",
            id: "2eec53da-c71c-4926-9446-b1192a54560f",
            lastName: "Washington",
            metadata: {},
            middleName: null,
            username: "sandra-washington-pndz",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sara",
            id: "d268a8cf-04ea-41c5-973d-00056d803ffb",
            lastName: "Sanchez",
            metadata: {},
            middleName: null,
            username: "sara-sanchez-j-gd",
          },
          {
            aboutMe: null,
            birthdate: null,
            firstName: "Sarah",
            id: "857a559b-f398-4853-94db-c43a2ad8e164",
            lastName: "Garcia",
            metadata: {},
            middleName: null,
            username: "sarah-garcia-oasw",
          },
          {
            aboutMe: null,
            birthdate: "1997-09-13",
            firstName: "Saurav",
            id: "332711e9-d81b-440f-9f9a-02f8ed4f3a62",
            lastName: "K",
            metadata: {},
            middleName: null,
            username: "sauravkrishna1397@gmail-com",
          },
        ],
      };
      setSearchResults(data);
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (!query) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
        <p>Please provide a search query.</p>
      </div>
    );
  }

  if (!searchResults) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for &quot;{query}&quot;
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.users.map((user) => (
            <Card key={user.id} className="bg-gray-800 border-gray-700">
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
                  {user.birthdate && (
                    <p className="text-sm text-gray-400">
                      Born: {new Date(user.birthdate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <User className="h-3 w-3 mr-1" />
                      User
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {searchResults.users.length === 0 &&
          searchResults.companies.length === 0 && (
            <div className="text-center mt-8">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-2 text-xl font-semibold">No results found</h2>
              <p className="mt-1 text-gray-400">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
