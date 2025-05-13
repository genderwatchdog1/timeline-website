/**
 * structured-data.js
 * Contains JSON-LD structured data for SEO across all language versions
 */

// Create and inject the JSON-LD structured data into the page
function injectStructuredData() {
  // Determine if we're on a blog post page or a timeline page
  const isBlogPost = window.location.pathname.includes('/blog_posts/');
  
  // Get the language from the HTML lang attribute or from the URL path
  let language = document.documentElement.lang || 'en';
  
  if (isBlogPost) {
    // For blog posts, extract language from URL structure: /blog_posts/en/...
    const pathParts = window.location.pathname.split('/');
    const langIndex = pathParts.indexOf('blog_posts') + 1;
    if (langIndex < pathParts.length) {
      language = pathParts[langIndex];
    }
    
    // For zh_ch and zh_tw, convert to proper format
    if (language === 'zh_ch') language = 'zh-CN';
    if (language === 'zh_tw') language = 'zh-TW';
    
    // Inject blog post specific structured data
    injectBlogPostStructuredData(language);
  } else {
    // For timeline pages
    if (window.location.pathname.includes('_zh_cn')) language = 'zh-CN';
    if (window.location.pathname.includes('_zh_tw')) language = 'zh-TW';
    if (window.location.pathname.includes('_ko')) language = 'ko';
    if (window.location.pathname.includes('_ja')) language = 'ja';
    
    // Inject timeline structured data
    injectTimelineStructuredData(language);
    
    // Also inject blog posts collection structured data on timeline pages
    injectBlogPostsStructuredData(language);
  }
}

// Inject structured data for a single blog post
function injectBlogPostStructuredData(language) {
  // Extract blog post data from the page
  const title = document.title || '';
  const description = document.querySelector('meta[name="description"]')?.content || '';
  const datePublished = document.querySelector('time')?.getAttribute('datetime') || '2025-04-01';
  const url = window.location.href;
  
  const blogPostStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "inLanguage": getLanguageCode(language),
    "datePublished": datePublished,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": "Gender Watchdog"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gender Watchdog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://genderwatchdog.org/imgs/gender-watchdog-icon-04142025.png"
      }
    }
  };
  
  injectJSONLD(blogPostStructuredData, 'blog-post-structured-data');
}

// Inject structured data for the timeline
function injectTimelineStructuredData(language) {
  const timelineEvents = getTimelineEvents(language);
  
  const timelineStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": getTimelineTitle(language),
    "description": getTimelineDescription(language),
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": timelineEvents.length,
    "itemListElement": timelineEvents.map((event, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": event.name,
        "description": event.description,
        "startDate": event.date,
        "location": {
          "@type": "Place",
          "name": "Dongguk University, Seoul, South Korea"
        }
      }
    }))
  };
  
  injectJSONLD(timelineStructuredData, 'timeline-structured-data');
}

// Inject structured data for blog posts
function injectBlogPostsStructuredData(language) {
  const blogPosts = getBlogPosts(language);
  
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": getBlogCollectionTitle(language),
    "description": getBlogCollectionDescription(language),
    "inLanguage": getLanguageCode(language),
    "mainEntity": {
      "@type": "ItemList",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": blogPosts.length,
      "itemListElement": blogPosts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "headline": post.title,
          "description": post.description,
          "inLanguage": getLanguageCode(language),
          "datePublished": post.datePublished,
          "url": post.url,
          "author": {
            "@type": "Organization",
            "name": "Gender Watchdog"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Gender Watchdog",
            "logo": {
              "@type": "ImageObject",
              "url": "https://genderwatchdog.org/imgs/gender-watchdog-icon-04142025.png"
            }
          }
        }
      }))
    }
  };
  
  injectJSONLD(blogStructuredData, 'blog-structured-data');
}

// Helper function to insert JSON-LD into the page
function injectJSONLD(structuredData, id) {
  // Remove existing script if any
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }
  
  // Create and append the new script element
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Helper function to get timeline title based on language
function getTimelineTitle(language) {
  const titles = {
    'en': 'Timeline of Sexual Violence Cases at Dongguk University (2016-2025)',
    'ja': '東国大学における性暴力事件の時系列（2016年～2025年）',
    'ko': '동국대학교 성폭력 사건 타임라인 (2016-2025)',
    'zh-CN': '东国大学性暴力案件时间线（2016-2025）',
    'zh-TW': '東國大學性暴力案件時間線（2016-2025）'
  };
  return titles[language] || titles['en'];
}

