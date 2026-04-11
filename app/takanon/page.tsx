import Link from 'next/link';

export default function TakanonPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f0f2f5] pt-32 pb-20 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto bg-[#1a1d24] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-6">
        <Link href="/" className="text-[#ff4b2b] text-sm font-bold hover:underline mb-8 inline-block">
          &rarr; חזרה לעמוד הבית
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#ff4b2b]">תקנון ותנאי שימוש באתר</h1>
        
        <p className="text-sm opacity-80 leading-relaxed">
          ברוכים הבאים לאתר המשלוחים של MISTORSUSH (להלן: "העסק"). האתר משמש כפלטפורמה להזמנת אוכל ומשלוחים.
        </p>

        <h2 className="text-xl font-bold mt-8 text-white">1. כללי</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>השימוש באתר, לרבות רכישת מוצרים, כפוף להסכמתך לתנאי תקנון זה.</li>
          <li>כל המחירים המופיעים באתר כוללים מע"מ כחוק.</li>
          <li>התמונות באתר להמחשה בלבד. ייתכנו הבדלים קלים בין התמונה למנה בפועל.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">2. ביצוע הזמנות ותשלום</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>ניתן לבצע הזמנות לטייק-אוויי או למשלוח באזורי החלוקה המוגדרים.</li>
          <li>הזמנה תחשב כמושלמת רק לאחר אישור העסק. במקרה של חוסר במלאי, העסק ייצור קשר עם הלקוח.</li>
          {/* Note for developer: If you add credit card processing, uncomment the below */}
          {/* <li>פרטי כרטיס האשראי אינם נשמרים במערכת והתשלום מתבצע דרך עמוד סליקה מאובטח ומוצפן בתקן PCI-DSS.</li> */}
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">3. מדיניות ביטולים</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>על פי חוק הגנת הצרכן (תשמ"א-1981), לא ניתן לבטל הזמנת "טובין פסידים" (מזון) לאחר שהחלה הכנתם.</li>
          <li>ביטול הזמנה יתאפשר רק במידה והמסעדה טרם התחילה להכין את המנות, ובתיאום טלפוני בלבד.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">4. רגישויות ואלרגיות</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>אנו עושים את מירב המאמצים למנוע זליגת אלרגנים, אך לא ניתן להבטיח סביבה נקייה ב-100% (לרבות גלוטן, בוטנים, שומשום, וכו').</li>
          <li>במידה ויש רגישות חמורה, חובה לציין זאת מפורשות בטלפון ולא להסתמך על ההערות באתר.</li>
        </ul>

        <p className="text-xs opacity-50 mt-12 text-center">
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} (טקסט זה הינו תבנית בסיסית ומומלץ להתייעץ עם עו"ד)
        </p>
      </div>
    </div>
  );
}
