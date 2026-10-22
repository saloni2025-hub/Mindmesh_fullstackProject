import { Link } from 'react-router-dom';
import { Users, BookOpen, Video, UserPlus, Search, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/authContext';
import LandingHeader from '../components/layout/landingHeader.jsx'
import Footer from '../components/layout/Footer';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <div className="flex flex-col items-center text-center px-4 sm:px-8 pt-16 pb-10">
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Learn from anyone,<br />
            <span className="text-orange-500">teach</span>{' '}
            <span className="bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
              everyone.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg mt-6 max-w-2xl">
            A peer-to-peer knowledge sharing platform where you can master a new skill by
            teaching what you already know. No formal instructors, just community.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              {user ? 'Go to Dashboard →' : 'Get Started →'}
            </Link>
            <Link
              to="/discover"
              className="border border-white/20 hover:bg-white/5 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Peers
            </Link>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8 pb-20 pt-10">
          <h2 className="text-3xl font-bold text-white text-center mb-2">Why MindMesh?</h2>
          <p className="text-zinc-400 text-center mb-10">Everything you need to learn and teach in one place.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="bg-orange-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-orange-500" size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Find Your Peer</h3>
              <p className="text-zinc-400">
                Match with users who want to learn what you know, and can teach you what you want to learn.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="bg-teal-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-teal-400" size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Learn Anything</h3>
              <p className="text-zinc-400">
                From React to conversational Spanish, pottery to classical guitar. The community is your syllabus.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="bg-amber-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Video className="text-amber-400" size={22} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Live Sessions</h3>
              <p className="text-zinc-400">
                Built-in video calling and screen sharing makes knowledge exchange seamless and personal.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8 pb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-2">How it works</h2>
          <p className="text-zinc-400 text-center mb-10">Three simple steps to start exchanging knowledge.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: UserPlus, title: '1. Create your profile', text: 'Sign up and add the skills you can teach and the ones you want to learn.' },
              { icon: Search, title: '2. Find a peer', text: 'Search the community, message people and request a session at a time that suits you.' },
              { icon: CalendarCheck, title: '3. Meet and learn', text: 'Join the live call, share your screen, and rate the session afterwards.' },
            ].map((step) => (
              <div key={step.title} className="text-center px-4">
                <div className="mx-auto bg-orange-500/10 border border-orange-500/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="text-orange-500" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;