// Helper function to get timeline description based on language
function getTimelineDescription(language) {
  const descriptions = {
    'en': 'Documented cases of sexual violence and institutional negligence at Dongguk University between 2016 and 2025',
    'ja': '2016年から2025年の間の東国大学における性暴力と組織的怠慢の記録されたケース',
    'ko': '2016년부터 2025년까지 동국대학교에서 발생한 성폭력 및 기관 방치 사례 기록',
    'zh-CN': '2016年至2025年间记录的东国大学性暴力和机构疏忽案件',
    'zh-TW': '2016年至2025年間記錄的東國大學性暴力和機構疏忽案件'
  };
  return descriptions[language] || descriptions['en'];
}

// Helper function to get blog collection title based on language
function getBlogCollectionTitle(language) {
  const titles = {
    'en': 'Articles on Sexual Violence at Dongguk University',
    'ja': '東国大学での性暴力に関する記事',
    'ko': '동국대학교 성폭력에 관한 기사',
    'zh-CN': '关于东国大学性暴力的文章',
    'zh-TW': '關於東國大學性暴力的文章'
  };
  return titles[language] || titles['en'];
}

// Helper function to get blog collection description based on language
function getBlogCollectionDescription(language) {
  const descriptions = {
    'en': 'Collection of articles documenting sexual violence cases and institutional negligence at Dongguk University',
    'ja': '東国大学における性暴力事件と組織的怠慢を記録した記事のコレクション',
    'ko': '동국대학교의 성폭력 사례와 기관 방치를 기록한 기사 모음',
    'zh-CN': '记录东国大学性暴力案件和机构疏忽的文章集',
    'zh-TW': '記錄東國大學性暴力案件和機構疏忽的文章集'
  };
  return descriptions[language] || descriptions['en'];
}

// Helper function to get appropriate language code
function getLanguageCode(language) {
  const languageCodes = {
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW'
  };
  return languageCodes[language] || 'en-US';
}

// Define timeline events based on language
function getTimelineEvents(language) {
  // These would be dynamically generated from the timeline data in the actual implementation
  // Just showing sample data for the English version
  if (language === 'en') {
    return [
      {
        name: "Professor's Sexual Assault of Student Exposed",
        description: "A Dongguk University professor's sexual assault of a female student is exposed through media reports",
        date: "2016-03-15"
      },
      {
        name: "Student Protests Against Sexual Violence",
        description: "Students organize protests demanding stronger measures against sexual violence on campus",
        date: "2016-04-10"
      },
      {
        name: "Institutional Response to Sexual Violence Criticized",
        description: "University's handling of sexual violence cases criticized for inadequate response and victim protection",
        date: "2024-12-15"
      }
    ];
  } else if (language === 'ja') {
    return [
      {
        name: "教授による学生への性暴力が発覚",
        description: "東国大学教授による女子学生への性暴力がメディア報道により発覚",
        date: "2016-03-15"
      },
      {
        name: "性暴力に対する学生抗議活動",
        description: "学生たちがキャンパス内の性暴力に対するより強力な対策を求めて抗議活動を組織",
        date: "2016-04-10"
      },
      {
        name: "性暴力に対する大学の対応が批判される",
        description: "不十分な対応と被害者保護のため、性暴力事件への大学の対応が批判される",
        date: "2024-12-15"
      }
    ];
  } else if (language === 'ko') {
    return [
      {
        name: "교수의 학생 성폭력 사건 폭로",
        description: "동국대학교 교수의 여학생 성폭력 사건이 언론 보도를 통해 폭로됨",
        date: "2016-03-15"
      },
      {
        name: "성폭력에 대한 학생 시위",
        description: "학생들이 캠퍼스 내 성폭력에 대한 더 강력한 조치를 요구하며 시위를 조직",
        date: "2016-04-10"
      },
      {
        name: "성폭력에 대한 대학의 대응 비판",
        description: "불충분한 대응과 피해자 보호로 인해 성폭력 사건에 대한 대학의 대응이 비판을 받음",
        date: "2024-12-15"
      }
    ];
  } else if (language === 'zh-CN') {
    return [
      {
        name: "教授性侵学生事件曝光",
        description: "东国大学教授性侵女学生的事件通过媒体报道曝光",
        date: "2016-03-15"
      },
      {
        name: "学生抗议性暴力",
        description: "学生组织抗议活动，要求采取更强有力措施打击校园性暴力",
        date: "2016-04-10"
      },
      {
        name: "大学对性暴力的应对受到批评",
        description: "大学处理性暴力案件的方式因应对不足和受害者保护不力而受到批评",
        date: "2024-12-15"
      }
    ];
  } else if (language === 'zh-TW') {
    return [
      {
        name: "教授性侵學生事件曝光",
        description: "東國大學教授性侵女學生的事件通過媒體報導曝光",
        date: "2016-03-15"
      },
      {
        name: "學生抗議性暴力",
        description: "學生組織抗議活動，要求採取更強有力措施打擊校園性暴力",
        date: "2016-04-10"
      },
      {
        name: "大學對性暴力的應對受到批評",
        description: "大學處理性暴力案件的方式因應對不足和受害者保護不力而受到批評",
        date: "2024-12-15"
      }
    ];
  }
  
  // Default to empty array if language not supported
  return [];
}

