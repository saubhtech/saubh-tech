import type { Metadata } from 'next';
import { localeToLang } from '@/lib/i18n/locale-map';
import { getCanonicalUrl, getHreflangLinks } from './hreflang';

/**
 * Generate locale-aware metadata for any page.
 * Uses translation keys to provide localized titles and descriptions.
 * 
 * Usage in any page:
 *   export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 *     const { locale } = await params;
 *     return getLocaleMetadata(locale, '/login', {
 *       titleKey: 'Login — Saubh.Tech',  // fallback if no translation
 *       descriptionKey: 'Sign in to your account',
 *     });
 *   }
 */

// SEO titles and descriptions per locale (for homepage and common pages)
// These are hardcoded for SEO quality — auto-translated SEO text is often poor
const SEO_DATA: Record<string, { title: string; description: string }> = {
  'en-in': {
    title: 'Saubh.Tech — Phygital Gig Marketplace | UGC & Branding Platform',
    description: 'Connect with verified individuals and businesses for secure gig work, UGC content creation, and digital branding. Escrow-protected payments.',
  },
  'hi-in': {
    title: 'Saubh.Tech — फिजिटल गिग मार्केटप्लेस | UGC और ब्रांडिंग प्लेटफॉर्म',
    description: 'सुरक्षित गिग वर्क, UGC कंटेंट क्रिएशन और डिजिटल ब्रांडिंग के लिए सत्यापित व्यक्तियों और व्यवसायों से जुड़ें।',
  },
  'bn-in': {
    title: 'Saubh.Tech — ফিজিটাল গিগ মার্কেটপ্লেস | UGC ও ব্র্যান্ডিং প্ল্যাটফর্ম',
    description: 'নিরাপদ গিগ কাজ, UGC কন্টেন্ট তৈরি এবং ডিজিটাল ব্র্যান্ডিংয়ের জন্য যাচাইকৃত ব্যক্তি ও ব্যবসায়ের সাথে সংযুক্ত হন।',
  },
  'ta-in': {
    title: 'Saubh.Tech — பிசிட்டல் கிக் சந்தை | UGC மற்றும் பிராண்டிங் தளம்',
    description: 'பாதுகாப்பான கிக் வேலை, UGC உள்ளடக்க உருவாக்கம் மற்றும் டிஜிட்டல் பிராண்டிங்கிற்காக சரிபார்க்கப்பட்ட நபர்களுடன் இணையுங்கள்.',
  },
  'te-in': {
    title: 'Saubh.Tech — ఫిజిటల్ గిగ్ మార్కెట్‌ప్లేస్ | UGC & బ్రాండింగ్ ప్లాట్‌ఫారమ్',
    description: 'సురక్షిత గిగ్ పని, UGC కంటెంట్ సృష్టి మరియు డిజిటల్ బ్రాండింగ్ కోసం ధృవీకరించబడిన వ్యక్తులతో కనెక్ట్ అవ్వండి.',
  },
  'mr-in': {
    title: 'Saubh.Tech — फिजिटल गिग मार्केटप्लेस | UGC आणि ब्रँडिंग प्लॅटफॉर्म',
    description: 'सुरक्षित गिग काम, UGC कंटेंट निर्मिती आणि डिजिटल ब्रँडिंगसाठी सत्यापित व्यक्ती आणि व्यवसायांशी कनेक्ट व्हा.',
  },
  'ur-in': {
    title: 'Saubh.Tech — فزیٹل گگ مارکیٹ پلیس | UGC اور برانڈنگ پلیٹ فارم',
    description: 'محفوظ گگ کام، UGC مواد کی تخلیق اور ڈیجیٹل برانڈنگ کے لیے تصدیق شدہ افراد اور کاروباروں سے جڑیں۔',
  },
};

export function getLocaleMetadata(
  locale: string,
  path: string = '',
  fallback?: { titleKey?: string; descriptionKey?: string }
): Metadata {
  const lang = localeToLang(locale);
  const seo = SEO_DATA[locale];
  const hreflangLinks = getHreflangLinks(path);
  const canonical = getCanonicalUrl(locale, path);

  return {
    title: seo?.title || fallback?.titleKey || 'Saubh.Tech',
    description: seo?.description || fallback?.descriptionKey || 'Phygital Gig Marketplace',
    alternates: {
      canonical,
      languages: Object.fromEntries(
        hreflangLinks.map(({ locale: loc, url }) => [loc, url])
      ),
    },
    openGraph: {
      title: seo?.title || fallback?.titleKey || 'Saubh.Tech',
      description: seo?.description || fallback?.descriptionKey || '',
      url: canonical,
      siteName: 'Saubh.Tech',
      type: 'website',
      locale: locale.replace('-', '_'),
    },
    other: {
      'content-language': lang,
    },
  };
}

export { SEO_DATA };
