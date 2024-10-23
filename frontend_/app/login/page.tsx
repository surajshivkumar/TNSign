"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui-login/button";
import { Input } from "@/app/components/ui-login/input";
import { Label } from "@/app/components/ui-login/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/components/ui-login/radio-group";
import { Loader2 } from "lucide-react";

export function LoginPageComponent() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (step === 1) {
      // TODO: Implement API call to send OTP
      console.log(`Sending OTP to ${loginMethod}: ${phoneOrEmail}`);
      setTimeout(() => {
        setStep(2);
        setIsLoading(false);
      }, 1000);
    } else {
      // TODO: Implement API call to verify OTP
      console.log(`Verifying OTP: ${otp}`);
      setTimeout(() => {
        alert("Login successful!");
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--custom-bg-color)" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <Image
              src="/TNSign.png"
              alt="TN Sign logo"
              width={500} // Adjust this value based on your image's actual size
              height={100} // Adjust this value based on your image's actual size
              className="mb-8"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Welcome to TNSign
            </h2>
            <p className="mt-2 text-center text-sm text-gray-100">
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <RadioGroup
                  defaultValue="phone"
                  onValueChange={(value) =>
                    setLoginMethod(value as "phone" | "email")
                  }
                  className="flex justify-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone" className="text-white">
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                  </div>
                </RadioGroup>
                <div>
                  <Label htmlFor="phoneOrEmail" className="sr-only">
                    {loginMethod === "phone" ? "Phone Number" : "Email Address"}
                  </Label>
                  <Input
                    id="phoneOrEmail"
                    name="phoneOrEmail"
                    type={loginMethod === "phone" ? "tel" : "email"}
                    required
                    className="block w-full rounded-md border border-gray-700 bg-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder={
                      loginMethod === "phone"
                        ? "Enter your phone number"
                        : "Enter your email address"
                    }
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="otp" className="sr-only">
                  One-Time Password
                </Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-700 bg-gray-200 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the OTP sent to your phone/email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 1 ? "Send OTP" : "Verify OTP"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
