"use client";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Background from "../../components/Background";

export default function HomePage() {
  const pricing = [
    {
      category: "Manicures",
      items: [
        { name: "Classic Manicure", price: "$25" },
        { name: "Gel Manicure", price: "$35" },
        { name: "Deluxe Spa Manicure", price: "$45" },
        { name: "French Tip Add-on", price: "$8" },
      ],
    },
    {
      category: "Pedicures",
      items: [
        { name: "Classic Pedicure", price: "$35" },
        { name: "Gel Pedicure", price: "$45" },
        { name: "Deluxe Spa Pedicure", price: "$55" },
        { name: "Callus Treatment", price: "$10" },
      ],
    },
    {
      category: "Enhancements",
      items: [
        { name: "Acrylic Full Set", price: "$55" },
        { name: "Acrylic Fill", price: "$40" },
        { name: "SNS/Dip Powder", price: "$50" },
        { name: "Gel X Extensions", price: "$65" },
      ],
    },
    {
      category: "Add-ons",
      items: [
        { name: "Nail Art (per nail)", price: "$5+" },
        { name: "Paraffin Treatment", price: "$12" },
        { name: "Polish Change", price: "$12" },
        { name: "Gel Removal", price: "$10" },
      ],
    },
  ];

  const schedules = [
    { day: "Monday", open: "09:00 AM", close: "07:00 PM" },
    { day: "Tuesday", open: "09:00 AM", close: "07:00 PM" },
    { day: "Wednesday", open: "09:00 AM", close: "07:00 PM" },
    { day: "Thursday", open: "09:00 AM", close: "07:00 PM" },
    { day: "Friday", open: "09:00 AM", close: "08:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "06:00 PM" },
    { day: "Sunday", open: "11:00 AM", close: "05:00 PM" },
  ];

  return (
    <Background>
      <Navigation />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/home_hero.jpeg"
              alt="Nail salon hero"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand text-shadow-white">
                Welcome to Nail 45
              </h1>
              <p className="mt-4 text-lg text-gray-700 text-shadow-white-sm">
                Modern nail care and spa experiences, crafted just for you.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="flex flex-col items-center mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-semibold text-brand mb-8">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {pricing.map((group) => (
              <div key={group.category} className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{group.category}</h3>
                <ul className="divide-y">
                  {group.items.map((item) => (
                    <li key={item.name} className="py-3 flex items-center justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium text-gray-900">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="schedule" className="flex flex-col items-center mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-semibold text-brand mb-8">Schedule</h2>

          <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm w-full max-w-3xl">
            <ul className="divide-y">
              {schedules.map((s) => (
                <li key={s.day} className="py-3 flex items-center justify-between">
                  <span className="text-gray-700">{s.day}</span>
                  <span className="font-medium text-gray-900">
                    {s.open} — {s.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="flex flex-col items-center mx-auto max-w-7xl px-6 py-20 h-[36rem]">
          <h2 className="text-3xl font-semibold text-brand mb-8">Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
            {/* Address & Phone Card */}
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visit Us</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  Nail 45
                  <br />
                  123 Main Street
                  <br />
                  Springfield, ST 12345
                </p>
                <p>
                  Phone:{" "}
                  <a href="tel:+11234567890" className="text-brand hover:underline">
                    (123) 456-7890
                  </a>
                </p>
              </div>
            </div>

            {/* Map Card */}
            <div className="rounded-2xl border bg-white/70 backdrop-blur-sm p-0 shadow-sm overflow-hidden">
              <div className="h-72 md:h-full">
                <iframe
                  title="Nail 45 Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531607!3d-37.81627974201459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s123%20Main%20St!5e0!3m2!1sen!2s!4v1700000000000"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (optional minimal) */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Nail 45. All rights reserved.
        </div>
      </footer>
    </Background>
  );
}
  
