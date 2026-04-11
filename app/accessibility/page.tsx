import Link from 'next/link';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f0f2f5] pt-32 pb-20 px-6" dir="rtl">
      <div className="max-w-3xl mx-auto bg-[#1a1d24] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl space-y-6">
        <Link href="/" className="text-[#ff4b2b] text-sm font-bold hover:underline mb-8 inline-block">
          &rarr; חזרה לעמוד הבית
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#ff4b2b]">הצהרת נגישות</h1>
        
        <p className="text-sm opacity-80 leading-relaxed text-justify">
          אנו ב-MISTORSUSH רואים חשיבות עליונה בהענקת שירות שוויוני, נגיש ומכבד לכלל הלקוחות, לרבות אנשים עם מוגבלויות.
          השקענו מאמצים רבים להנגשת אתר האינטרנט שלנו כדי לאפשר גלישה בקלות ובנוחות.
        </p>

        <h2 className="text-xl font-bold mt-8 text-white">מידע על הנגישות באתר</h2>
        <ul className="list-disc list-inside text-sm opacity-80 space-y-2 leading-relaxed">
          <li>האתר כולל תפריט הנגשה מיוחד (כפתור בתחתית/צד המסך) המאפשר:</li>
          <li>שינוי גודל גופן והגדלת הטקסט.</li>
          <li>שינוי ניגודיות צבעים (מצב כהה, מונוכרום, הצהוב-שחור ועוד).</li>
          <li>ביטול אנימציות והבהובים לעצירת חומרים נעים.</li>
          <li>הקראת טקסט (לרבות תמיכה במסכים מסוימים).</li>
          <li>הדגשת קישורים כדי להקל על הניווט.</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 text-white">שימוש בתוכנות עזר</h2>
        <p className="text-sm opacity-80 leading-relaxed text-justify">
          האתר נבנה בצורה המאפשרת תמיכה מינימלית בתקינה הנדרשת (WCAG 2.0 ברמת AA) בעזרת כלי הנגישות המוטמע באתר. למרות מאמצינו להנגיש את כלל הדפים באתר, ייתכן שיתגלו חלקים שטרם הונגשו במלואם.
        </p>

        <h2 className="text-xl font-bold mt-8 text-white">פניות בנושא נגישות</h2>
        <p className="text-sm opacity-80 leading-relaxed text-justify">
          אנו ממשיכים במאמצים לשפר את נגישות האתר כחלק ממחויבותנו לאפשר שימוש בו עבור כלל האוכלוסייה. אם נתקלת בבעיה או בתקלה כלשהי בנושא נגישות, נשמח שתדווח/י לנו כדי שנוכל לתקן זאת בהקדם:
        </p>
        
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 inline-block w-full">
          <strong>פרטי רכז הנגישות:</strong>
          <br/>
          שם (יש להשלים בעסק): [שם רכז הנגישות]
          <br/>
          טלפון: [מספר הטלפון שלכם]
          <br/>
          דוא"ל פניות: [כתובת האימייל שלכם]
        </div>

        <p className="text-xs opacity-50 mt-12 text-center">
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')} (טקסט זה הינו תבנית בסיסית ומומלץ להתייעץ עם יועץ נגישות כדי להיות מבוטח טכנית כחוק)
        </p>
      </div>
    </div>
  );
}
