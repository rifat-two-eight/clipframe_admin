import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#ffeec2] to-[#d6c6ff] p-4 lg:p-8">
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-60 lg:flex-row lg:items-center lg:justify-center">
        {/* Left Side - Image (Floating outside) */}
        <div className="relative mt-10 hidden w-[500px] lg:block">
          <Image
            src="/auth.png"
            alt="Login Visual"
            width={500}
            height={500}
            className="h-auto w-full object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Right Side - Logo & Form */}
        <div className="flex w-full max-w-[600px] flex-col gap-6">
          {/* Logo (Top Right of the right section) */}
          <div className="flex justify-center">
             <div className="relative h-12 w-40">
                <Image
                src="/logo.svg"
                alt="ClipFrame Logo"
                fill
                className="object-contain"
                />
             </div>
          </div>

          {/* Form Card (White Background) */}
          <div className="w-full rounded-3xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#C175F5]">Get Started now</h1>
              <p className="mt-2 text-sm text-gray-500">
                Create an account to log in to explore our app
              </p>
            </div>

            <form className="w-full space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="enter your e-mail"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-500"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="•••••••"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-bold text-blue-500 hover:text-blue-600"
                >
                  Forgot Password ?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-blue-500 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 hover:shadow-blue-600/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
