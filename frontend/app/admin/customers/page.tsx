"use client"

import { useState, useEffect } from "react"
import { Search, Mail, User, Phone, Eye, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useApi } from "@/contexts/api-context"
export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    role: "admin" | "User" | "vendor";
    createdAt: string;
    updatedAt: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()
  const { getAllUsers } = useApi()

useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const data = await getAllUsers();
    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setUsers(sorted);
    console.log(sorted);
  } catch (error) {
    console.error("Failed to fetch users", error);
  }
};


 const filteredUsers = users.filter((user) => {
  const name = user.name?.toLowerCase() || "";
  const email = user.email?.toLowerCase() || "";
  const term = searchTerm.toLowerCase();

  return name.includes(term) || email.includes(term);
});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage customer accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{user.phone || "-"}</td>
                    <td className="py-3 px-4">
                      <Badge>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Profile</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                  <Badge>{selectedUser.role}</Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Contact Info</h4>
                                  <p className="text-sm flex items-center">
                                    <Mail className="mr-2 h-4 w-4" /> {selectedUser.email}
                                  </p>
                                  <p className="text-sm flex items-center">
                                    <Phone className="mr-2 h-4 w-4" /> {selectedUser.phone || "-"}
                                  </p>
                                  <p className="text-sm flex items-center">
                                    <MapPin className="mr-2 h-4 w-4" /> {selectedUser.address || "-"}
                                  </p>
                                  <p className="text-sm">City: {selectedUser.city || "-"}</p>
                                  <p className="text-sm">State: {selectedUser.state || "-"}</p>
                                  <p className="text-sm">Country: {selectedUser.country || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Account Info</h4>
                                  <p className="text-sm">User ID: <span className="font-medium">{selectedUser._id}</span></p>
                                  <p className="text-sm">Join Date: <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span></p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