// Define blog posts based on language
function getBlogPosts(language) {
  // Base URL for blog posts
  const baseUrl = 'https://genderwatchdog.org/blog_posts/';
  
  // Language path mapping
  const langPath = language === 'zh-CN' ? 'zh_ch' : 
                  language === 'zh-TW' ? 'zh_tw' : 
                  language === 'en' ? 'en' : 
                  language === 'ja' ? 'ja' : 
                  language === 'ko' ? 'ko' : 'en';
  
  // Common blog post data structure with translations
  const postData = [
    {
      id: '2016_dongguk_prof_sexual_assault',
      datePublished: "2025-04-05",
      titles: {
        'en': "2016 Dongguk University Professor Sexual Assault Case",
        'ja': "2016年東国大学教授による性暴力事件",
        'ko': "2016년 동국대학교 교수 성폭력 사건",
        'zh-CN': "2016年东国大学教授性暴力案件",
        'zh-TW': "2016年東國大學教授性暴力案件"
      },
      descriptions: {
        'en': "Details of the 2016 sexual assault case by a Dongguk University professor against a female student",
        'ja': "東国大学教授による女子学生への2016年性暴力事件の詳細",
        'ko': "동국대학교 교수가 여학생에게 행한 2016년 성폭력 사건의 상세내용",
        'zh-CN': "2016年东国大学教授对女学生性暴力案件的详细情况",
        'zh-TW': "2016年東國大學教授對女學生性暴力案件的詳細情況"
      }
    },
    {
      id: 'dongguk_exposed_2016_2025',
      datePublished: "2025-04-10",
      titles: {
        'en': "Sexual Violence at Dongguk University (2016-2025)",
        'ja': "東国大学での性暴力（2016年-2025年）",
        'ko': "동국대학교 성폭력 (2016-2025)",
        'zh-CN': "东国大学的性暴力（2016-2025）",
        'zh-TW': "東國大學的性暴力（2016-2025）"
      },
      descriptions: {
        'en': "Comprehensive timeline of sexual violence cases and institutional negligence at Dongguk University from 2016 to 2025",
        'ja': "2016年から2025年までの東国大学における性暴力事件と組織的怠慢の包括的な時系列",
        'ko': "2016년부터 2025년까지 동국대학교에서 발생한 성폭력 사건 및 기관 방치 사례의 종합적인 타임라인",
        'zh-CN': "2016年至2025年东国大学性暴力案件和机构疏忽的全面时间线",
        'zh-TW': "2016年至2025年東國大學性暴力案件和機構疏忽的全面時間線"
      }
    },
    {
      id: 'ethic_exploitation_sexual_violence_buddhist',
      datePublished: "2025-04-15",
      titles: {
        'en': "Ethics Exploitation and Sexual Violence in Buddhist Education",
        'ja': "仏教教育における倫理の悪用と性暴力",
        'ko': "불교 교육에서의 윤리 착취와 성폭력",
        'zh-CN': "佛教教育中的伦理剥削和性暴力",
        'zh-TW': "佛教教育中的倫理剝削和性暴力"
      },
      descriptions: {
        'en': "Analysis of how Buddhist ethics are exploited to silence sexual violence victims in academic institutions",
        'ja': "学術機関で性暴力被害者を黙らせるために仏教倫理がどのように悪用されているかの分析",
        'ko': "학술 기관에서 성폭력 피해자를 침묵시키기 위해 불교 윤리가 어떻게 악용되는지에 대한 분석",
        'zh-CN': "分析佛教伦理如何被利用来使学术机构中的性暴力受害者保持沉默",
        'zh-TW': "分析佛教倫理如何被利用來使學術機構中的性暴力受害者保持沉默"
      }
    }
  ];
  
  // Transform the data into the format needed for structured data
  return postData.map(post => ({
    title: post.titles[language] || post.titles['en'],
    description: post.descriptions[language] || post.descriptions['en'],
    datePublished: post.datePublished,
    url: `${baseUrl}${langPath}/${post.id}.html`
  }));
}

// Run the injection when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', injectStructuredData); 