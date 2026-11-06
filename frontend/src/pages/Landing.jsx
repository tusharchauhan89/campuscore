import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getAdminDashboard } from '../api/client';

import {

     
    Users,

     GraduationCap,

     BookOpen,

     ClipboardCheck,

     Wallet,

     Library,

     FileText,

     ArrowRight,

     Shield,

} from 'lucide-react';

const HERO_IMG =

     'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80';

export default function Landing() {

     
    const navigate = useNavigate();

     
    const [stats, setStats] = useState([

          { label: 'Total Students', value: '—', change: 'Loading…', icon: Users },

           { label: 'Faculty', value: '—', change: 'Loading…', icon: GraduationCap },

           { label: 'Books', value: '—', change: 'Loading…', icon: BookOpen },

           { label: 'Issued Books', value: '—', change: 'Loading…', icon: ClipboardCheck },

         
    ]);

     
    useEffect(() => {

           getAdminDashboard()

           .then((res) => {

                 const d = res.data || {};

                
            setStats([

                     {

                           label: 'Total Students',

                          value: String(d.total_students ? ? 0),

                          change: 'Active enrollments',

                          icon: Users,

                          },

                      {

                           label: 'Faculty',

                          value: String(d.total_faculty ? ? 0),

                          change: 'Teaching staff',

                          icon: GraduationCap,

                          },

                      {

                           label: 'Books',

                          value: String(d.total_books ? ? 0),

                          change: 'In library catalog',

                          icon: BookOpen,

                          },

                      {

                           label: 'Issued Books',

                          value: String(d.currently_issued_books ? ? 0),

                          change:

                           d.pending_book_requests != null

                             ? `${d.pending_book_requests} pending requests`

                            : 'Currently issued',

                          icon: ClipboardCheck,

                          },

                    
            ]);

                })

           .catch(() => {

                 // Backend offline → demo numbers (photo jaisa)

                 setStats([

                     { label: 'Total Students', value: '2856', change: '↑ 5.2% this month', icon: Users },

                      { label: 'Faculty', value: '178', change: '↑ 3.1% this month', icon: GraduationCap },

                      { label: 'Courses', value: '124', change: '↑ 4.7% this semester', icon: BookOpen },

                      { label: 'Attendance', value: '92%', change: '↑ 2.4% this month', icon: ClipboardCheck },

                    
            ]);

                });

          }, []);

     
    const features = [

          {

                title: 'Attendance Tracking',

               desc: 'Automate attendance with smart biometric & geolocation integration. Real-time reports and insights.',

               icon: Users,

               color: 'bg-blue-100 text-blue-600',

               },

           {

                title: 'Online Examinations',

               desc: 'Conduct secure, proctored exams online with auto-evaluation and detailed analytics.',

               icon: FileText,

               color: 'bg-indigo-100 text-indigo-600',

               },

           {

                title: 'Fee Management',

               desc: 'Manage fee collection, invoices, due reminders and payment gateways seamlessly.',

               icon: Wallet,

               color: 'bg-emerald-100 text-emerald-600',

               },

           {

                title: 'Library',

               desc: 'Digital library access with e-books, journals, catalog search and member management.',

               icon: Library,

               color: 'bg-amber-100 text-amber-600',

               },

         
    ];

     
    return (

           < div className = "min-h-screen bg-white" >

           { /* Navbar */ }

            < header className = "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" >

             < div className = "max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between" >

              < div className = "flex items-center gap-2.5" >

               < div className = "w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center shadow-sm" >

                < Shield className = "w-5 h-5 text-white" / >

               < /div>

               < div >

                < p className = "font-bold text-slate-800 text-sm leading-tight tracking-tight" >

                GREENFIELD

                < /p>

                < p className = "text-[10px] text-emerald-600 font-semibold tracking-widest uppercase" >

                College

                < /p>

               < /div>

              < /div>

              < nav className = "hidden md:flex items-center gap-8 text-sm font-medium text-slate-600" >

               < a href = "#home"
        className = "text-indigo-600 border-b-2 border-indigo-600 pb-0.5" >

               Home

               < /a>

               < a href = "#features"
        className = "hover:text-indigo-600 transition" >

               Courses

               < /a>

               < a href = "#features"
        className = "hover:text-indigo-600 transition" >

               Admissions

               < /a>

               < button

                type = "button"

               
        onClick = {
            () => navigate('/login') }

               
        className = "hover:text-indigo-600 transition"

               >

               Portal

               < /button>

               < a href = "#features"
        className = "hover:text-indigo-600 transition" >

               Contact

               < /a>

              < /nav>

              < button

               type = "button"

              
        onClick = {
            () => navigate('/login') }

              
        className = "hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition shadow-sm"

              >

              Get In Touch

               < ArrowRight className = "w-4 h-4" / >

              < /button>

             < /div>

            < /header>

            { /* Hero */ }

            < section

             id = "home"

            
        className = "relative min-h-[560px] sm:min-h-[620px] flex items-center overflow-hidden"

            >

             < div className = "absolute inset-0" >

              < img

               src = { HERO_IMG }

              
        alt = "Campus building"

              
        className = "w-full h-full object-cover"

              / >

              < div className = "absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/45" / >

             < /div>

             < div className = "relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full py-16" >

              < div className = "grid lg:grid-cols-2 gap-10 items-center" >

               < div >

                < h1 className = "text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight" >

                Welcome to University Institute of Technology

                 < br / >

                 < span className = "text-white" > Management System < /span>

                < /h1>

                < p className = "mt-4 text-slate-300 text-base sm:text-lg max-w-md" >

                Smart campus management
        for a connected, efficient and empowered college community.

                < /p>

                < div className = "mt-8 flex flex-wrap gap-3" >

                { /* Student Login */ }

        <
        button

          type = "button"

         
        onClick = {
            () => navigate('/login?role=student') }

         
        className = "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-900/40"

        >

          < Users className = "w-4 h-4" / >

         Student Login

        <
        /button>

        { /* Admin Portal */ }

        <
        button

          type = "button"

         
        onClick = {
            () => navigate('/login?role=admin') }

         
        className = "inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/40 text-white font-medium px-5 py-2.5 rounded-xl transition"

        >

          < Shield className = "w-4 h-4" / >

         Admin Portal

        <
        /button>

                < /div>

               < /div>

               { /* Real / fallback stats */ }

               < div className = "grid grid-cols-2 gap-3 sm:gap-4" >

               { stats.map((s) => {

                         const Icon = s.icon;

                         return (

                              < div

                               key = { s.label }

                              
                    className = "bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-5 text-center shadow-2xl"

                              >

                               < div className = "w-11 h-11 mx-auto rounded-full bg-white/25 flex items-center justify-center mb-2" >

                                < Icon className = "w-5 h-5 text-white" / >

                               < /div>

                               < p className = "text-xs sm:text-sm text-slate-100 font-medium" > { s.label } < /p>

                               < p className = "text-2xl sm:text-3xl font-bold text-white mt-0.5 tracking-tight" >

                               { s.value }

                               < /p>

                               < p className = "text-[11px] text-emerald-300 mt-1 font-medium" > { s.change } < /p>

                              < /div>

                            );

                        }) }

               < /div>

              < /div>

             < /div>

            < /section>

            { /* Features */ }

            < section id = "features"
        className = "py-16 sm:py-20 bg-white" >

             < div className = "max-w-6xl mx-auto px-4 sm:px-6" >

              < div className = "text-center mb-12" >

               < p className = "text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-2" >

               —Features—

               < /p>

               < h2 className = "text-2xl sm:text-3xl font-bold text-slate-800" >

               Powerful Tools
        for Modern Campuses

               < /h2>

               < p className = "mt-2 text-slate-500 max-w-xl mx-auto text-sm sm:text-base" >

               Interactive features designed to simplify administration and enhance learning experiences.

               < /p>

              < /div>

              < div className = "grid sm:grid-cols-2 lg:grid-cols-4 gap-5" >

              { features.map((f) => {

                        const Icon = f.icon;

                        return (

                             < div

                              key = { f.title }

                             
                    className = "bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"

                             >

                              < div

                               className = { `w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}` }

                              >

                               < Icon className = "w-6 h-6" / >

                              < /div>

                              < h3 className = "font-semibold text-slate-800 mb-1.5" > { f.title } < /h3>

                              < p className = "text-sm text-slate-500 leading-relaxed" > { f.desc } < /p>

                             < /div>

                           );

                       }) }

              < /div>

             < /div>

            < /section>

            { /* Footer */ }

            < section className = "py-12 bg-slate-900 text-center" >

             < h3 className = "text-xl font-bold text-white mb-2" > Ready to get started ? < /h3>

             < p className = "text-slate-400 text-sm mb-6" >

             Sign in to the student, faculty or admin portal.

             < /p>

             < button

              type = "button"

             
        onClick = {
            () => navigate('/login') }

             
        className = "inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-xl transition"

             >

             Go to Portal

              < ArrowRight className = "w-4 h-4" / >

             < /button>

            < /section>

           < /div>

         );

}