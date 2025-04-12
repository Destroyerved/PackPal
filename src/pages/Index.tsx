
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Users, Clock } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="text-purple-500" size={28} />
            <span className="font-bold text-2xl text-purple-500">PackPal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app" className="font-medium text-purple-500 hover:text-purple-700">
              Dashboard
            </Link>
            <Link 
              to="/app" 
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Never Forget What to Pack Again
              </h1>
              <p className="text-xl text-gray-600">
                PackPal helps teams coordinate logistics for events, trips, and hackathons with real-time collaboration and organized checklists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/app" 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md font-medium text-center transition-colors"
                >
                  Start Organizing
                </Link>
                <a 
                  href="#features" 
                  className="border border-purple-500 text-purple-500 hover:bg-purple-50 px-6 py-3 rounded-md font-medium text-center transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1631624215749-b10b3dd7bca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Team packing for event" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Team Coordination</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to keep your team organized and prepared</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Checklists</h3>
              <p className="text-gray-600">
                Create categorized packing lists with status tracking from "To Pack" to "Delivered."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Users className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Assign different permissions to team members as Owners, Admins, Members, or Viewers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Clock className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                See when items are packed or delivered with instant status updates for the whole team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-purple-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get your team organized?</h2>
          <Link 
            to="/app" 
            className="bg-white text-purple-500 hover:bg-purple-50 px-8 py-3 rounded-md font-medium inline-block transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-8">
            <div className="flex items-center gap-2">
              <Package className="text-purple-500" size={24} />
              <span className="font-bold text-xl text-purple-500">PackPal</span>
            </div>
            <p className="text-gray-500 mt-4 md:mt-0">
              © 2025 PackPal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
