
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LogOut, 
  LayoutDashboard, 
  Search, 
  X, 
  CheckCircle, 
  CreditCard,
  Phone,
  Mail,
  Smartphone,
  Info
} from 'lucide-react';
import { User, Course, ModalType } from './types';
import { COURSES, getIcon } from './constants';
import { generateCareerRoadmap } from './services/geminiService';

const App: React.FC = () => {
  // Authentication & User State
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // UI State
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // AI Pathfinder State
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Local DB (Simulation)
  useEffect(() => {
    const saved = localStorage.getItem('ma_session_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('ma_session_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('ma_session_user');
    }
  };

  const handleAuth = () => {
    if (authMode === 'register') {
      if (!formData.name || !formData.email || !formData.password) return alert("Please fill all fields");
      const newUser: User = { 
        name: formData.name, 
        email: formData.email, 
        progress: 0, 
        enrolledCourses: [] 
      };
      saveUser(newUser);
      setActiveModal(ModalType.NONE);
    } else {
      if (!formData.email || !formData.password) return alert("Please fill all fields");
      // Simulating successful login
      const dummyUser: User = { 
        name: formData.email.split('@')[0], 
        email: formData.email, 
        progress: 10, 
        enrolledCourses: [] 
      };
      saveUser(dummyUser);
      setActiveModal(ModalType.NONE);
    }
  };

  const handleEnroll = (course: Course) => {
    if (!user) {
      setActiveModal(ModalType.AUTH);
      return;
    }
    if (course.free) {
      finalizeEnrollment(course.id);
    } else {
      setSelectedCourse(course);
      setActiveModal(ModalType.PAYMENT);
    }
  };

  const finalizeEnrollment = (courseId: string) => {
    if (!user) return;
    if (user.enrolledCourses.includes(courseId)) {
        alert("You are already enrolled in this path!");
        return;
    }
    const updatedUser = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, courseId],
      progress: Math.min(100, user.progress + 15)
    };
    saveUser(updatedUser);
    setActiveModal(ModalType.NONE);
    alert("Welcome to the path of Excellence! Enrollment successful.");
  };

  const runPathfinder = async () => {
    if (!goal) return;
    setIsAnalyzing(true);
    setRoadmap(null);
    const result = await generateCareerRoadmap(goal);
    setRoadmap(result);
    setIsAnalyzing(false);
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div 
      onClick={() => { setSelectedCourse(course); setActiveModal(ModalType.COURSE_DETAILS); }}
      className="glass p-8 rounded-[2rem] hover:scale-[1.02] hover:border-cyan-500/50 cursor-pointer transition-all group flex flex-col h-full"
    >
      <div className="mb-6 p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit group-hover:bg-cyan-500/20 transition">
        {getIcon(course.icon)}
      </div>
      <h4 className="text-2xl font-bold mb-3 text-white">{course.title}</h4>
      <p className="text-gray-400 text-sm mb-6 flex-grow">{course.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm font-black text-cyan-400 uppercase tracking-widest">
          {course.free ? 'FREE ACCESS' : `₹${course.price.toLocaleString()}`}
        </span>
        <button className="p-2 text-cyan-400 hover:text-white">
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-[100] glass px-6 py-4 flex flex-col lg:flex-row justify-between items-center mx-4 mt-4 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter text-cyan-400 uppercase leading-none">MAHESH ALLAKATLA</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Training Centre and Educational Institute</p>
          <p className="text-[9px] text-blue-400 font-medium italic mt-0.5">"Teaching is our passion, we follow Excellence!"</p>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-8 mt-4 lg:mt-0">
          <div className="hidden md:flex space-x-6 text-sm font-bold">
            <a href="#curriculum" className="text-gray-300 hover:text-cyan-400 transition">Curriculum</a>
            <a href="#pathfinder" className="text-gray-300 hover:text-cyan-400 transition">AI Pathfinder</a>
          </div>
          
          {!user ? (
            <button 
              onClick={() => setActiveModal(ModalType.AUTH)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              Login / Register
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">{user.name}</p>
                <p className="text-[10px] text-gray-500">{user.email}</p>
              </div>
              <button 
                onClick={() => saveUser(null)}
                className="p-2.5 glass rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500/50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-12 px-6 text-center max-w-5xl mx-auto">
        <div className="section-safety-box p-12 md:p-20 rounded-[3rem]">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white tracking-tight">
            Your Journey to Excellence <br/><span className="text-cyan-400">Starts Here.</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            "We believe every student has the potential to lead. At Mahesh Allakatla Training Centre, we build the visionaries of tomorrow through technical mastery and professional integrity."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#curriculum" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition shadow-2xl shadow-blue-600/30">
              Start Learning Now
            </a>
            <a href="#contact" className="glass text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-white/10 transition">
              Institutional Support
            </a>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      {user && (
        <section id="dashboard" className="py-12 px-6 max-w-7xl mx-auto">
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border-blue-500/30">
            <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3 uppercase tracking-tighter">
              <LayoutDashboard className="text-cyan-400 w-7 h-7" /> Command Centre
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5">
                <h4 className="text-xs text-cyan-400 uppercase font-bold mb-4 tracking-widest">Mastery Progress</h4>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000" 
                    style={{ width: `${user.progress}%` }}
                  />
                </div>
                <p className="text-4xl font-extrabold mt-4 text-white">{user.progress}%</p>
                <p className="text-xs text-gray-500 mt-2">Overall Institutional Excellence Score</p>
              </div>
              <div className="lg:col-span-3">
                <h4 className="text-xs text-cyan-400 uppercase font-bold mb-6 tracking-widest">Active Excellence Paths</h4>
                {user.enrolledCourses.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {user.enrolledCourses.map(id => {
                      const c = COURSES.find(x => x.id === id);
                      return (
                        <button 
                          key={id}
                          onClick={() => { setSelectedCourse(c || null); setActiveModal(ModalType.COURSE_DETAILS); }}
                          className="px-6 py-4 bg-blue-500/10 border border-blue-500/30 text-cyan-400 rounded-2xl font-bold hover:bg-blue-500/20 transition flex items-center gap-3"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resume: {c?.title}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-gray-500 italic">No active paths. Enroll in a curriculum below to begin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI Pathfinder Section */}
      <section id="pathfinder" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="section-safety-box p-12 md:p-16 text-center rounded-[3rem]">
          <h3 className="text-4xl font-extrabold mb-6 text-white tracking-tight italic uppercase">The AI Career Architect</h3>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enter your professional goal. Our Gemini-powered architect will construct a detailed roadmap tailored to Mahesh Allakatla Training Centre's standards.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto bg-black/40 p-2 rounded-[2rem] border border-white/10 focus-within:border-cyan-400/50 transition">
            <input 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              type="text" 
              placeholder="Ex: I want to become a Senior Data Engineer..." 
              className="flex-1 bg-transparent p-5 rounded-2xl outline-none text-white text-lg placeholder:text-gray-600"
            />
            <button 
              onClick={runPathfinder}
              disabled={isAnalyzing}
              className="bg-white text-black px-12 py-5 rounded-[1.5rem] font-extrabold text-lg hover:bg-cyan-50 transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Construct Roadmap"}
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          {roadmap && (
            <div className="mt-12 text-left bg-slate-950/80 p-8 md:p-12 rounded-[2rem] border border-cyan-500/20 max-w-4xl mx-auto">
               <div className="prose prose-invert max-w-none text-gray-300">
                  {roadmap.split('\n').map((line, i) => {
                    if (line.startsWith('#')) return <h4 key={i} className="text-2xl font-bold text-cyan-400 mb-4 mt-6">{line.replace(/#/g, '')}</h4>;
                    if (line.startsWith('-') || line.startsWith('*')) return <li key={i} className="ml-4 mb-2">{line.replace(/^[-*]\s*/, '')}</li>;
                    return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
                  })}
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Curriculum Grid */}
      <section id="curriculum" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight uppercase">Institutional Curriculum</h2>
            <p className="text-gray-400 font-medium max-w-xl">
              Select a technical pathway curated by our elite instructors to begin your journey toward technical mastery.
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-2xl">
            <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase italic">Updated Weekly</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-6 border-t border-white/5 bg-slate-950/80 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1 lg:col-span-2">
            <h1 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter mb-4">MAHESH ALLAKATLA</h1>
            <p className="text-gray-400 mb-10 leading-relaxed max-w-md">
              We provide the framework for professional excellence. Our institute is dedicated to bridging the gap between academic theory and enterprise reality.
            </p>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-center gap-4 group">
                <span className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition"><Phone className="w-5 h-5" /></span>
                +91 91234 56789 (Support)
              </p>
              <p className="flex items-center gap-4 group">
                <span className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition"><Mail className="w-5 h-5" /></span>
                excellence@allakatla-edu.com
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-xl mb-8 text-white uppercase tracking-widest">Our Philosophy</h4>
            <p className="text-gray-400 italic leading-relaxed">
              "We don't just teach technology. We inspire the human spirit to command it with integrity and precision."
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-xl mb-8 text-white uppercase tracking-widest">Location</h4>
            <address className="text-gray-400 not-italic leading-loose">
              Mahesh Allakatla Training Centre<br/>
              Hitech City, Hyderabad<br/>
              India | Global HQ
            </address>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 uppercase tracking-[0.2em] font-bold">
          <p>© 2024 Mahesh Allakatla Training Centre. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400">Institutional Terms</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      
      {/* Auth Modal */}
      {activeModal === ModalType.AUTH && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="glass p-10 rounded-[2.5rem] max-w-md w-full border-white/20 relative shadow-2xl">
            <button onClick={() => setActiveModal(ModalType.NONE)} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
            <h3 className="text-3xl font-extrabold mb-2 text-white">{authMode === 'login' ? 'Student Login' : 'Create Account'}</h3>
            <p className="text-gray-500 text-sm mb-8">Access the Mahesh Allakatla Excellence Ecosystem.</p>
            
            <div className="space-y-4">
              {authMode === 'register' && (
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  type="text" placeholder="Full Name" 
                  className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
                />
              )}
              <input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email" placeholder="Institutional Email" 
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
              />
              <input 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                type="password" placeholder="Secure Password" 
                className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-cyan-400 transition"
              />
            </div>
            
            <button 
              onClick={handleAuth}
              className="w-full mt-10 py-5 bg-blue-600 rounded-2xl font-extrabold text-white hover:bg-blue-700 transition shadow-xl shadow-blue-600/20"
            >
              {authMode === 'login' ? 'Unlock Dashboard' : 'Begin Journey'}
            </button>
            
            <p className="text-center mt-8 text-gray-500 text-sm">
              {authMode === 'login' ? "New to the Institute?" : "Already a student?"}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-cyan-400 font-bold ml-2 hover:underline"
              >
                {authMode === 'login' ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {activeModal === ModalType.COURSE_DETAILS && selectedCourse && (
        <div className="fixed inset-0 bg-black/98 z-[200] flex items-center justify-center p-6 overflow-y-auto backdrop-blur-2xl">
          <div className="glass p-10 md:p-14 rounded-[3rem] max-w-5xl w-full relative shadow-2xl border-white/10 my-auto">
            <button onClick={() => setActiveModal(ModalType.NONE)} className="absolute top-10 right-10 text-white p-2 hover:bg-white/10 rounded-xl transition"><X className="w-8 h-8"/></button>
            <div className="flex items-center gap-4 mb-6">
              <span className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">{getIcon(selectedCourse.icon)}</span>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">{selectedCourse.title}</h2>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-12 mt-10">
              <div className="lg:col-span-3">
                <h5 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2 uppercase tracking-widest text-xs">Curriculum Modules</h5>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedCourse.modules.map((m, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-cyan-500/30 transition group">
                      <span className="text-cyan-400 font-bold group-hover:scale-110 transition">{i+1}</span>
                      <span className="text-gray-300 font-medium">{m}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-8 rounded-3xl bg-blue-600/5 border border-blue-500/10">
                   <h6 className="text-white font-bold mb-2">Institutional Outcome</h6>
                   <p className="text-gray-400 text-sm leading-relaxed">{selectedCourse.details}</p>
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <div className="glass p-10 rounded-[2.5rem] text-center border-cyan-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <CheckCircle className="text-cyan-500/10 w-24 h-24 -mr-8 -mt-8" />
                  </div>
                  <p className="text-xs text-cyan-400 font-black uppercase tracking-[0.3em] mb-4">Certification Path</p>
                  <p className="text-2xl font-bold text-white mb-8">{selectedCourse.cert}</p>
                  <hr className="border-white/5 mb-8" />
                  <p className="text-4xl font-black text-white mb-10">
                    {selectedCourse.free ? 'FREE' : `₹${selectedCourse.price.toLocaleString()}`}
                  </p>
                  <button 
                    onClick={() => handleEnroll(selectedCourse)}
                    className="w-full py-5 bg-blue-600 rounded-[1.5rem] font-extrabold text-white text-lg shadow-xl shadow-blue-600/30 hover:scale-105 hover:bg-blue-700 transition"
                  >
                    Enroll Now
                  </button>
                  <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest">Enrollment Includes Lifetime Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {activeModal === ModalType.PAYMENT && selectedCourse && (
        <div className="fixed inset-0 bg-black/98 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="glass p-12 rounded-[3rem] max-w-2xl w-full border-cyan-500/20 shadow-2xl">
            <h3 className="text-3xl font-extrabold text-white mb-2 uppercase tracking-tight">Secure Checkout</h3>
            <p className="text-cyan-400 font-bold mb-10 tracking-widest uppercase text-xs italic">Pathway: {selectedCourse.title}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <button className="w-full p-6 border border-white/10 rounded-2xl flex justify-between items-center bg-white/5 hover:border-cyan-400 transition group">
                  <span className="font-bold text-gray-300">UPI / GPay / PhonePe</span>
                  <Smartphone className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
                </button>
                <button className="w-full p-6 border border-white/10 rounded-2xl flex justify-between items-center bg-white/5 hover:border-cyan-400 transition group">
                  <span className="font-bold text-gray-300">Net Banking</span>
                  <CreditCard className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
                </button>
              </div>
              <div className="bg-blue-600/10 p-8 rounded-3xl border border-blue-500/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-bold mb-4 uppercase tracking-tighter">EMI Breakdown</h4>
                  <p className="text-gray-400 text-sm mb-2 flex justify-between"><span>3 Months</span> <span className="text-white font-bold">₹{Math.round(selectedCourse.price/3)}/mo</span></p>
                  <p className="text-gray-400 text-sm flex justify-between"><span>6 Months</span> <span className="text-white font-bold">₹{Math.round(selectedCourse.price/6)}/mo</span></p>
                </div>
                <button 
                  onClick={() => finalizeEnrollment(selectedCourse.id)}
                  className="w-full mt-8 py-5 bg-blue-600 rounded-2xl font-extrabold text-white shadow-lg hover:bg-blue-700 transition"
                >
                  Pay ₹{selectedCourse.price}
                </button>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal(ModalType.COURSE_DETAILS)}
              className="mt-8 text-gray-500 text-xs uppercase tracking-widest font-bold hover:text-white"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
