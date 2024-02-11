import PublicLayout from "@/components/layouts/PublicLayout";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaCogs, FaMoneyCheckAlt, FaUserCog } from "react-icons/fa";

const ServiceCard = ({ icon, title, description }: any) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
    <div className="bg-purple-100 rounded-full p-2 mb-4">
      {icon({ size: 55, color: '#6B7280' })}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function Home() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">

        {/* Main section */}
        <div className="h-screen flex flex-col lg:flex-row items-center justify-center overflow-y-auto px-6">
          <div className="lg:w-1/2">
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
          <div className="lg:w-1/2">
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

        {/* Banner section */}
        <div className="relative h-64 lg:h-55 w-full overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <img
            src="/workers-image-banner.jpg"
            alt="Banner"
            className="absolute inset-0 object-cover w-full h-full"
            style={{ zIndex: 1 }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-wide text-center">
              <span style={{color:"#b4e671"}}>Let's partner!</span> We provide you with the right tools
            </h2>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-24 px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ServiceCard
                icon={FaMoneyCheckAlt}
                title="Financial Management"
                description="Manage your finances efficiently and securely."
              />
              <ServiceCard
                icon={FaUserCog}
                title="HR Administration"
                description="Efficiently manage human resources tasks and processes."
              />
              <ServiceCard
                icon={FaClock}
                title="Attendance Tracking"
                description="Keep track of employee attendance and working hours."
              />
              <ServiceCard
                icon={FaCogs}
                title="Workflow Automation"
                description="Automate repetitive tasks and streamline workflows."
              />
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
