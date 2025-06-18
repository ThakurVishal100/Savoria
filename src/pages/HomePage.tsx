import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Instagram, 
  Facebook, 
  Twitter,
  Mail,
  Calendar,
  Users,
  Award,
  Heart,
  ArrowRight
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { MenuSection } from '../components/MenuSection';
import { ReservationForm } from '../components/ReservationForm';
import { ContactForm } from '../components/ContactForm';

export function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'menu', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      review: "Absolutely exceptional! Every dish was a masterpiece. The ambiance is perfect for special occasions.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Michael Chen",
      review: "The best dining experience in the city. Outstanding service and incredible flavors that you won't forget.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Emma Rodriguez",
      review: "Pure culinary artistry. Each course was perfectly executed. This place sets the standard for fine dining.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Culinary
            <span className="block text-amber-400">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Experience extraordinary flavors crafted with passion, precision, and the finest ingredients from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Make Reservation</span>
            </button>
            <Link 
              to="/menu"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>View Menu</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story of
                <span className="block text-amber-600">Culinary Passion</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2018 by Chef Alessandro Moretti, Savoria represents the pinnacle of modern gastronomy. 
                Our commitment to excellence begins with sourcing the finest ingredients from local farms and 
                trusted suppliers worldwide.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every dish tells a story, combining traditional techniques with innovative approaches to create 
                unforgettable dining experiences that celebrate the art of fine cuisine.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">2</h3>
                  <p className="text-gray-600">Michelin Stars</p>
                </div>
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">10k+</h3>
                  <p className="text-gray-600">Happy Guests</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/887723/pexels-photo-887723.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Chef preparing food"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-amber-200 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <MenuSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Guests
              <span className="block text-amber-400">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what our valued guests have to say about their experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Visit Us &
              <span className="block text-amber-600">Get in Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Located in the heart of the city, Savoria offers an intimate dining experience 
              in an elegant atmosphere. We look forward to welcoming you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Restaurant Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600">123 Culinary Avenue<br />Downtown District, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                    <p className="text-gray-600">
                      Tuesday - Sunday: 5:30 PM - 10:30 PM<br />
                      Monday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">info@savoria.com</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>

          <div className="border-t border-gray-200 pt-12">
            <ReservationForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-amber-500" />
                <span className="text-2xl font-bold">Savoria</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Elevating the art of fine dining through exceptional cuisine and unmatched hospitality.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-amber-600 p-3 rounded-full transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-amber-600 p-3 rounded-full transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-amber-600 p-3 rounded-full transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-amber-500 transition-colors duration-200">About Us</button></li>
                <li><Link to="/menu" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">Menu</Link></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-amber-500 transition-colors duration-200">Reservations</button></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">Private Dining</a></li>
                <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">Events</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">123 Culinary Avenue</li>
                <li className="text-gray-400">Downtown District, NY 10001</li>
                <li className="text-gray-400">(555) 123-4567</li>
                <li className="text-gray-400">info@savoria.com</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Opening Hours</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">Tuesday - Thursday: 5:30 PM - 9:30 PM</li>
                <li className="text-gray-400">Friday - Saturday: 5:30 PM - 10:30 PM</li>
                <li className="text-gray-400">Sunday: 5:30 PM - 9:00 PM</li>
                <li className="text-amber-500 font-semibold">Monday: Closed</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Savoria Restaurant. All rights reserved. Crafted with passion for culinary excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}