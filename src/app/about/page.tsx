import { Heart, Truck, Award, Shield } from "lucide-react"
import Link from "next/link"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About FoodGo</h1>
          <p className="text-xl text-orange-100">
            Your favorite food, delivered with love
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-6">
            FoodGo started in 2020 with a simple mission: to connect people with their favorite 
            local restaurants through fast, reliable delivery. What began as a small startup has 
            grown into the city&apos;s most trusted food delivery platform.
          </p>
          <p className="text-gray-600 mb-6">
            Today, we partner with over 500 restaurants and serve more than 50,000 happy customers 
            every month. Our success is built on three core principles: quality, speed, and 
            customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Truck className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              30-minute delivery guarantee or your order is free
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Heart className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality First</h3>
            <p className="text-gray-600">
              We partner only with top-rated restaurants
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Shield className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Your data is protected with industry-leading security
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Award className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Best Service</h3>
            <p className="text-gray-600">
              24/7 customer support always ready to help
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/restaurants"
            className="inline-block px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition"
          >
            Start Ordering
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage