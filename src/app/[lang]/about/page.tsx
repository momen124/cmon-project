'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { SparklesIcon, ShieldCheckIcon, HeartIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  const { t } = useTranslation();
  const { language } = useStore();
  const isRTL = language === 'ar';

  const storyContent = {
    en: {
      subtitle: "Four Decades of Pure Luxury",
      title: "The Legacy of Cmon Elsonon",
      intro: "Crafted with love, patience, and 40+ years of textile heritage. We bring the unmatched softness of authentic, hand-picked Egyptian cotton directly from the Nile Delta fields to your bedroom.",
      ourVisionTitle: "Our Vision",
      ourVisionText: "To redefine the sleep experience through natural comfort. We believe your bed is a sanctuary, and every night should feel like a stay at a five-star luxury hotel.",
      ourMissionTitle: "Our Mission",
      ourMissionText: "To preserve traditional Egyptian weaving techniques while incorporating modern sustainable practices. We are dedicated to providing ethical, premium-quality cotton linens that last a lifetime.",
      stat1Number: "40+",
      stat1Label: "Years of Heritage",
      stat2Number: "100%",
      stat2Label: "Pure Egyptian Cotton",
      stat3Number: "50k+",
      stat3Label: "Happy Sleepers",
      value1Title: "Uncompromising Quality",
      value1Desc: "Every single thread is inspected. We only use extra-long-staple cotton for durability and buttery softness.",
      value2Title: "Heritage Craftsmanship",
      value2Desc: "Crafted by master weavers in Egypt who carry generations of artisanal expertise in their hands.",
      value3Title: "Direct to Bedroom",
      value3Desc: "By cutting out the middlemen, we bring luxury bedding to your home at a fair and transparent price.",
      timelineTitle: "Our Journey",
      timeline1Date: "1985",
      timeline1Title: "The First Loom",
      timeline1Desc: "Established our first workshop in the Nile Delta, weaving custom linens for local communities.",
      timeline2Date: "2005",
      timeline2Title: "Hotel Partnership",
      timeline2Desc: "Became the trusted supplier of premium linens for elite luxury hotels across the Mediterranean.",
      timeline3Date: "2025",
      timeline3Title: "Cmon Elsonon Online",
      timeline3Desc: "Launched our digital storefront to bring premium Egyptian cotton bedding directly to your home.",
      ctaTitle: "Experience the Difference Yourself",
      ctaDesc: "Explore our collection of bedsheets, duvets, and towels today.",
      ctaBtn: "Shop the Collection"
    },
    ar: {
      subtitle: "أربعة عقود من الفخامة النقية",
      title: "إرث سي مون السونون",
      intro: "صنع بكل حب وصبر وخبرة تزيد عن ٤٠ عاماً في مجال المنسوجات. نقدم لك النعومة التي لا تضاهى للقطن المصري الأصيل المقطوف يدوياً مباشرةً من حقول دلتا النيل إلى غرفة نومك.",
      ourVisionTitle: "رؤيتنا",
      ourVisionText: "إعادة تعريف تجربة النوم من خلال الراحة الطبيعية. نؤمن بأن سريرك هو ملاذك الخاص، ويجب أن تشعر كل ليلة وكأنك تقيم في فندق خمس نجوم فاخر.",
      ourMissionTitle: "مهمتنا",
      ourMissionText: "الحفاظ على تقنيات النسيج المصرية التقليدية مع دمج الممارسات الحديثة المستدامة. نحن ملتزمون بتقديم بياضات قطنية فاخرة وأخلاقية تدوم مدى الحياة.",
      stat1Number: "+٤٠",
      stat1Label: "عاماً من الإرث العريق",
      stat2Number: "١٠٠٪",
      stat2Label: "قطن مصري خالص",
      stat3Number: "+٥٠ ألف",
      stat3Label: "عميل سعيد",
      value1Title: "جودة لا تهاون فيها",
      value1Desc: "يتم فحص كل خيط على حدة. نستخدم فقط القطن طويل التيلة لضمان المتانة والنعومة الفائقة.",
      value2Title: "حرفية متوارثة",
      value2Desc: "تم تصنيعها بأيدي كبار النساجين في مصر الذين يحملون أجيالاً من الخبرة الحرفية.",
      value3Title: "من المصنع إلى غرفة نومك",
      value3Desc: "من خلال إلغاء الوسطاء، نقدم بياضات فاخرة لمنزلك بأسعار عادلة وشفافة.",
      timelineTitle: "رحلتنا عبر الزمن",
      timeline1Date: "١٩٨٥",
      timeline1Title: "النول الأول",
      timeline1Desc: "تأسيس أول ورشة عمل لنا في دلتا النيل، لنسج البياضات المخصصة للمجتمعات المحلية.",
      timeline2Date: "٢٠٠٥",
      timeline2Title: "شراكة الفنادق",
      timeline2Desc: "أصبحنا المورد المعتمد للبياضات الفاخرة للفنادق الراقية في جميع أنحاء البحر الأبيض المتوسط.",
      timeline3Date: "٢٠٢٥",
      timeline3Title: "سي مون السونون الرقمي",
      timeline3Desc: "إطلاق متجرنا الإلكتروني لنقل أغطية السرير المصنوعة من القطن المصري الفاخر مباشرةً إلى منزلك.",
      ctaTitle: "اختبر الفرق بنفسك الآن",
      ctaDesc: "تصفح مجموعتنا الفريدة من ملاءات السرير، الألحفة، والمناشف الفاخرة اليوم.",
      ctaBtn: "تسوق المجموعة الآن"
    }
  };

  const content = isRTL ? storyContent.ar : storyContent.en;

  return (
    <div className={`min-h-screen bg-[var(--background-color)] text-[var(--text-color)] overflow-hidden font-english pb-16`}>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-900/10 via-background to-secondary-100/35 border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 text-center max-w-4xl animate-slide-up">
          <span className="text-sm font-semibold tracking-wider text-primary-600 uppercase mb-3 block">
            {content.subtitle}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent dark:from-white dark:to-neutral-300">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-[var(--secondary-text-color)] leading-relaxed max-w-3xl mx-auto">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--card-bg-color)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2 font-english">{content.stat1Number}</div>
              <div className="text-sm uppercase tracking-wider text-[var(--secondary-text-color)] font-medium">{content.stat1Label}</div>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-[var(--border-color)]">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2 font-english">{content.stat2Number}</div>
              <div className="text-sm uppercase tracking-wider text-[var(--secondary-text-color)] font-medium">{content.stat2Label}</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2 font-english">{content.stat3Number}</div>
              <div className="text-sm uppercase tracking-wider text-[var(--secondary-text-color)] font-medium">{content.stat3Label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[var(--card-bg-color)] p-8 rounded-2xl border border-[var(--border-color)] hover:shadow-lg transition-shadow duration-350">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mb-6 text-primary-600">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)]">{content.ourVisionTitle}</h3>
              <p className="text-[var(--secondary-text-color)] leading-relaxed">{content.ourVisionText}</p>
            </div>
            <div className="bg-[var(--card-bg-color)] p-8 rounded-2xl border border-[var(--border-color)] hover:shadow-lg transition-shadow duration-350">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mb-6 text-primary-600">
                <GlobeAsiaAustraliaIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)]">{content.ourMissionTitle}</h3>
              <p className="text-[var(--secondary-text-color)] leading-relaxed">{content.ourMissionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary-50/50 dark:bg-secondary-950/10 border-y border-[var(--border-color)]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-[var(--text-color)]">{isRTL ? "قيمنا الأساسية" : "Our Core Values"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-primary-600"><ShieldCheckIcon className="w-8 h-8" /></div>
              <h4 className="text-xl font-bold text-[var(--text-color)]">{content.value1Title}</h4>
              <p className="text-[var(--secondary-text-color)] leading-relaxed text-sm">{content.value1Desc}</p>
            </div>
            <div className="space-y-4">
              <div className="text-primary-600"><SparklesIcon className="w-8 h-8" /></div>
              <h4 className="text-xl font-bold text-[var(--text-color)]">{content.value2Title}</h4>
              <p className="text-[var(--secondary-text-color)] leading-relaxed text-sm">{content.value2Desc}</p>
            </div>
            <div className="space-y-4">
              <div className="text-primary-600"><HeartIcon className="w-8 h-8" /></div>
              <h4 className="text-xl font-bold text-[var(--text-color)]">{content.value3Title}</h4>
              <p className="text-[var(--secondary-text-color)] leading-relaxed text-sm">{content.value3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-[var(--text-color)]">{content.timelineTitle}</h2>
          <div className="relative border-l-2 border-[var(--border-color)] ml-4 md:ml-32 space-y-12">
            {/* Timeline Item 1 */}
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-600 border-4 border-[var(--background-color)]" />
              <div className="absolute left-[-110px] top-1 text-lg font-bold text-primary-600 hidden md:block font-english">
                {content.timeline1Date}
              </div>
              <div className="bg-[var(--card-bg-color)] p-6 rounded-xl border border-[var(--border-color)]">
                <span className="text-sm font-bold text-primary-600 md:hidden block mb-1 font-english">{content.timeline1Date}</span>
                <h4 className="text-xl font-bold text-[var(--text-color)] mb-2">{content.timeline1Title}</h4>
                <p className="text-[var(--secondary-text-color)] text-sm leading-relaxed">{content.timeline1Desc}</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-600 border-4 border-[var(--background-color)]" />
              <div className="absolute left-[-110px] top-1 text-lg font-bold text-primary-600 hidden md:block font-english">
                {content.timeline2Date}
              </div>
              <div className="bg-[var(--card-bg-color)] p-6 rounded-xl border border-[var(--border-color)]">
                <span className="text-sm font-bold text-primary-600 md:hidden block mb-1 font-english">{content.timeline2Date}</span>
                <h4 className="text-xl font-bold text-[var(--text-color)] mb-2">{content.timeline2Title}</h4>
                <p className="text-[var(--secondary-text-color)] text-sm leading-relaxed">{content.timeline2Desc}</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-600 border-4 border-[var(--background-color)]" />
              <div className="absolute left-[-110px] top-1 text-lg font-bold text-primary-600 hidden md:block font-english">
                {content.timeline3Date}
              </div>
              <div className="bg-[var(--card-bg-color)] p-6 rounded-xl border border-[var(--border-color)]">
                <span className="text-sm font-bold text-primary-600 md:hidden block mb-1 font-english">{content.timeline3Date}</span>
                <h4 className="text-xl font-bold text-[var(--text-color)] mb-2">{content.timeline3Title}</h4>
                <p className="text-[var(--secondary-text-color)] text-sm leading-relaxed">{content.timeline3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-2xl max-w-5xl mx-auto px-6 text-center shadow-xl">
        <h3 className="text-3xl font-bold mb-4">{content.ctaTitle}</h3>
        <p className="text-primary-100 max-w-2xl mx-auto mb-8 text-base">
          {content.ctaDesc}
        </p>
        <Link 
          href={`/${language}/shop`}
          className="inline-block bg-white text-primary-950 font-bold px-8 py-4 rounded-xl hover:bg-neutral-100 transition-colors shadow-md hover-lift"
        >
          {content.ctaBtn}
        </Link>
      </section>
    </div>
  );
}
