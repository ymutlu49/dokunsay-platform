/**
 * DokunSay Bar — i18n Service (5 dil: tr/ku/en/ar/fa)
 *
 * NOT: Kurmancî (ku) çevirileri platform FerMat sözlüğüne
 * (`@shared/fermat-terms.ku.js` → `_platform/shared/FERMAT.ku.md`)
 * göre sürekli iyileştirilmektedir. Yeni eklenen matematik terimlerinin
 * FerMat'e uygun olduğundan emin ol.
 */

import type { Language, Template } from "../types";

type TranslationKey =
  | "rods" | "frames" | "dots" | "five" | "ten"
  | "clear" | "start" | "sel" | "draw" | "write" | "erase"
  | "undo" | "redo" | "labels" | "numline"
  | "cover" | "reveal" | "note" | "save" | "load"
  | "png" | "print" | "hint"
  | "trashY" | "trashN" | "nlDesc" | "textPh"
  | "checkOk" | "checkNo" | "checkNone"
  | "speakBtn" | "checkBtn"
  | "keşif" | "oyun" | "sayma" | "işlem" | "tahmin"
  | "voiceOn" | "voiceOff"
  | "teacherMode" | "studentMode"
  | "saveTpl" | "progress"
  | "material" | "activity" | "custom" | "completed"
  | "shortcuts" | "voiceCommands" | "closeHint"
  | "delete" | "copy" | "countTTS"
  | "read" | "check"
  /* About */
  | "about" | "aboutSubtitle" | "aboutDescription" | "aboutCreators"
  | "aboutRoleMutlu" | "aboutNameDemirtas" | "aboutRoleDemirtas" | "aboutMission"
  /* AR */
  | "ar3D" | "arCamera" | "arRecognition" | "arCameraPermission"
  | "arTapToPlace" | "arDetecting" | "arRodsFound" | "arNoCamera"
  /* Auth & User Management */
  | "login" | "signup" | "logout" | "email" | "password" | "confirmPassword"
  | "fullName" | "forgotPassword" | "resetPassword" | "sendResetLink"
  | "noAccount" | "hasAccount" | "orContinueWith" | "google"
  | "roleTeacher" | "roleStudent" | "roleParent" | "selectRole"
  | "studentCodeLabel" | "studentCodeHint" | "childCodeLabel" | "childCodeHint"
  | "welcome" | "dashboard" | "myClasses" | "createClass" | "joinClass"
  | "className" | "classCode" | "students" | "noStudents"
  | "linkChild" | "childProgress" | "noChildren"
  | "enterClassCode" | "enterChildCode" | "join" | "create" | "remove"
  | "back" | "profile" | "attempts"
  | "authErrorEmail" | "authErrorPassword" | "authErrorWeak" | "authErrorExists"
  | "authErrorInvalid" | "authErrorNotFound" | "authErrorGeneric"
  | "resetSent" | "classCreated" | "classJoined" | "childLinked"
  | "invalidCode" | "alreadyLinked" | "openApp";

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  tr: {
    rods: "Sayı Çubukları", frames: "Kartlar", dots: "Nokta Kalıpları",
    five: "Beşlik", ten: "Onluk",
    clear: "Temizle", start: "Başla",
    sel: "Seç", draw: "Çiz", write: "Yaz", erase: "Sil",
    undo: "Geri", redo: "İleri",
    labels: "Etiket", numline: "Doğru",
    cover: "Kapat", reveal: "Aç",
    note: "Nota", save: "Kaydet", load: "Yükle",
    png: "PNG İndir", print: "Yazdır",
    hint: "Soldan çubuk seçerek başlayın",
    trashY: "Bırak — Sil", trashN: "Silmek için buraya sürükle",
    nlDesc: "Sayı Doğrusu",
    textPh: "Metin yazın...",
    checkOk: "Harika! Doğru!",
    checkNo: "Henüz tam değil. Tekrar dene!",
    checkNone: "Bu etkinlikte otomatik kontrol yok.",
    speakBtn: "Yönergeyi sesli oku",
    checkBtn: "Kontrol Et",
    keşif: "Keşif", oyun: "Oyunlar", sayma: "Sayma",
    işlem: "İşlemler", tahmin: "Tahmin",
    voiceOn: "Sesli komut açık", voiceOff: "Sesli komut kapalı",
    teacherMode: "Öğretmen Modu", studentMode: "Öğrenci Modu",
    saveTpl: "Şablon Kaydet", progress: "İlerleme",
    material: "Materyal", activity: "Etkinlik", custom: "Özel",
    completed: "tamamlandı",
    shortcuts: "Kısayollar", voiceCommands: "Sesli komutlar",
    closeHint: "Kapatmak için herhangi bir yere tıklayın",
    delete: "Sil", copy: "Kopyala", countTTS: "Sesli say (TTS)",
    read: "Oku", check: "Kontrol",
    about: "Hakkında",
    aboutSubtitle: "Sayı Çubukları ile Matematik Öğrenme Platformu",
    aboutDescription: "DokunSay, Prof. Dr. Yılmaz Mutlu ve Matematik Öğretmeni Çiğdem Demirtaş tarafından geliştirilen DokunSay Sayı Çubukları Seti'nin dijital uyarlamasıdır. Bu interaktif platform, somut manipülatif temelli öğretim yaklaşımıyla çocukların sayı kavramını, temel aritmetik işlemlerini ve matematiksel düşünme becerilerini geliştirmelerini desteklemek amacıyla tasarlanmıştır.",
    aboutCreators: "Geliştiriciler",
    aboutRoleMutlu: "Akademik Danışman ve Kavramsal Tasarım",
    aboutNameDemirtas: "Çiğdem Demirtaş",
    aboutRoleDemirtas: "Pedagojik Tasarım ve Uygulama Geliştirme",
    aboutMission: "DokunSay, diskalkuli ve matematik öğrenme güçlüğü yaşayan çocuklar başta olmak üzere tüm öğrencilerin matematiği somut deneyimlerle, dokunarak ve keşfederek öğrenmelerini hedefler.",
    ar3D: "3D Görünüm", arCamera: "Kamera AR", arRecognition: "Çubuk Tanıma",
    arCameraPermission: "Kamera izni gerekli", arTapToPlace: "Yerleştirmek için dokun",
    arDetecting: "Çubuk arıyorum... Kameraya bir çubuk tutun", arRodsFound: "çubuk bulundu",
    arNoCamera: "Kamera kullanılamıyor",
    login: "Giriş Yap", signup: "Kayıt Ol", logout: "Çıkış Yap",
    email: "E-posta", password: "Şifre", confirmPassword: "Şifre Tekrar",
    fullName: "Ad Soyad", forgotPassword: "Şifremi Unuttum", resetPassword: "Şifre Sıfırla",
    sendResetLink: "Sıfırlama Bağlantısı Gönder",
    noAccount: "Hesabınız yok mu?", hasAccount: "Zaten hesabınız var mı?",
    orContinueWith: "veya şununla devam et", google: "Google",
    roleTeacher: "Öğretmen", roleStudent: "Öğrenci", roleParent: "Veli",
    selectRole: "Rolünüzü seçin",
    studentCodeLabel: "Öğrenci Kodunuz", studentCodeHint: "Bu kodu velinizle paylaşın",
    childCodeLabel: "Çocuğun Öğrenci Kodu", childCodeHint: "Çocuğunuzun kodunu girin",
    welcome: "Hoş Geldiniz", dashboard: "Panel",
    myClasses: "Sınıflarım", createClass: "Sınıf Oluştur", joinClass: "Sınıfa Katıl",
    className: "Sınıf Adı", classCode: "Sınıf Kodu", students: "Öğrenciler", noStudents: "Henüz öğrenci yok",
    linkChild: "Çocuk Bağla", childProgress: "Çocuk İlerlemesi", noChildren: "Henüz bağlı çocuk yok",
    enterClassCode: "Sınıf kodunu girin", enterChildCode: "Çocuğun kodunu girin",
    join: "Katıl", create: "Oluştur", remove: "Çıkar",
    back: "Geri", profile: "Profil", attempts: "deneme",
    authErrorEmail: "Geçersiz e-posta adresi", authErrorPassword: "Yanlış şifre",
    authErrorWeak: "Şifre en az 6 karakter olmalı", authErrorExists: "Bu e-posta zaten kayıtlı",
    authErrorInvalid: "Geçersiz kimlik bilgileri", authErrorNotFound: "Hesap bulunamadı",
    authErrorGeneric: "Bir hata oluştu. Tekrar deneyin.",
    resetSent: "Sıfırlama bağlantısı gönderildi", classCreated: "Sınıf oluşturuldu",
    classJoined: "Sınıfa katıldınız", childLinked: "Çocuk bağlandı",
    invalidCode: "Geçersiz kod", alreadyLinked: "Zaten bağlı", openApp: "Uygulamayı Aç",
  },
  ku: {
    rods: "Çovikên Hejmaran", frames: "Çarçove", dots: "Qalibên Xalan",
    five: "Pêncan", ten: "Dehan",
    clear: "Paqij Bike", start: "Dest Pê Bike",
    sel: "Hilbijêre", draw: "Bikişîne", write: "Binivîse", erase: "Jê Bibe",
    undo: "Paş", redo: "Pêş",
    labels: "Etîket", numline: "Hêl",
    cover: "Bigire", reveal: "Veke",
    note: "Not", save: "Tomar Bike", load: "Bar Bike",
    png: "PNG Daxîne", print: "Çap Bike",
    hint: "Ji milê çepê çovikek hilbijêre",
    trashY: "Berde — Jê Bibe", trashN: "Ji bo jêbirinê bikişîne vir",
    nlDesc: "Hêla Hejmaran",
    textPh: "Li vir binivîse...",
    checkOk: "Pîroz be! Rast e!",
    checkNo: "Hê temam nebûye. Careke din biceribîne!",
    checkNone: "Di vê çalakiyê de kontrola otomatîk nîne.",
    speakBtn: "Rêwerzê bi deng bixwîne",
    checkBtn: "Kontrol Bike",
    keşif: "Keşf", oyun: "Lîstik", sayma: "Jimartin",
    işlem: "Kirarî", tahmin: "Texmîn",
    voiceOn: "Fermana dengî çalak e", voiceOff: "Fermana dengî neçalak e",
    teacherMode: "Moda Mamosteyî", studentMode: "Moda Xwendekariyê",
    saveTpl: "Şablonê Tomar Bike", progress: "Pêşveçûn",
    material: "Amûr", activity: "Çalakî", custom: "Xwerû",
    completed: "temam bû",
    shortcuts: "Kurtebirr", voiceCommands: "Fermanên dengî",
    closeHint: "Ji bo girtinê li her derê bitikîne",
    delete: "Jê bibe", copy: "Kopî bike", countTTS: "Bijmêre (TTS)",
    read: "Bixwîne", check: "Kontrol",
    about: "Derbarê",
    aboutSubtitle: "Platforma Fêrbûna Matematîkê bi Çovikên Hejmaran",
    aboutDescription: "DokunSay, guhertoya dîjîtal a DokunSay Çovikên Hejmaran e ku ji aliyê Prof. Dr. Yılmaz Mutlu û Mamosteyê Matematîkê Çiğdem Demirtaş ve hatiye pêşxistin. Ev platforma înteraktîf, bi nêzîkatiya hînkirinê ya li ser amûrên berçav, ji bo piştgirîkirina zarokan di pêşxistina têgeha hejmaran, hesabên bingehîn û jêhatîbûna ramana matematîkî de hatiye sêwirandin.",
    aboutCreators: "Pêşxistvan",
    aboutRoleMutlu: "Şêwirmendê Akademîk û Sêwirana Têgehî",
    aboutNameDemirtas: "Çiğdem Demirtaş",
    aboutRoleDemirtas: "Sêwirana Pedagojîk û Pêşxistina Sepanê",
    aboutMission: "DokunSay, bi taybetî ji bo zarokên ku bi dîskalkulî û zehmetiya fêrbûna matematîkê re rû bi rû ne, armanc dike ku hemû xwendekar bi ezmûnên berçav, bi destlêdanê û keşfkirinê matematîkê fêr bibin.",
    ar3D: "Dîmena 3D", arCamera: "Kamera AR", arRecognition: "Naskirina Çovikan",
    arCameraPermission: "Destûra kamerayê pêwîst e", arTapToPlace: "Ji bo danînê lê bixin",
    arDetecting: "Li çovikan digerim... Çovikek li ber kamerayê bigrin", arRodsFound: "çovik hatin dîtin",
    arNoCamera: "Kamera nayê bikaranîn",
    login: "Têkeve", signup: "Tomar Bibe", logout: "Derkeve",
    email: "E-peyam", password: "Şîfre", confirmPassword: "Şîfre Dubare",
    fullName: "Nav û Paşnav", forgotPassword: "Şîfreya xwe ji bîr kir?", resetPassword: "Şîfreyê Nû Bike",
    sendResetLink: "Lînka nûkirinê bişîne",
    noAccount: "Hesabê te tune ye?", hasAccount: "Hesabê te heye?",
    orContinueWith: "an jî bi vê bidomîne", google: "Google",
    roleTeacher: "Mamoste", roleStudent: "Xwendekar", roleParent: "Dê/Bav",
    selectRole: "Rola xwe hilbijêre",
    studentCodeLabel: "Koda Xwendekar", studentCodeHint: "Vê kodê bi dê/bavê xwe re parve bike",
    childCodeLabel: "Koda Zarokê", childCodeHint: "Koda zarokê xwe binivîse",
    welcome: "Bi xêr hatî", dashboard: "Panel",
    myClasses: "Dersên Min", createClass: "Ders Çê Bike", joinClass: "Beşdarî Dersê Bibe",
    className: "Navê Dersê", classCode: "Koda Dersê", students: "Xwendekar", noStudents: "Hê xwendekar tune",
    linkChild: "Zarokê Girêde", childProgress: "Pêşveçûna Zarokê", noChildren: "Hê zarok girêdayî nîne",
    enterClassCode: "Koda dersê binivîse", enterChildCode: "Koda zarokê binivîse",
    join: "Beşdar bibe", create: "Çê bike", remove: "Derxe",
    back: "Paş", profile: "Profîl", attempts: "ceribandin",
    authErrorEmail: "E-peyama çewt", authErrorPassword: "Şîfreya çewt",
    authErrorWeak: "Şîfre divê herî kêm 6 tîp be", authErrorExists: "Ev e-peyam berê hatiye tomarkirin",
    authErrorInvalid: "Agahiyên çewt", authErrorNotFound: "Hesab nehat dîtin",
    authErrorGeneric: "Çewtî çêbû. Careke din biceribîne.",
    resetSent: "Lînka nûkirinê hat şandin", classCreated: "Ders hat çêkirin",
    classJoined: "Tu beşdarî dersê bûyî", childLinked: "Zarok hat girêdan",
    invalidCode: "Koda çewt", alreadyLinked: "Jixwe girêdayî ye", openApp: "Serlêdanê Veke",
  },
  en: {
    rods: "Number Rods", frames: "Frames", dots: "Dot Patterns",
    five: "Five-frame", ten: "Ten-frame",
    clear: "Clear", start: "Start",
    sel: "Select", draw: "Draw", write: "Write", erase: "Erase",
    undo: "Undo", redo: "Redo",
    labels: "Labels", numline: "Number Line",
    cover: "Cover", reveal: "Reveal",
    note: "Note", save: "Save", load: "Load",
    png: "Export PNG", print: "Print",
    hint: "Select a rod from the left panel to begin",
    trashY: "Release — Delete", trashN: "Drag here to delete",
    nlDesc: "Number Line",
    textPh: "Type text...",
    checkOk: "Well done! Correct!",
    checkNo: "Not quite right. Try again!",
    checkNone: "No automatic check for this activity.",
    speakBtn: "Read instructions aloud",
    checkBtn: "Check",
    keşif: "Exploration", oyun: "Games", sayma: "Counting",
    işlem: "Operations", tahmin: "Estimation",
    voiceOn: "Voice commands on", voiceOff: "Voice commands off",
    teacherMode: "Teacher Mode", studentMode: "Student Mode",
    saveTpl: "Save Template", progress: "Progress",
    material: "Materials", activity: "Activities", custom: "Custom",
    completed: "completed",
    shortcuts: "Shortcuts", voiceCommands: "Voice commands",
    closeHint: "Click anywhere to close",
    delete: "Delete", copy: "Copy", countTTS: "Count aloud (TTS)",
    read: "Read", check: "Check",
    about: "About",
    aboutSubtitle: "Mathematics Learning Platform with Number Rods",
    aboutDescription: "DokunSay is the digital adaptation of the DokunSay Number Rods Set, developed by Prof. Dr. Yılmaz Mutlu and Mathematics Teacher Çiğdem Demirtaş. This interactive platform is designed to support children in developing number sense, basic arithmetic operations, and mathematical thinking skills through a concrete manipulative-based instructional approach.",
    aboutCreators: "Developed by",
    aboutRoleMutlu: "Academic Advisor & Conceptual Design",
    aboutNameDemirtas: "Çiğdem Demirtaş",
    aboutRoleDemirtas: "Pedagogical Design & Application Development",
    aboutMission: "DokunSay aims to help all learners — especially children with dyscalculia and mathematics learning difficulties — discover mathematics through concrete, hands-on exploration.",
    ar3D: "3D View", arCamera: "Camera AR", arRecognition: "Rod Detection",
    arCameraPermission: "Camera permission required", arTapToPlace: "Tap to place",
    arDetecting: "Looking for rods... Hold a rod in front of the camera", arRodsFound: "rods found",
    arNoCamera: "Camera not available",
    login: "Sign In", signup: "Sign Up", logout: "Sign Out",
    email: "Email", password: "Password", confirmPassword: "Confirm Password",
    fullName: "Full Name", forgotPassword: "Forgot Password?", resetPassword: "Reset Password",
    sendResetLink: "Send Reset Link",
    noAccount: "Don't have an account?", hasAccount: "Already have an account?",
    orContinueWith: "or continue with", google: "Google",
    roleTeacher: "Teacher", roleStudent: "Student", roleParent: "Parent",
    selectRole: "Select your role",
    studentCodeLabel: "Your Student Code", studentCodeHint: "Share this code with your parent",
    childCodeLabel: "Child's Student Code", childCodeHint: "Enter your child's code",
    welcome: "Welcome", dashboard: "Dashboard",
    myClasses: "My Classes", createClass: "Create Class", joinClass: "Join Class",
    className: "Class Name", classCode: "Class Code", students: "Students", noStudents: "No students yet",
    linkChild: "Link Child", childProgress: "Child's Progress", noChildren: "No linked children yet",
    enterClassCode: "Enter class code", enterChildCode: "Enter child's code",
    join: "Join", create: "Create", remove: "Remove",
    back: "Back", profile: "Profile", attempts: "attempts",
    authErrorEmail: "Invalid email address", authErrorPassword: "Incorrect password",
    authErrorWeak: "Password must be at least 6 characters", authErrorExists: "Email already registered",
    authErrorInvalid: "Invalid credentials", authErrorNotFound: "Account not found",
    authErrorGeneric: "An error occurred. Please try again.",
    resetSent: "Reset link sent", classCreated: "Class created",
    classJoined: "Joined class successfully", childLinked: "Child linked successfully",
    invalidCode: "Invalid code", alreadyLinked: "Already linked", openApp: "Open App",
  },
  ar: {
    rods: "قضبان الأعداد", frames: "الإطارات", dots: "أنماط النقاط",
    five: "إطار خماسي", ten: "إطار عشري",
    clear: "مسح", start: "ابدأ",
    sel: "تحديد", draw: "رسم", write: "كتابة", erase: "محو",
    undo: "تراجع", redo: "إعادة",
    labels: "تسميات", numline: "خط الأعداد",
    cover: "إخفاء", reveal: "كشف",
    note: "ملاحظة", save: "حفظ", load: "تحميل",
    png: "تصدير PNG", print: "طباعة",
    hint: "اختر قضيبًا من اللوحة الجانبية للبدء",
    trashY: "أفلت — حذف", trashN: "اسحب إلى هنا للحذف",
    nlDesc: "خط الأعداد",
    textPh: "اكتب نصًّا...",
    checkOk: "أحسنت! إجابة صحيحة!",
    checkNo: "ليس صحيحًا تمامًا. حاول مرة أخرى!",
    checkNone: "لا يوجد تحقق تلقائي لهذا النشاط.",
    speakBtn: "اقرأ التعليمات بصوت عالٍ",
    checkBtn: "تحقّق",
    keşif: "استكشاف", oyun: "ألعاب", sayma: "العدّ",
    işlem: "العمليات", tahmin: "التقدير",
    voiceOn: "الأوامر الصوتية مفعّلة", voiceOff: "الأوامر الصوتية معطّلة",
    teacherMode: "وضع المعلم", studentMode: "وضع الطالب",
    saveTpl: "حفظ القالب", progress: "التقدّم",
    material: "الأدوات", activity: "الأنشطة", custom: "مخصص",
    completed: "مكتمل",
    shortcuts: "اختصارات لوحة المفاتيح", voiceCommands: "الأوامر الصوتية",
    closeHint: "انقر في أي مكان للإغلاق",
    delete: "حذف", copy: "نسخ", countTTS: "عدّ بصوت عالٍ",
    read: "اقرأ", check: "تحقّق",
    about: "حول التطبيق",
    aboutSubtitle: "منصة تعلّم الرياضيات بقضبان الأعداد",
    aboutDescription: "دوكون ساي هو التطبيق الرقمي لمجموعة قضبان الأعداد DokunSay التي طوّرها الأستاذ الدكتور يلماز موتلو ومعلمة الرياضيات تشيدم دميرتاش. صُمّمت هذه المنصة التفاعلية لدعم الأطفال في تطوير الحسّ العددي والعمليات الحسابية الأساسية ومهارات التفكير الرياضي من خلال منهج تعليمي قائم على الأدوات المحسوسة.",
    aboutCreators: "التطوير",
    aboutRoleMutlu: "المستشار الأكاديمي والتصميم المفاهيمي",
    aboutNameDemirtas: "تشيدم دميرتاش",
    aboutRoleDemirtas: "التصميم التربوي وتطوير التطبيق",
    aboutMission: "يهدف دوكون ساي إلى مساعدة جميع المتعلمين — وخاصة الأطفال الذين يعانون من عسر الحساب وصعوبات تعلّم الرياضيات — على اكتشاف الرياضيات من خلال التجربة الحسّية والاستكشاف العملي.",
    ar3D: "عرض ثلاثي الأبعاد", arCamera: "الكاميرا AR", arRecognition: "كشف القضبان",
    arCameraPermission: "إذن الكاميرا مطلوب", arTapToPlace: "انقر للوضع",
    arDetecting: "أبحث عن قضبان... أمسك قضيبًا أمام الكاميرا", arRodsFound: "قضبان مكتشفة",
    arNoCamera: "الكاميرا غير متاحة",
    login: "تسجيل الدخول", signup: "إنشاء حساب", logout: "تسجيل الخروج",
    email: "البريد الإلكتروني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل", forgotPassword: "نسيت كلمة المرور؟", resetPassword: "إعادة تعيين كلمة المرور",
    sendResetLink: "إرسال رابط إعادة التعيين",
    noAccount: "ليس لديك حساب؟", hasAccount: "لديك حساب بالفعل؟",
    orContinueWith: "أو تابع باستخدام", google: "جوجل",
    roleTeacher: "معلم", roleStudent: "طالب", roleParent: "ولي أمر",
    selectRole: "اختر دورك",
    studentCodeLabel: "رمز الطالب", studentCodeHint: "شارك هذا الرمز مع ولي أمرك",
    childCodeLabel: "رمز الطالب (طفلك)", childCodeHint: "أدخل رمز طفلك",
    welcome: "أهلاً وسهلاً", dashboard: "لوحة التحكم",
    myClasses: "صفوفي", createClass: "إنشاء صف", joinClass: "الانضمام لصف",
    className: "اسم الصف", classCode: "رمز الصف", students: "الطلاب", noStudents: "لا يوجد طلاب بعد",
    linkChild: "ربط الطفل", childProgress: "تقدّم الطفل", noChildren: "لا يوجد أطفال مربوطون بعد",
    enterClassCode: "أدخل رمز الصف", enterChildCode: "أدخل رمز الطفل",
    join: "انضمام", create: "إنشاء", remove: "إزالة",
    back: "رجوع", profile: "الملف الشخصي", attempts: "محاولات",
    authErrorEmail: "بريد إلكتروني غير صالح", authErrorPassword: "كلمة مرور خاطئة",
    authErrorWeak: "يجب أن تكون كلمة المرور ٦ أحرف على الأقل", authErrorExists: "البريد الإلكتروني مسجّل بالفعل",
    authErrorInvalid: "بيانات اعتماد غير صالحة", authErrorNotFound: "الحساب غير موجود",
    authErrorGeneric: "حدث خطأ. حاول مرة أخرى.",
    resetSent: "تم إرسال رابط إعادة التعيين", classCreated: "تم إنشاء الصف",
    classJoined: "تم الانضمام للصف بنجاح", childLinked: "تم ربط الطفل بنجاح",
    invalidCode: "رمز غير صالح", alreadyLinked: "مربوط بالفعل", openApp: "افتح التطبيق",
  },
  fa: {
    rods: "میله‌های اعداد", frames: "قاب‌ها", dots: "الگوهای نقطه‌ای",
    five: "قاب پنج‌تایی", ten: "قاب ده‌تایی",
    clear: "پاک‌سازی", start: "شروع",
    sel: "انتخاب", draw: "رسم", write: "نوشتن", erase: "پاک کردن",
    undo: "واگرد", redo: "بازانجام",
    labels: "برچسب‌ها", numline: "خط اعداد",
    cover: "پوشاندن", reveal: "نمایش",
    note: "یادداشت", save: "ذخیره", load: "بارگذاری",
    png: "خروجی PNG", print: "چاپ",
    hint: "برای شروع، یک میله از پنل کناری انتخاب کنید",
    trashY: "رها کنید — حذف", trashN: "برای حذف به اینجا بکشید",
    nlDesc: "خط اعداد",
    textPh: "متن بنویسید...",
    checkOk: "آفرین! درست است!",
    checkNo: "هنوز کامل نیست. دوباره امتحان کن!",
    checkNone: "بررسی خودکار برای این فعالیت وجود ندارد.",
    speakBtn: "خواندن دستورالعمل با صدای بلند",
    checkBtn: "بررسی",
    keşif: "اکتشاف", oyun: "بازی‌ها", sayma: "شمارش",
    işlem: "عملیات", tahmin: "تخمین",
    voiceOn: "فرمان‌های صوتی فعال", voiceOff: "فرمان‌های صوتی غیرفعال",
    teacherMode: "حالت معلم", studentMode: "حالت دانش‌آموز",
    saveTpl: "ذخیره الگو", progress: "پیشرفت",
    material: "ابزارها", activity: "فعالیت‌ها", custom: "سفارشی",
    completed: "انجام شده",
    shortcuts: "میانبرهای صفحه‌کلید", voiceCommands: "فرمان‌های صوتی",
    closeHint: "برای بستن، هر جایی کلیک کنید",
    delete: "حذف", copy: "کپی", countTTS: "شمارش با صدا",
    read: "بخوان", check: "بررسی",
    about: "درباره",
    aboutSubtitle: "پلتفرم یادگیری ریاضی با میله‌های اعداد",
    aboutDescription: "دوکون‌سای نسخه دیجیتال مجموعه میله‌های اعداد DokunSay است که توسط پروفسور دکتر یلماز موتلو و معلم ریاضی چیدم دمیرتاش توسعه یافته است. این پلتفرم تعاملی با رویکرد آموزشی مبتنی بر ابزارهای دست‌ورزی عینی، برای حمایت از کودکان در توسعه درک عددی، عملیات حسابی پایه و مهارت‌های تفکر ریاضی طراحی شده است.",
    aboutCreators: "توسعه‌دهندگان",
    aboutRoleMutlu: "مشاور علمی و طراحی مفهومی",
    aboutNameDemirtas: "چیدم دمیرتاش",
    aboutRoleDemirtas: "طراحی آموزشی و توسعه کاربرد",
    aboutMission: "دوکون‌سای هدف دارد به همه یادگیرندگان — به‌ویژه کودکانی که با اختلال محاسبه و مشکلات یادگیری ریاضی مواجه‌اند — کمک کند تا ریاضی را از طریق تجربه عینی و اکتشاف عملی کشف کنند.",
    ar3D: "نمای سه‌بعدی", arCamera: "دوربین AR", arRecognition: "شناسایی میله",
    arCameraPermission: "دسترسی دوربین لازم است", arTapToPlace: "برای قرار دادن لمس کنید",
    arDetecting: "در حال جستجوی میله... یک میله جلوی دوربین بگیرید", arRodsFound: "میله پیدا شد",
    arNoCamera: "دوربین در دسترس نیست",
    login: "ورود", signup: "ثبت‌نام", logout: "خروج",
    email: "ایمیل", password: "رمز عبور", confirmPassword: "تکرار رمز عبور",
    fullName: "نام کامل", forgotPassword: "رمز عبور را فراموش کردید؟", resetPassword: "بازنشانی رمز عبور",
    sendResetLink: "ارسال لینک بازنشانی",
    noAccount: "حساب کاربری ندارید؟", hasAccount: "قبلاً حساب دارید؟",
    orContinueWith: "یا ادامه با", google: "گوگل",
    roleTeacher: "معلم", roleStudent: "دانش‌آموز", roleParent: "والدین",
    selectRole: "نقش خود را انتخاب کنید",
    studentCodeLabel: "کد دانش‌آموزی شما", studentCodeHint: "این کد را با والدین خود به اشتراک بگذارید",
    childCodeLabel: "کد دانش‌آموزی فرزند", childCodeHint: "کد فرزندتان را وارد کنید",
    welcome: "خوش آمدید", dashboard: "داشبورد",
    myClasses: "کلاس‌های من", createClass: "ایجاد کلاس", joinClass: "پیوستن به کلاس",
    className: "نام کلاس", classCode: "کد کلاس", students: "دانش‌آموزان", noStudents: "هنوز دانش‌آموزی نیست",
    linkChild: "اتصال فرزند", childProgress: "پیشرفت فرزند", noChildren: "هنوز فرزند متصلی نیست",
    enterClassCode: "کد کلاس را وارد کنید", enterChildCode: "کد فرزند را وارد کنید",
    join: "پیوستن", create: "ایجاد", remove: "حذف",
    back: "بازگشت", profile: "پروفایل", attempts: "تلاش",
    authErrorEmail: "آدرس ایمیل نامعتبر", authErrorPassword: "رمز عبور اشتباه",
    authErrorWeak: "رمز عبور باید حداقل ۶ کاراکتر باشد", authErrorExists: "این ایمیل قبلاً ثبت شده",
    authErrorInvalid: "اطلاعات نامعتبر", authErrorNotFound: "حساب یافت نشد",
    authErrorGeneric: "خطایی رخ داد. دوباره امتحان کنید.",
    resetSent: "لینک بازنشانی ارسال شد", classCreated: "کلاس ایجاد شد",
    classJoined: "با موفقیت به کلاس پیوستید", childLinked: "فرزند با موفقیت متصل شد",
    invalidCode: "کد نامعتبر", alreadyLinked: "قبلاً متصل شده", openApp: "باز کردن برنامه",
  },
};

