"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  password?: string; // optional for changing password
  confirmPassword?: string;
};

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If changing password, validate
    if (form.password || form.confirmPassword) {
      if (form.password !== form.confirmPassword) {
        toast({ title: "Passwords do not match", variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      // call backend protected route
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        pincode: form.pincode,
      };
      if (form.password) payload.password = form.password;

      const res = await api.put("/auth/profile", payload);
      const updatedUser = res.data.user;

      // update context + localStorage
      updateUser(updatedUser);

      toast({ title: "Profile updated", description: "Your profile was saved." });
      // clear password fields
      setForm((p) => ({ ...p, password: "", confirmPassword: "" }));
    } catch (err: any) {
      toast({ title: "Update failed", description: err.response?.data?.message || err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={form.phone || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" value={form.pincode || ""} onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={form.address || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={form.city || ""} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={form.state || ""} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={form.country || ""} onChange={handleChange} />
            </div>

            {/* Password change */}
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" value={form.password || ""} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => {
              // reload current values from context
              if (user) {
                setForm({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  address: user.address || "",
                  city: user.city || "",
                  state: user.state || "",
                  country: user.country || "",
                  pincode: user.pincode || "",
                  password: "",
                  confirmPassword: "",
                });
              }
            }}>
              Reset
            </Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
