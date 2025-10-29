"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/contexts/api-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  role: "admin" | "User" | "vendor"
  createdAt: string
  updatedAt: string
}

export default function AdminProfilePage() {
  const { getProfile, updateProfile } = useApi()
  const [user, setUser] = useState<User | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [didInit, setDidInit] = useState(false)
  const [email, setEmail] = useState("")

  const { toast } = useToast()

  // 1. Fetch the profile once
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile()
        if (profile) {
          setUser(profile)
        }
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Please make sure you're logged in and the server is running.",
          variant: "destructive",
        })
      }
    }

    fetchProfile()
  }, [getProfile, toast])

  // 2. Populate form fields once after profile is fetched
  useEffect(() => {
    if (user && !didInit) {
      if (user.name) {
        const nameParts = user.name.trim().split(" ")
        setFirstName(nameParts[0])
        setLastName(nameParts.slice(1).join(" "))
      }
      setEmail(user.email || "")   // ✅ email bhi set karo
      setPhone(user.phone || "")
      setAddress(user.address || "")
      setCity(user.city || "")
      setState(user.state || "")
      setCountry(user.country || "")
      setDidInit(true)
    }
  }, [user, didInit])




  const handleSave = async () => {
    console.log("handleSave called")

    if (!user) return

    const name = `${firstName.trim()} ${lastName.trim()}`.trim()

    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter at least a first name.",
        variant: "info",
      })
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "warning",
      })
      return
    }

    const payload = {
      name,
      email: email.trim(),  // ✅ added email
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      password: newPassword || undefined,
    }

    console.log("Sending update:", payload)

    try {
      const updated = await updateProfile(payload)
      console.log("Updated user:", updated)

      if (!updated || !updated._id) {
        toast({
          title: "Unexpected Response",
          description: "Server did not return updated user.",
          variant: "destructive",
        })
        return
      }

      setUser(updated)
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Profile Updated",
        description: "Your profile details have been saved.",
        variant: "success",
      })
    } catch (error: any) {
      console.error("Update error:", error?.response?.data || error.message || error)

      toast({
        title: "Update Failed",
        description: error?.response?.data?.message || "There was a problem saving your profile.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground text-lg">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" alt={user?.name || "Admin"} />
            <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "AD"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user?.name || "Admin Profile"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-2 capitalize">
              <Shield className="h-3 w-3 mr-1" />
              {user?.role}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>

                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSave}>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize dashboard experience (coming soon)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notifications</Label>
                  <input type="checkbox" id="notifications" defaultChecked disabled />
                </div>
                <div className="flex justify-end">
                  <Button disabled>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
