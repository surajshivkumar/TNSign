"use client";

import {
  Bell,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  PenTool,
  Settings,
  User,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui-dashboard/avatar";
import { Button } from "@/app/components/ui-dashboard/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui-dashboard/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui-dashboard/dropdown-menu";
import { Input } from "../components/ui-dashboard/input";
import { Progress } from "../components/ui-dashboard/progress";

export default function Dashboard() {
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
                href="#"
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
                href="/contacts"
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
        <header className="flex items-center justify-between p-4 bg-gray-800">
          <Input
            className="w-64 bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
            placeholder="Search documents..."
          />
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <Link href="/create-envelope">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Create New Envelope
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 text-gray-100 border-gray-700">
              <CardHeader>
                <CardTitle>Documents Pending</CardTitle>
                <CardDescription className="text-gray-400">
                  Documents awaiting your signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <Progress value={60} className="mt-2" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border-gray-700">
              <CardHeader>
                <CardTitle>Documents Completed</CardTitle>
                <CardDescription className="text-gray-400">
                  Documents signed this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <Progress value={80} className="mt-2" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 text-gray-100 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Contract_v2.pdf</span>
                    <span className="text-green-400">Signed</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>NDA_2024.pdf</span>
                    <span className="text-yellow-400">Pending</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Agreement.pdf</span>
                    <span className="text-green-400">Signed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Recent Documents</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left">Document Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Project Proposal.pdf</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-2">2024-03-15</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" className="bg-blue-900" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Employee Contract.pdf</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-green-500 text-green-900 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                  <td className="px-4 py-2">2024-03-10</td>
                  <td className="px-4 py-2">
                    <Button className="bg-blue-900" variant="outline" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="px-4 py-2">Vendor Agreement.pdf</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 bg-blue-500 text-blue-900 rounded-full text-xs">
                      In Progress
                    </span>
                  </td>
                  <td className="px-4 py-2">2024-03-05</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" className="bg-blue-900" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
