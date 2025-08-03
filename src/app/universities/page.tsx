import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  BarChart3,
  Heart,
  MessageSquare
} from "lucide-react";

export default function UniversitiesPage() {
  const benefits = [
    {
      icon: Users,
      title: "Boost Student Engagement",
      description: "Increase campus participation by 300% with our interactive platform that connects students to clubs, events, and each other.",
      color: "retro-cyan"
    },
    {
      icon: TrendingUp,
      title: "Improve Retention Rates",
      description: "Universities using REPPD see 40% higher student satisfaction and retention through stronger community connections.",
      color: "retro-pink"
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Bank-level security with university ID verification ensures only your students access your campus community.",
      color: "retro-orange"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Get insights into student engagement, popular events, and community trends with our comprehensive dashboard.",
      color: "retro-purple"
    }
  ]

  const features = [
    "✨ Custom university branding and themes",
    "🎯 Targeted announcements and notifications", 
    "📊 Student engagement analytics dashboard",
    "🔒 Secure ID verification system",
    "📱 Mobile-first responsive design",
    "🤝 Club and society management tools",
    "📅 Event management and RSVP system",
    "💬 Moderated community discussions",
    "🎓 Academic year and section organization",
    "🚀 24/7 technical support and onboarding"
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Building className="w-16 h-16 text-retro-orange mx-auto mb-6 retro-glow" />
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-retro font-bold mb-6 retro-text">
              Transform Your Campus
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-6 font-space max-w-4xl mx-auto">
              Join the digital revolution in higher education. REPPD empowers universities to build vibrant, connected campus communities.
            </p>
            <p className="text-lg text-white/60 mb-12 font-space max-w-3xl mx-auto">
              From student onboarding to graduation, create lasting connections that boost engagement, retention, and campus pride.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold text-lg px-8 py-4 shadow-2xl"
            >
              <Link href="/contact-universities">
                <Zap className="w-5 h-5 mr-2" />
                Schedule Demo
              </Link>
            </Button>
            
            <Button 
              variant="glass" 
              size="lg"
              asChild
              className="w-full sm:w-auto text-white border-white/30 hover:border-white/60 font-bold text-lg px-8 py-4"
            >
              <Link href="#benefits">
                <Globe className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Success Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-retro font-bold text-retro-cyan mb-2">300%</div>
              <div className="text-white/60 font-space">Increase in Student Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-retro font-bold text-retro-pink mb-2">40%</div>
              <div className="text-white/60 font-space">Higher Retention Rates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-retro font-bold text-retro-orange mb-2">24/7</div>
              <div className="text-white/60 font-space">Technical Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-retro font-bold mb-6 retro-text">
              Why Universities Choose REPPD
            </h2>
            <p className="text-xl text-white/70 font-space max-w-3xl mx-auto">
              Transform your campus into a thriving digital community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
                <div className="relative mb-6">
                  <benefit.icon className={`w-12 h-12 text-${benefit.color} retro-glow`} />
                  <div className={`absolute inset-0 w-12 h-12 bg-${benefit.color}/20 rounded-full blur-xl group-hover:bg-${benefit.color}/40 transition-all duration-300`}></div>
                </div>
                <h3 className="text-2xl font-retro font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/70 font-space">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-retro font-bold mb-6 retro-text">
              Complete Campus Solution
            </h2>
            <p className="text-xl text-white/70 font-space">
              Everything you need to digitize and enhance campus life
            </p>
          </div>

          <div className="glass-morphism rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-retro-green flex-shrink-0" />
                  <span className="text-white font-space">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-morphism rounded-3xl p-12">
            <Star className="w-16 h-16 text-retro-yellow mx-auto mb-8 retro-glow" />
            <h2 className="text-3xl sm:text-5xl font-retro font-bold mb-6 retro-text">
              Ready to Transform Your Campus?
            </h2>
            <p className="text-xl text-white/70 mb-8 font-space">
              Join leading universities worldwide in creating connected, engaged campus communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold text-lg px-10 py-4"
              >
                <Link href="/contact-universities">
                  <Heart className="w-5 h-5 mr-2" />
                  Get Started Today
                </Link>
              </Button>
              <Button 
                variant="glass" 
                size="lg"
                asChild
                className="text-white border-white/30 hover:border-white/60 font-bold text-lg px-10 py-4"
              >
                <Link href="/demo">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Book a Demo
                </Link>
              </Button>
            </div>

            <p className="text-sm text-white/50 font-space">
              🚀 Setup in 24 hours • 💰 Flexible pricing • 🎓 Dedicated support team
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
