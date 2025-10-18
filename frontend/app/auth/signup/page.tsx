"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "@/utils/axios";

export default function SignUpPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords don't match", description: "Check your passwords.", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });
      if (!res.data?.userId) throw new Error("No userId returned");
      setUserId(res.data.userId);
      setStep("otp");
      toast({ title: "OTP Sent", description: `Check ${formData.email} for the OTP.`, variant: "info" });
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.response?.data?.message || err.message || "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !userId) return;
    setLoading(true);
    try {
      await axios.post("/auth/verify-otp", { userId, otp });
      toast({ title: "Account Verified", description: "You can now login.", variant: "success" });
      router.push("/auth/login");
    } catch (err: any) {
      toast({ title: "OTP Verification failed", description: err.response?.data?.message || err.message || "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FAF8F2]">
      <div className="w-full max-w-md">
        <Card className="bg-white border border-gray-200 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black">{step === "form" ? "Create Account" : "Verify OTP"}</CardTitle>
            {step === "form" && <CardDescription className="text-gray-700">Join Koza and discover premium products</CardDescription>}
          </CardHeader>

          <CardContent>
            {step === "form" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-800">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-800">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-800">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-800">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-800">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                </div>

                <Button type="submit" className="w-full bg-[#4B2E1E] text-white hover:bg-[#6C4B3A]" disabled={loading}>
                  {loading ? "Sending OTP..." : "Create Account"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-gray-800">Enter OTP</Label>
                  <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required className="bg-white border-gray-300 text-black focus:border-brown-600"/>
                </div>

                <Button type="submit" className="w-full bg-[#4B2E1E] text-white hover:bg-[#6C4B3A]" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Complete Registration"}
                </Button>

                <p className="text-sm text-gray-600 text-center mt-2">
                  Didn’t receive OTP?{" "}
                  <button type="button" onClick={handleRegister} disabled={loading} className="text-[#4B2E1E] underline">
                    Resend
                  </button>
                </p>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#4B2E1E] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
