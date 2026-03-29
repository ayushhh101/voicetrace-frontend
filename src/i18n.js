import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "VoiceTrace",
      downloadApp: "Download App",
      installUnavailable: "Install not available. Use 'Add to Home Screen'",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      recorder: {
        start: "Start",
        stop: "Stop",
        upload: "Upload",
        uploading: "Uploading...",
        noRecordingYet: "Record audio first, then upload.",
        microphonePermissionError:
          "Could not start recording. Please allow microphone access.",
        noActiveRecording: "No active recording to stop.",
        uploadFailed: "Upload failed. Please try again.",
        speakGuide: "Speak Instructions",
        speakResult: "Speak Result",
        vendorGuideText:
          "Tap Start to record, tap Stop to finish, then tap Upload to send audio.",
        resultTitle: "Upload Result",
        uploadedUrl: "Uploaded URL",
        detectedText: "Detected Text",
        noDetectedText: "No transcript text returned by server."
      },
      udhar: {
        title: "Udhar List",
        subtitle: "Money to Collect",
        stats: {
          totalPending: "Total Pending",
          collectedToday: "Collected Today",
          people: "People"
        },
        voiceHint: 'Say "Ramesh paid 50 rupees" to update',
        peopleList: "People List",
        pending: "Pending",
        cleared: "Cleared",
        db: {
          time: {
            today: "Today",
            one_day_ago: "1 day ago",
            three_days_ago: "3 days ago"
          }
        }
      },
      insights: {
        loading: "Generating Weekly Report...",
        title: {
          line1: "Weekly",
          line2: "Report",
          subtitle: "Business Insights"
        },
        stats: {
          dailySales: "Daily Sales",
          dailyProfit: "Daily Profit",
          waste: "Waste"
        },
        sections: {
          patterns: "Patterns",
          itemPerformance: "Item Performance",
          alerts: "Alerts",
          tipsTomorrow: "Tips for Tomorrow"
        },
        patterns: {
          bestDayTitle: "{{day}} is best!",
          avgPerDay: "Avg Rs {{amount}}/day",
          peakHours: "Peak Business Hours"
        },
        performance: {
          best: "Best",
          worst: "Worst"
        },
        alerts: {
          patternAlert: "Pattern Alert",
          check: "Check"
        },
        tips: {
          marketCreditPending: "Rs {{amount}} market credit pending."
        },
        db: {
          day: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
          },
          timeOfDay: {
            morning: "Morning",
            afternoon: "Afternoon",
            evening: "Evening",
            night: "Night"
          },
          message: {
            low_sales_detected: "Low sales detected",
            high_waste_detected: "High waste detected",
            demand_spike_expected: "Demand spike expected",
            stock_out_risk: "Stock-out risk"
          }
        }
      },
      recordings: {
        loading: "Fetching Audio Files...",
        title: "My Voice Notes",
        subtitle: "Your Voice Trail",
        note: "Note {{number}}",
        noRecordings: "No recordings found."
      },
      nextDayInsights: {
        appBarTitle: "Prep Suggestions",
        backAriaLabel: "Go back",
        title: "Tomorrow's Stock",
        loading: "Preparing suggestions...",
        emptyTitle: "No data available",
        emptyDescription: "We need more sales data to generate tomorrow's prep list.",
        db: {
          message: {
            reduce_preparation: "Reduce preparation",
            increase_preparation: "Increase preparation",
            skip_preparation: "Skip preparation",
            waste_risk: "Waste risk",
            low_demand_expected: "Low demand expected",
            high_demand_expected: "High demand expected"
          }
        }
      },
      voiceAction: {
        history: "Voice History",
        hintTapStart: "Tap to start speaking",
        heading: {
          idle: "Ready",
          recording: "Listening...",
          processing: "Wait...",
          success: "Success!"
        },
        subtitle: {
          recording: "Speak, I am listening",
          idle: "VoiceTrace Business Intelligence"
        },
        processingMessages: {
          thinking: "Thinking...",
          analyzing: "Analyzing your voice...",
          extractingNumbers: "Extracting numbers...",
          refiningText: "Refining text...",
          savingLedger: "Saving to ledger...",
          refiningWithAi: "Refining text with AI...",
          extractingBusinessData: "Extracting business data...",
          clarificationNeeded: "I heard you, but I'm a bit confused. Check your Home Screen to fix this!",
          serverDisconnected: "Server disconnected. Please try again."
        },
        transcriptFallback: "Analyzing sound waves...",
        successCard: {
          entryLogged: "Entry Logged",
          item: "Item",
          amount: "Amount",
          defaultSale: "Sale"
        },
        cta: {
          tapToSpeak: "Tap to Speak",
          finish: "Finish",
          new: "New",
          looksGood: "Looks Good"
        }
      }
    }
  },
  hi: {
    translation: {
      appName: "वॉइसट्रेस",
      downloadApp: "ऐप डाउनलोड करें",
      installUnavailable: "इंस्टॉल उपलब्ध नहीं है। 'Add to Home Screen' का उपयोग करें",
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",
      recorder: {
        start: "शुरू करें",
        stop: "रोकें",
        upload: "अपलोड करें",
        uploading: "अपलोड हो रहा है...",
        noRecordingYet: "पहले ऑडियो रिकॉर्ड करें, फिर अपलोड करें।",
        microphonePermissionError:
          "रिकॉर्डिंग शुरू नहीं हो सकी। कृपया माइक्रोफोन की अनुमति दें।",
        noActiveRecording: "रोकने के लिए कोई सक्रिय रिकॉर्डिंग नहीं है।",
        uploadFailed: "अपलोड विफल हुआ। कृपया दोबारा कोशिश करें।",
        speakGuide: "निर्देश सुनें",
        speakResult: "परिणाम सुनें",
        vendorGuideText:
          "रिकॉर्ड करने के लिए शुरू करें दबाएं, खत्म करने के लिए रोकें दबाएं, फिर ऑडियो भेजने के लिए अपलोड करें दबाएं।",
        resultTitle: "अपलोड परिणाम",
        uploadedUrl: "अपलोड किया गया URL",
        detectedText: "पहचाना गया टेक्स्ट",
        noDetectedText: "सर्वर से ट्रांसक्रिप्ट टेक्स्ट नहीं मिला।"
      },
      udhar: {
        title: "उधार सूची",
        subtitle: "लेने वाले पैसे",
        stats: {
          totalPending: "कुल बकाया",
          collectedToday: "आज मिला",
          people: "लोग"
        },
        voiceHint: 'अपडेट के लिए कहें "रमेश ने 50 रुपये दिए"',
        peopleList: "लोगों की सूची",
        pending: "बकाया",
        cleared: "चुकता",
        db: {
          time: {
            today: "आज",
            one_day_ago: "1 दिन पहले",
            three_days_ago: "3 दिन पहले"
          }
        }
      },
      insights: {
        loading: "साप्ताहिक रिपोर्ट तैयार हो रही है...",
        title: {
          line1: "साप्ताहिक",
          line2: "रिपोर्ट",
          subtitle: "व्यापार जानकारी"
        },
        stats: {
          dailySales: "रोज की बिक्री",
          dailyProfit: "दैनिक मुनाफा",
          waste: "वेस्टेज"
        },
        sections: {
          patterns: "पैटर्न",
          itemPerformance: "आइटम प्रदर्शन",
          alerts: "अलर्ट",
          tipsTomorrow: "कल के लिए सुझाव"
        },
        patterns: {
          bestDayTitle: "{{day}} सबसे अच्छा दिन है",
          avgPerDay: "औसत Rs {{amount}}/दिन",
          peakHours: "सबसे व्यस्त समय"
        },
        performance: {
          best: "सर्वश्रेष्ठ",
          worst: "कमज़ोर"
        },
        alerts: {
          patternAlert: "पैटर्न अलर्ट",
          check: "जांचें"
        },
        tips: {
          marketCreditPending: "Rs {{amount}} बाजार उधारी बाकी है।"
        },
        db: {
          day: {
            monday: "सोमवार",
            tuesday: "मंगलवार",
            wednesday: "बुधवार",
            thursday: "गुरुवार",
            friday: "शुक्रवार",
            saturday: "शनिवार",
            sunday: "रविवार"
          },
          timeOfDay: {
            morning: "सुबह",
            afternoon: "दोपहर",
            evening: "शाम",
            night: "रात"
          },
          message: {
            low_sales_detected: "बिक्री कम पाई गई",
            high_waste_detected: "वेस्टेज अधिक पाया गया",
            demand_spike_expected: "मांग बढ़ने की संभावना है",
            stock_out_risk: "स्टॉक खत्म होने का जोखिम"
          }
        }
      },
      recordings: {
        loading: "ऑडियो फाइलें लाई जा रही हैं...",
        title: "मेरी वॉइस नोट्स",
        subtitle: "आपकी आवाज़ का रिकॉर्ड",
        note: "नोट {{number}}",
        noRecordings: "कोई रिकॉर्डिंग नहीं मिली।"
      },
      nextDayInsights: {
        appBarTitle: "तैयारी सुझाव",
        backAriaLabel: "वापस जाएं",
        title: "कल का स्टॉक",
        loading: "सुझाव तैयार किए जा रहे हैं...",
        emptyTitle: "डेटा उपलब्ध नहीं है",
        emptyDescription: "कल की तैयारी सूची के लिए हमें और बिक्री डेटा चाहिए।",
        db: {
          message: {
            reduce_preparation: "तैयारी कम करें",
            increase_preparation: "तैयारी बढ़ाएं",
            skip_preparation: "तैयारी छोड़ें",
            waste_risk: "वेस्टेज का जोखिम",
            low_demand_expected: "कम मांग की संभावना",
            high_demand_expected: "अधिक मांग की संभावना"
          }
        }
      },
      voiceAction: {
        history: "वॉइस हिस्ट्री",
        hintTapStart: "बोलना शुरू करने के लिए टैप करें",
        heading: {
          idle: "तैयार",
          recording: "सुन रहा हूँ...",
          processing: "कृपया प्रतीक्षा करें...",
          success: "सफल!"
        },
        subtitle: {
          recording: "बोलिए, मैं सुन रहा हूँ",
          idle: "वॉइसट्रेस बिज़नेस इंटेलिजेंस"
        },
        processingMessages: {
          thinking: "सोच रहा हूँ...",
          analyzing: "आपकी आवाज़ का विश्लेषण हो रहा है...",
          extractingNumbers: "अंकों को निकाला जा रहा है...",
          refiningText: "टेक्स्ट को बेहतर बनाया जा रहा है...",
          savingLedger: "लेजर में सेव किया जा रहा है...",
          refiningWithAi: "AI से टेक्स्ट बेहतर किया जा रहा है...",
          extractingBusinessData: "व्यापार डेटा निकाला जा रहा है...",
          clarificationNeeded: "मैंने सुना, लेकिन थोड़ा भ्रम है। ठीक करने के लिए होम स्क्रीन देखें।",
          serverDisconnected: "सर्वर डिस्कनेक्ट हो गया। कृपया फिर कोशिश करें।"
        },
        transcriptFallback: "साउंड वेव्स का विश्लेषण हो रहा है...",
        successCard: {
          entryLogged: "एंट्री सेव हो गई",
          item: "आइटम",
          amount: "राशि",
          defaultSale: "बिक्री"
        },
        cta: {
          tapToSpeak: "बोलने के लिए टैप करें",
          finish: "समाप्त",
          new: "नया",
          looksGood: "ठीक है"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "vt-lang",
      caches: ["localStorage"]
    }
  });

export default i18n;