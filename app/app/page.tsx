import PublicLayout from "@/components/layouts/PublicLayout";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">

        <div className="h-screen flex items-center justify-center overflow-y-auto">
          <div className="flex justify-center w-full">
            <div className="w-1/2">
              <div className="flex justify-center">
                <Link href="/">
                    <Image
                      src="/ocmi-workers-comp-logo.png"
                      alt="OCMI Workers Comp Logo"
                      width={400} 
                      height={250}
                    />
                </Link>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl lg:text-6xl font-bold mt-4">
                  Payroll Services and Time Management Solutions
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Contact us for more information
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Content Sections */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payroll Management</h2>
              <p className="text-gray-600">
                Streamline your payroll process and ensure accurate and timely payments to your employees.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Employee Data Handling</h2>
              <p className="text-gray-600">
                Manage employee information securely and efficiently, from onboarding to offboarding.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Time Sheet Management</h2>
              <p className="text-gray-600">
                Easily track and manage employee work hours, overtime, and time-off requests.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Custom Solutions</h2>
              <p className="text-gray-600">
                Tailor-made solutions to meet your unique business needs and requirements.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
