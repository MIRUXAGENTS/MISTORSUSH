import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f0f2f5] pt-32 pb-20 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto bg-[#1a1d24] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-6">
        <Link href="/" className="text-[#ff4b2b] text-sm font-bold hover:underline mb-8 inline-block">
          &rarr; חזרה לעמוד הבית
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#ff4b2b]">מדיניות פרטיות</h1>
        
        <p className="text-sm opacity-80 leading-relaxed">
          פרטיותך חשובה לנו. מדיניות פרטיות זו מפרטת כיצד MISTORSUSH אוספים, משתמשים ושומרים על המידע האישי שלך במסגרת השימוש באתר.
        </p>

        <h2 className="text-xl font-bold mt-8 text-white">1. איסוף מידע</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>אנו אוספים מידע אישי בעת ביצוע הזמנה: שם מלא, טלפון, וכתובת למשלוח (הנדרשים לשם אספקת המזון).</li>
          <li>המערכת שומרת את היסטוריית ההזמנות של המשתמשים הרשומים לטובת נוחות עתידית.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">2. שימוש במידע ושמירתו</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>אנו לא מעבירים או מוכרים את המידע האישי שלך לצדדים שלישיים לצרכי פרסום.</li>
          <li>המידע משמש אך ורק לניהול ההזמנה, שירות לקוחות ושיפור חוויית הלקוח באתר.</li>
          <li>המידע מאוחסן בשרתים מאובטחים תחת תקני אבטחה מחמירים.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">3. קבצי עוגיות (Cookies)</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>האתר משתמש ב"עוגיות" (Cookies) ובאחסון מקומי (Local Storage) לצורך תפקודו התקין - כגון שמירת הגדרות הנגישות שלך ושמירת החיבור לחשבונך.</li>
          <li>שימוש זה הינו פונקציונלי בלבד ונועד לאפשר לך חווית שימוש רציפה.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">4. דיוור שיווקי (SMS/דוא"ל)</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>על פי חוק התקשורת ("חוק הספאם"), לא נישלח אליך חומר פרסומי ללא הסכמתך המפורשת. מובהר כי הודעות תפעוליות (כגון אישור הזמנה) אינן מהוות "דבר פרסומת".</li>
        </ul>

        <p className="text-xs opacity-50 mt-12 text-center">
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} (טקסט זה הינו תבנית בסיסית ומומלץ להתייעץ עם עו"ד)
        </p>
      </div>
    </div>
  );
}
