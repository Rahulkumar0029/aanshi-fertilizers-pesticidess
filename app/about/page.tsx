import Image from "next/image";
import { Award, Target, Eye, Users } from "lucide-react";

export default function About() {
  return (
    <div>
      <section className="bg-accent/30 px-4 py-14 sm:py-20">
        <div className="container-app max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            About Us
          </h1>
          <p className="text-base leading-7 text-gray-600 sm:text-lg lg:text-xl">
            Trusted agricultural solutions built on experience, quality, and real farmer relationships.
          </p>
        </div>
      </section>

      <section className="overflow-hidden px-4 py-14 sm:py-20 lg:py-24">
        <div className="container-app">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            
            {/* IMAGE */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-primary/10 sm:-left-6 sm:-top-6 sm:h-32 sm:w-32" />

              <div className="relative z-10 overflow-hidden rounded-[1.75rem] shadow-2xl sm:rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1594776208131-aa10aecee030?auto=format&fit=crop&w=1000&q=80"
                  alt="Aanshi Fertilizers & Pesticides"
                  width={800}
                  height={1000}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="absolute -bottom-4 right-0 z-20 rounded-2xl border border-border bg-white p-4 shadow-xl sm:-bottom-8 sm:-right-4 sm:p-6 lg:-right-8 lg:p-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white sm:h-12 sm:w-12">
                    <Award size={22} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold sm:text-xl">15+ Years</h4>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      Trusted Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-1 space-y-6 lg:order-2 lg:space-y-8">
              <div className="inline-block rounded-lg bg-accent px-4 py-2 text-sm font-bold uppercase text-primary">
                About Aanshi Farms
              </div>

              <h2 className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
                Building Trust in Agriculture Through Quality & Experience
              </h2>

              <div className="space-y-5 text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                <p>
                  <strong>Aanshi Fertilizers & Pesticides</strong> is a trusted
                  agricultural supplier based in Rajasthan, providing
                  fertilizers, pesticides, seeds, and practical solutions to
                  farmers, retailers, and wholesale buyers.
                </p>

                <p>
                  The business is led by{" "}
                  <strong>Anil Kumar Bishnoi</strong>, who brings{" "}
                  <strong>15+ years of hands-on agricultural experience</strong>,
                  working closely alongside <strong>Anuj Bishnoi</strong> to
                  deliver reliable products and guidance to customers.
                </p>

                <p>
                  Our approach goes beyond selling products. We focus on helping
                  farmers make better decisions, improve crop yield, and build
                  long-term trust through consistent quality and support.
                </p>

                <p>
                  Based at{" "}
                  <strong>
                    30 PS A, Plot No. 123, Bishanpura, Sri Ganganagar, Rajasthan
                  </strong>
                  , we continue to grow through strong relationships, dependable
                  service, and a commitment to agriculture.
                </p>
              </div>

              {/* BUSINESS INFO */}
              <div className="space-y-2 rounded-2xl border border-border bg-white p-5 text-sm text-gray-700 shadow-sm sm:p-6 sm:text-base">
                <p>
                  <strong>Operational Leadership:</strong> Anil Kumar Bishnoi 
                </p>
                <p>
                  <strong>Business Type:</strong> Trader - Retailer
                </p>
                <p>
                  <strong>GST Number :</strong> 08CGJPK3822P1ZV
                </p>
                <p>
                  <strong>Annual Turnover:</strong> ₹40 Lakh – ₹1.5 Crore
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
                <a
                  href="https://www.indiamart.com/aanshi-fertilizers-and-pesticides/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-600"
                >
                  View on IndiaMART
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=100092580835985"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
                >
                  Visit Facebook Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <div className="container-app">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
            
            <div className="space-y-6 rounded-[2rem] border border-accent/30 bg-accent/20 p-6 sm:p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary sm:text-2xl">
                Our Mission
              </h3>
              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                To provide reliable and effective agricultural products that
                support better farming outcomes.
              </p>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-white">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-bold text-secondary sm:text-2xl">
                Our Vision
              </h3>
              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                To become a trusted name in agriculture by consistently
                delivering quality and value.
              </p>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-accent/30 bg-accent/20 p-6 sm:p-8 lg:p-10 md:col-span-2 xl:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary sm:text-2xl">
                Our Commitment
              </h3>
              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                We are committed to helping farmers with the right products,
                right advice, and long-term support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}