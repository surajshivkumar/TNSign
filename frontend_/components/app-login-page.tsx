'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

export function LoginPageComponent() {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')
  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (step === 1) {
      // TODO: Implement API call to send OTP
      console.log(`Sending OTP to ${loginMethod}: ${phoneOrEmail}`)
      setTimeout(() => {
        setStep(2)
        setIsLoading(false)
      }, 1000)
    } else {
      // TODO: Implement API call to verify OTP
      console.log(`Verifying OTP: ${otp}`)
      setTimeout(() => {
        alert('Login successful!')
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome to TNSign</h2>
            <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <RadioGroup
                    defaultValue="phone"
                    onValueChange={(value) => setLoginMethod(value as 'phone' | 'email')}
                    className="flex justify-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="text-white">Email</Label>
                    </div>
                  </RadioGroup>
                  <div>
                    <Label htmlFor="phoneOrEmail" className="sr-only">
                      {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </Label>
                    <Input
                      id="phoneOrEmail"
                      name="phoneOrEmail"
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      required
                      className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder={loginMethod === 'phone' ? 'Enter your phone number' : 'Enter your email address'}
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
                    className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  {step === 1 ? 'Send OTP' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/placeholder.svg?height=1080&width=1920"
          alt="Random background image"
          width={1920}
          height={1080}
        />
      </div>
    </div>
  )
}