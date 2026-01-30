"use client"
import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  // Register State
  const [registerName, setRegisterName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerMessage, setRegisterMessage] = useState("")

  // Sign In State
  const [loginPhone, setLoginPhone] = useState("")
  const [loginPasscode, setLoginPasscode] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")

  // Register via WhatsApp
  const handleRegister = () => {
    setRegisterMessage("")
    
    const trimmedName = registerName.trim()
    const trimmedPhone = registerPhone.trim()

    if (!trimmedName) {
      setRegisterMessage("❌ Please enter your name")
      return
    }
    if (trimmedName.length < 3) {
      setRegisterMessage("❌ Name must be at least 3 characters")
      return
    }
    if (!trimmedPhone) {
      setRegisterMessage("❌ Please enter your WhatsApp number")
      return
    }
    if (trimmedPhone.length !== 10) {
      setRegisterMessage("❌ Please enter a valid 10-digit WhatsApp number")
      return
    }
    if (!/^\d{10}$/.test(trimmedPhone)) {
      setRegisterMessage("❌ WhatsApp number should contain only digits")
      return
    }

    setRegisterLoading(true)

    try {
      const message = `Register ${trimmedName}`
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/918800607598?text=${encodedMessage}`
      
      window.open(whatsappUrl, "_blank")
      setRegisterMessage("✅ WhatsApp opened! Send the message to complete registration.")

      setTimeout(() => {
        setRegisterName("")
        setRegisterPhone("")
        setRegisterMessage("")
        setRegisterLoading(false)
      }, 3000)
    } catch (error) {
      setRegisterMessage("❌ Something went wrong. Please try again.")
      setRegisterLoading(false)
    }
  }

  // Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginMessage("")

    const trimmedPhone = loginPhone.trim()
    const trimmedPasscode = loginPasscode.trim()

    if (!trimmedPhone) {
      setLoginMessage("❌ Please enter your WhatsApp number")
      return
    }
    if (trimmedPhone.length !== 10) {
      setLoginMessage("❌ Please enter a valid 10-digit WhatsApp number")
      return
    }
    if (!/^\d{10}$/.test(trimmedPhone)) {
      setLoginMessage("❌ WhatsApp number should contain only digits")
      return
    }
    if (!trimmedPasscode) {
      setLoginMessage("❌ Please enter your passcode")
      return
    }
    if (trimmedPasscode.length !== 4) {
      setLoginMessage("❌ Passcode must be 4 digits")
      return
    }

    setLoginLoading(true)

    // Here you would typically verify the passcode
    setTimeout(() => {
      setLoginMessage("✅ Login successful!")
      setLoginLoading(false)
    }, 1500)
  }

  // Request Login Passcode
  const requestLoginPasscode = () => {
    const message = `Login`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/918800607598?text=${encodedMessage}`, "_blank")
    setLoginMessage("✅ WhatsApp opened! Send 'Login' to receive your passcode.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Logo - Professional Design */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl blur-xl opacity-30"></div>
              <Image 
                src="/Saubh-Good.png" 
                alt="Saubh Tech Logo" 
                width={60} 
                height={60}
                className="object-contain relative z-10 drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              Saubh.Tech
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Register Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                👤
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Register</h2>
            </div>

            {/* Instructions - 3 points */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Open your WhatsApp
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div className="text-gray-700 leading-relaxed">
                  <p>Type <span className="font-semibold">Register Name*</span> and send it to</p>
                  <p className="font-bold text-purple-600">+918800607598</p>
                  <p className="text-sm text-gray-500 italic">* Replace Name with your real name.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  ✓
                </div>
                <p className="text-gray-700 leading-relaxed">
                  You'll receive a confirmation message once registration is successful.
                </p>
              </div>
            </div>

            {/* Form Fields - 2 inputs + 1 button */}
            <div className="space-y-4 mt-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name:
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={registerLoading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number: <span className="text-purple-600">+918800607598</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your WhatsApp number"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value.replace(/\D/g, ""))}
                    disabled={registerLoading}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={registerLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {registerLoading ? "Opening WhatsApp..." : "Open WhatsApp to Register"}
              </button>

              {registerMessage && (
                <div className={`text-sm text-center p-3 rounded-lg ${
                  registerMessage.includes("✅") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {registerMessage}
                </div>
              )}
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl">
                🔐
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
            </div>

            {/* Instructions - 3 points (matching register) */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Open WhatsApp
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div className="text-gray-700 leading-relaxed">
                  <p>Send <span className="font-semibold">Login</span> to</p>
                  <p className="font-bold text-purple-600">+91 88006 07598</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <p className="text-gray-700 leading-relaxed">
                  You'll receive a 4-digit passcode
                </p>
              </div>
            </div>

            {/* Form Fields - 2 inputs + 1 button (matching register) */}
            <form onSubmit={handleSignIn} className="space-y-4 mt-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp Number: <span className="text-purple-600">+918800607598</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your WhatsApp number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ""))}
                    disabled={loginLoading}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Passcode:
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value.replace(/\D/g, ""))}
                    disabled={loginLoading}
                    maxLength={4}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={requestLoginPasscode}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2"
                >
                  Don't have a passcode? Click here to get one
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                <span className="text-xl">✔️</span>
                <span>{loginLoading ? "Logging In..." : "Login to continue"}</span>
              </button>

              {loginMessage && (
                <div className={`text-sm text-center p-3 rounded-lg ${
                  loginMessage.includes("✅") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {loginMessage}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-700 font-medium">
            © 2025 Saubh.Tech | All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}