export function translate(key: string, lang: Language): string {
  const dict = TRANSLATIONS[lang];
  if (dict && key in dict) return dict[key as TranslationKey];
  const fallback = TRANSLATIONS.tr;
  if (key in fallback) return fallback[key as TranslationKey];
  return key;
}

/** All supported languages in display order */
export const SUPPORTED_LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "tr", label: "TR", nativeLabel: "Türkçe" },
  { code: "ku", label: "KU", nativeLabel: "Kurdî" },
  { code: "en", label: "EN", nativeLabel: "English" },
  { code: "ar", label: "AR", nativeLabel: "العربية" },
  { code: "fa", label: "FA", nativeLabel: "فارسی" },
];

/** Get the next language in the cycle */
export function getNextLanguage(current: Language): Language {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const idx = codes.indexOf(current);
  return codes[(idx + 1) % codes.length];
}

/** Whether the language uses RTL direction */
export function isRTL(lang: Language): boolean {
  return lang === "ar" || lang === "fa";
}

/** Get template name for the given language */
export function getTemplateName(tpl: Template, lang: Language): string {
  switch (lang) {
    case "ku": return tpl.k || tpl.n;
    case "en": return tpl.en || tpl.n;
    case "ar": return tpl.ar || tpl.n;
    case "fa": return tpl.fa || tpl.n;
    default: return tpl.n;
  }
}

/** Get template description for the given language */
export function getTemplateDesc(tpl: Template, lang: Language): string {
  switch (lang) {
    case "ku": return tpl.dk || tpl.d;
    case "en": return tpl.den || tpl.d;
    case "ar": return tpl.dar || tpl.d;
    case "fa": return tpl.dfa || tpl.d;
    default: return tpl.d;
  }
}

/** Display word for the number 3 in the logo */
export function getThreeWord(lang: Language): string {
  const words: Record<Language, string> = {
    tr: "üç", ku: "sê", en: "three", ar: "ثلاثة", fa: "سه",
  };
  return words[lang];
}
