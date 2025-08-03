import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RetroStats } from "@/components/layout/retro-navbar";
import {
  Users,
  MessageSquare,
  Bell,
  BookOpen,
  HelpCircle,
  Home,
  Zap,
  Star,
  Rocket,
  Globe,
  Shield,
  Heart
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-retro font-bold mb-6 sm:mb-8 retro-text leading-tight">
              REPPD
            </h1>
            <div className="absolute inset-0 retro-text blur-3xl opacity-30 -z-10"></div>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-3 sm:mb-4 font-space max-w-3xl mx-auto px-4">
            The Ultimate Campus Social Platform
          </p>

          <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-12 font-space max-w-2xl mx-auto px-4">
            Connect with your university community, discover events, join clubs, and make lasting friendships in a vibrant digital campus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-2xl hover:shadow-retro-pink/30"
            >
              <Link href="/auth/signup">
                <Rocket className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Get Started Free
              </Link>
            </Button>

            <Button
              variant="glass"
              size="lg"
              asChild
              className="w-full sm:w-auto text-white border-white/30 hover:border-white/60 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              <Link href="/demo">
                <Globe className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <RetroStats />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-retro font-bold mb-4 sm:mb-6 retro-text px-4">
              Campus Life, Amplified
            </h2>
            <p className="text-lg sm:text-xl text-white/70 font-space max-w-3xl mx-auto px-4">
              Everything you need to thrive in university life, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Social Feed */}
            <div className="glass-morphism rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-4 sm:mb-6">
                <Home className="w-10 sm:w-12 h-10 sm:h-12 text-retro-cyan retro-glow" />
                <div className="absolute inset-0 w-10 sm:w-12 h-10 sm:h-12 bg-retro-cyan/20 rounded-full blur-xl group-hover:bg-retro-cyan/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-retro font-bold text-white mb-3 sm:mb-4">Social Feed</h3>
              <p className="text-white/70 mb-4 sm:mb-6 font-space text-sm sm:text-base">
                Stay connected with campus happenings through an intelligent feed that shows what matters to you.
              </p>
              <Button variant="outline" size="sm" className="border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black w-full sm:w-auto">
                Explore Feed
              </Button>
            </div>

            {/* Communities */}
            <div className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-6">
                <Users className="w-12 h-12 text-retro-pink retro-glow" />
                <div className="absolute inset-0 w-12 h-12 bg-retro-pink/20 rounded-full blur-xl group-hover:bg-retro-pink/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-retro font-bold text-white mb-4">Communities</h3>
              <p className="text-white/70 mb-6 font-space">
                Join clubs, create study groups, and find your tribe in a diverse campus ecosystem.
              </p>
              <Button variant="outline" size="sm" className="border-retro-pink text-retro-pink hover:bg-retro-pink hover:text-black">
                Join Communities
              </Button>
            </div>

            {/* Smart Requests */}
            <div className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-6">
                <HelpCircle className="w-12 h-12 text-retro-orange retro-glow" />
                <div className="absolute inset-0 w-12 h-12 bg-retro-orange/20 rounded-full blur-xl group-hover:bg-retro-orange/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-retro font-bold text-white mb-4">Smart Requests</h3>
              <p className="text-white/70 mb-6 font-space">
                Find carpools, study partners, or get help with assignments through our intelligent matching system.
              </p>
              <Button variant="outline" size="sm" className="border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-black">
                Browse Requests
              </Button>
            </div>

            {/* Live Events */}
            <div className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-6">
                <Bell className="w-12 h-12 text-retro-purple retro-glow" />
                <div className="absolute inset-0 w-12 h-12 bg-retro-purple/20 rounded-full blur-xl group-hover:bg-retro-purple/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-retro font-bold text-white mb-4">Live Events</h3>
              <p className="text-white/70 mb-6 font-space">
                Never miss important events, deadlines, or opportunities with real-time notifications.
              </p>
              <Button variant="outline" size="sm" className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-black">
                View Events
              </Button>
            </div>

            {/* Campus Intel */}
            <div className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-6">
                <BookOpen className="w-12 h-12 text-retro-green retro-glow" />
                <div className="absolute inset-0 w-12 h-12 bg-retro-green/20 rounded-full blur-xl group-hover:bg-retro-green/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-retro font-bold text-white mb-4">Campus Intel</h3>
              <p className="text-white/70 mb-6 font-space">
                Discover the best spots, professors, and insider tips from fellow students.
              </p>
              <Button variant="outline" size="sm" className="border-retro-green text-retro-green hover:bg-retro-green hover:text-black">
                Explore Campus
              </Button>
            </div>

            {/* Instant Chat */}
            <div className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="relative mb-6">
                <MessageSquare className="w-12 h-12 text-retro-yellow retro-glow" />
                <div className="absolute inset-0 w-12 h-12 bg-retro-yellow/20 rounded-full blur-xl group-hover:bg-retro-yellow/40 transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-retro font-bold text-white mb-4">Instant Chat</h3>
              <p className="text-white/70 mb-6 font-space">
                Connect instantly with friends and communities through our lightning-fast messaging system.
              </p>
              <Button variant="outline" size="sm" className="border-retro-yellow text-retro-yellow hover:bg-retro-yellow hover:text-black">
                Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-morphism rounded-3xl p-12">
            <Star className="w-16 h-16 text-retro-orange mx-auto mb-8 retro-glow" />
            <h2 className="text-4xl md:text-5xl font-retro font-bold mb-6 retro-text">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-white/70 mb-8 font-space">
              Join thousands of students who are already building amazing connections and memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold text-lg px-10 py-4"
              >
                <Link href="/auth/signup">
                  <Heart className="w-5 h-5 mr-2" />
                  Join REPPD Today
                </Link>
              </Button>
              <Button
                variant="glass"
                size="lg"
                asChild
                className="text-white border-white/30 hover:border-white/60 font-bold text-lg px-10 py-4"
              >
                <Link href="/auth/login">
                  <Shield className="w-5 h-5 mr-2" />
                  Already a Member?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scan lines effect */}
      <div className="scan-lines fixed inset-0 pointer-events-none z-0"></div>
    </div>
  );
}
