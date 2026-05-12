import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  FileText, 
  Video, 
  Gamepad2, 
  Image as ImageIcon, 
  ChevronRight, 
  Loader2,
  Plus,
  Settings2,
  BrainCircuit,
  GraduationCap,
  Users,
  Clock,
  Layout,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Heart,
  Scale,
  Languages,
  Wrench,
  Activity,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateLessonPlan, generateAdvancedFeature, LessonPlanRequest } from './services/geminiService';
import { exportToWord } from './services/exportService';

const AGE_GROUPS = [
  "12-24 tháng",
  "24-36 tháng",
  "3-4 tuổi",
  "4-5 tuổi",
  "5-6 tuổi"
];

const DEVELOPMENT_AREAS = [
  "Phát triển Thể chất",
  "Phát triển Nhận thức",
  "Phát triển Ngôn ngữ",
  "Phát triển Tình cảm - Kỹ năng xã hội",
  "Phát triển Thẩm mỹ"
];

const ACTIVITY_TYPES = [
  "Học có chủ đích",
  "Hoạt động góc",
  "Hoạt động ngoài trời",
  "Hoạt động chiều"
];

const INTEGRATION_LEVELS = [
  { id: "basic", label: "Cơ bản", icon: BookOpen },
  { id: "steam", label: "Tích hợp STEAM", icon: Settings2 },
  { id: "ai", label: "Tích hợp AI", icon: BrainCircuit },
  { id: "steam_ai", label: "STEAM + AI nâng cao", icon: Sparkles },
  { id: "traffic_safety", label: "An toàn giao thông", icon: ShieldAlert },
  { id: "abuse_prevention", label: "Phòng chống xâm hại", icon: ShieldCheck },
  { id: "sel", label: "Giáo dục cảm xúc xã hội", icon: Heart },
  { id: "children_rights", label: "Quyền trẻ em", icon: Scale },
  { id: "vietnamese_enhancement", label: "Tăng cường tiếng Việt", icon: Languages },
  { id: "elm", label: "Bộ công cụ ELM", icon: Wrench },
  { id: "physical_dev", label: "Phát triển thể chất", icon: Activity }
];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (activationCode.trim().toUpperCase() === "GIAHUY@AI") {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Mã kích hoạt không chính xác. Vui lòng thử lại!');
    }
  };

  const [formData, setFormData] = useState<LessonPlanRequest>({
    ageGroup: AGE_GROUPS[2],
    theme: "",
    developmentArea: DEVELOPMENT_AREAS[1],
    activityType: ACTIVITY_TYPES[0],
    integrationLevel: "basic",
    activityName: "",
    duration: "30 phút",
    objectives: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'advanced'>('plan');
  const [advancedContent, setAdvancedContent] = useState<{type: string, content: string} | null>(null);
  const [isGeneratingAdvanced, setIsGeneratingAdvanced] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activityName || !formData.theme) return;

    setIsGenerating(true);
    setLessonPlan(null);
    setAdvancedContent(null);
    setActiveTab('plan');

    try {
      const result = await generateLessonPlan(formData);
      setLessonPlan(result || "Không thể tạo giáo án. Vui lòng thử lại.");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      setLessonPlan("Đã xảy ra lỗi trong quá trình tạo giáo án.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdvancedFeature = async (type: string) => {
    if (!lessonPlan) return;
    setIsGeneratingAdvanced(true);
    setActiveTab('advanced');
    try {
      const result = await generateAdvancedFeature(type, lessonPlan);
      setAdvancedContent({ type, content: result || "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingAdvanced(false);
    }
  };

  const getAdvancedTitle = (type: string) => {
    switch (type) {
      case 'teaching_script': return 'Kịch bản dạy nhanh';
      case 'video_script': return 'Kịch bản Video AI';
      case 'worksheet': return 'Phiếu học tập';
      case 'ppt_game': return 'Trò chơi PowerPoint';
      case 'image_prompts': return 'Prompt sinh hình ảnh';
      default: return 'Tính năng nâng cao';
    }
  };

if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Decorative Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] text-blue-200 opacity-40"
          >
            <Sparkles size={40} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[15%] text-purple-200 opacity-40"
          >
            <Star size={32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-[5%] text-pink-200 opacity-40"
          >
            <Heart size={36} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 25, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-[10%] text-emerald-200 opacity-40"
          >
            <GraduationCap size={44} />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl shadow-blue-200/50 border border-white/50 relative z-10"
        >
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 mx-auto mb-6"
            >
              <GraduationCap className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-3xl font-black text-[#eb1313] tracking-tight mb-2 uppercase">SOẠN KẾ HOẠCH BÀI DẠY MẦM NON THÔNG MINH</h1>
            <p className="text-blue-600 font-bold text-lg mb-4">Thầy Gia Huy chào mừng bạn đến với AI soạn giảng thông minh</p>
            <p className="text-slate-500 font-medium">Nhập mã kích hoạt để truy cập hệ thống</p>
          </div>

          <form onSubmit={handleActivation} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="activationCode" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mã kích hoạt</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <input 
                    type="text"
                    name="activationCode"
                    id="activationCode"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="Nhập mã kích hoạt..."
                    className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-pink-500 font-bold ml-2"
                  >
                    {loginError}
                  </motion.p>
                )}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              VÀO HỆ THỐNG
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200/50"
            >
              <GraduationCap size={28} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">SOANGIANGMN</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-600 mt-1">Soạn kế hoạch bài dạy thông minh</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-emerald-600 transition-all hover:translate-y-[-1px]">Hướng dẫn</a>
              <a href="#" className="hover:text-emerald-600 transition-all hover:translate-y-[-1px]">Thư viện</a>
              <a href="#" className="hover:text-emerald-600 transition-all hover:translate-y-[-1px]">Cộng đồng</a>
            </nav>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200">
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar: Form */}
        <div className="lg:col-span-4 space-y-8">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Settings2 size={22} />
              </div>
              <h2 className="font-black text-xl tracking-tight">Cấu hình bài dạy</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Users size={14} /> Độ tuổi của trẻ
                  </label>
                  <select 
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    {AGE_GROUPS.map(age => <option key={age} value={age}>{age}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Chủ đề giáo dục</label>
                  <input 
                    type="text"
                    name="theme"
                    placeholder="Nhập chủ đề (VD: Quê hương)"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Lĩnh vực phát triển</label>
                  <select 
                    name="developmentArea"
                    value={formData.developmentArea}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    {DEVELOPMENT_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Loại hình hoạt động</label>
                  <select 
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all cursor-pointer appearance-none"
                  >
                    {ACTIVITY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Phương pháp tích hợp</label>
                <div className="grid grid-cols-2 gap-3">
                  {INTEGRATION_LEVELS.map(level => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, integrationLevel: level.id }))}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 group",
                        formData.integrationLevel === level.id 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner" 
                          : "border-slate-100 bg-white text-slate-400 hover:border-emerald-200 hover:text-emerald-600"
                      )}
                    >
                      <level.icon size={24} className={cn("transition-transform group-hover:scale-110", formData.integrationLevel === level.id && "scale-110")} />
                      <span className="text-[11px] font-black text-center leading-tight">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tên hoạt động cụ thể</label>
                  <input 
                    type="text"
                    name="activityName"
                    placeholder="VD: Bé làm quen với chữ cái A, Ă, Â"
                    value={formData.activityName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Clock size={14} /> Thời lượng
                    </label>
                    <input 
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <BrainCircuit size={14} /> Mục tiêu
                    </label>
                    <div className="h-[52px] flex items-center px-4 bg-slate-50 rounded-2xl text-[10px] font-bold text-slate-400 leading-tight">
                      AI sẽ tự động đề xuất mục tiêu chuẩn
                    </div>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isGenerating}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    ĐANG SOẠN THẢO...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    SOẠN GIÁO ÁN NGAY
                  </>
                )}
              </motion.button>
            </form>
          </motion.section>
        </div>

        {/* Right Content: Preview & Tools */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {!lessonPlan && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[700px] flex flex-col items-center justify-center text-center p-16 bg-white rounded-[3rem] border-4 border-dashed border-slate-100"
              >
                <div className="relative mb-10">
                  <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <BookOpen size={64} />
                  </div>
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-500 border border-emerald-100"
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Chào mừng đến với SOANGIANGMN</h3>
                <p className="text-slate-500 max-w-lg text-lg font-medium leading-relaxed">
                  Trợ lý AI chuyên biệt giúp bạn soạn giáo án mầm non chuẩn chương trình Việt Nam chỉ trong vài giây.
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-3">
                  {['Tích hợp STEAM', 'Ứng dụng AI', 'Kịch bản dạy nhanh', 'Phiếu học tập', 'Video AI'].map(tag => (
                    <div key={tag} className="bg-slate-50 px-6 py-3 rounded-2xl text-xs font-black text-slate-400 border border-slate-100">
                      {tag}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Tabs */}
                <div className="flex bg-white p-2 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-fit">
                  <button 
                    onClick={() => setActiveTab('plan')}
                    className={cn(
                      "px-8 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center gap-3",
                      activeTab === 'plan' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                    )}
                  >
                    <FileText size={20} /> GIÁO ÁN CHI TIẾT
                  </button>
                  <button 
                    onClick={() => setActiveTab('advanced')}
                    disabled={!lessonPlan}
                    className={cn(
                      "px-8 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center gap-3",
                      activeTab === 'advanced' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30"
                    )}
                  >
                    <Sparkles size={20} /> TÍNH NĂNG NÂNG CAO
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  {/* Action Bar */}
                  <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                      <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                        {activeTab === 'plan' ? 'Bản thảo giáo án chính thức' : getAdvancedTitle(advancedContent?.type || '')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => lessonPlan && exportToWord(formData.activityName, activeTab === 'plan' ? lessonPlan : (advancedContent?.content || ''))}
                        className="flex items-center gap-2 bg-white border-2 border-slate-100 px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                      >
                        <Download size={18} /> XUẤT FILE WORD
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-10 min-h-[600px]">
                    {isGenerating ? (
                      <div className="flex flex-col items-center justify-center h-full py-32">
                        <div className="relative mb-8">
                          <Loader2 className="animate-spin text-emerald-600" size={64} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BrainCircuit size={24} className="text-emerald-400" />
                          </div>
                        </div>
                        <p className="text-xl font-black text-slate-800 mb-2">Đang khởi tạo trí tuệ nhân tạo...</p>
                        <p className="text-slate-400 font-bold animate-pulse">Đang phân tích chương trình GDMN Việt Nam và soạn thảo kịch bản...</p>
                      </div>
                    ) : activeTab === 'plan' ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:text-lg prose-li:text-slate-600 prose-li:text-lg prose-strong:text-emerald-700 markdown-body"
                      >
                        <Markdown>{lessonPlan || ''}</Markdown>
                      </motion.div>
                    ) : (
                      <div className="space-y-10">
                        {/* Advanced Feature Grid */}
                        {!advancedContent && !isGeneratingAdvanced && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { id: 'teaching_script', title: 'Kịch bản dạy nhanh', desc: 'Lời thoại & các bước then chốt cho cô.', icon: MessageSquare, color: 'blue' },
                              { id: 'video_script', title: 'Kịch bản Video AI', desc: 'Phân cảnh & lời thoại cho video bài giảng.', icon: Video, color: 'purple' },
                              { id: 'worksheet', title: 'Phiếu học tập', desc: 'Thiết kế bài tập sáng tạo cho bé.', icon: FileText, color: 'orange' },
                              { id: 'ppt_game', title: 'Trò chơi PowerPoint', desc: 'Cấu trúc trò chơi tương tác tự động.', icon: Gamepad2, color: 'red' },
                              { id: 'image_prompts', title: 'Prompt sinh hình ảnh', desc: 'Câu lệnh AI tạo ảnh minh họa chuẩn xác.', icon: ImageIcon, color: 'emerald', full: true }
                            ].map(feature => (
                              <motion.button 
                                key={feature.id}
                                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                onClick={() => handleAdvancedFeature(feature.id)}
                                className={cn(
                                  "p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 hover:bg-white hover:border-emerald-200 transition-all text-left group",
                                  feature.full && "md:col-span-2"
                                )}
                              >
                                <div className={cn(
                                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg",
                                  feature.color === 'blue' && "bg-blue-50 text-blue-600 shadow-blue-100",
                                  feature.color === 'purple' && "bg-purple-50 text-purple-600 shadow-purple-100",
                                  feature.color === 'orange' && "bg-orange-50 text-orange-600 shadow-orange-100",
                                  feature.color === 'red' && "bg-red-50 text-red-600 shadow-red-100",
                                  feature.color === 'emerald' && "bg-emerald-50 text-emerald-600 shadow-emerald-100"
                                )}>
                                  <feature.icon size={28} />
                                </div>
                                <h4 className="font-black text-xl text-slate-900 mb-2">{feature.title}</h4>
                                <p className="text-sm text-slate-500 font-bold">{feature.desc}</p>
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {isGeneratingAdvanced && (
                          <div className="flex flex-col items-center justify-center h-full py-32">
                            <Loader2 className="animate-spin text-emerald-600 mb-6" size={56} />
                            <p className="text-xl font-black text-slate-800">AI đang xử lý yêu cầu nâng cao...</p>
                          </div>
                        )}

                        {advancedContent && !isGeneratingAdvanced && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                          >
                            <button 
                              onClick={() => setAdvancedContent(null)}
                              className="text-sm font-black text-emerald-600 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                            >
                              <ChevronRight className="rotate-180" size={18} />
                              QUAY LẠI DANH SÁCH TÍNH NĂNG
                            </button>
                            <div className="prose prose-slate max-w-none markdown-body bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100">
                              <Markdown>{advancedContent.content}</Markdown>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-16 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter block">SOANGIANGMN</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 TRỢ LÝ GIÁO VIÊN MẦM NON</span>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-4">
            <p className="text-sm text-slate-500 font-bold text-center md:text-right max-w-md leading-relaxed">
              Công cụ hỗ trợ sáng tạo nội dung giáo dục mầm non. Mọi nội dung cần được kiểm duyệt chuyên môn trước khi giảng dạy.
            </p>
            <div className="flex gap-6 text-xs font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-emerald-600">Điều khoản</a>
              <a href="#" className="hover:text-emerald-600">Bảo mật</a>
              <a href="#" className="hover:text-emerald-600">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
