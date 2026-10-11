// Multilingual Chatbot with Medical Guidance
// Features: Appointment booking, symptom checking, medical reminders

export const MEDICAL_DEPARTMENTS = {
  Cardiology: 'Heart and cardiovascular diseases',
  Dermatology: 'Skin conditions',
  Neurology: 'Nervous system and brain disorders',
  Orthopedics: 'Bones, joints, and muscles',
  Pediatrics: 'Child health',
  Gastroenterology: 'Stomach and digestive issues',
  Pulmonology: 'Lungs and respiratory',
  Psychiatry: 'Mental health',
  Ophthalmology: 'Eye care',
  ENT: 'Ear, nose, and throat',
  Urology: 'Urinary system',
  Gynecology: 'Women\'s health',
};

export const SYMPTOM_TO_DEPARTMENT = {
  'chest pain': 'Cardiology',
  'shortness of breath': 'Cardiology',
  'heart palpitations': 'Cardiology',
  'rash': 'Dermatology',
  'skin irritation': 'Dermatology',
  'acne': 'Dermatology',
  'itching': 'Dermatology',
  'headache': 'Neurology',
  'dizziness': 'Neurology',
  'numbness': 'Neurology',
  'tremors': 'Neurology',
  'joint pain': 'Orthopedics',
  'bone pain': 'Orthopedics',
  'fracture': 'Orthopedics',
  'muscle pain': 'Orthopedics',
  'fever': 'Pediatrics',
  'cough': 'Pulmonology',
  'cold': 'Pulmonology',
  'asthma': 'Pulmonology',
  'breathing difficulty': 'Pulmonology',
  'stomach pain': 'Gastroenterology',
  'abdominal pain': 'Gastroenterology',
  'nausea': 'Gastroenterology',
  'diarrhea': 'Gastroenterology',
  'constipation': 'Gastroenterology',
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
  'stress': 'Psychiatry',
  'insomnia': 'Psychiatry',
  'eye pain': 'Ophthalmology',
  'blurred vision': 'Ophthalmology',
  'ear pain': 'ENT',
  'sore throat': 'ENT',
  'hearing loss': 'ENT',
  'difficulty urinating': 'Urology',
  'kidney pain': 'Urology',
  'menstrual pain': 'Gynecology',
  'abnormal bleeding': 'Gynecology',
};

export const CHATBOT_RESPONSES = {
  en: {
    greeting: 'Hello! I\'m CareBridge Health Assistant. How can I help you today? I can help you with:\n1. Booking appointments\n2. Checking symptoms\n3. Medical reminders\n4. Health information',
    askSymptoms: 'Please describe your symptoms in detail. For example: "I have a headache and dizziness for 2 days"',
    symptomAnalysis: 'Based on your symptoms, you may need to consult a specialist in:',
    recommendDoctor: 'I recommend booking an appointment with a',
    appointmentStart: 'Great! Let\'s book an appointment. What type would you prefer?\n1. Doctor consultation\n2. Vaccination\n3. Medical test',
    selectDoctor: 'Which doctor or department would you like?',
    selectDate: 'What date would you prefer?',
    selectTime: 'What time works best for you?',
    selectLocation: 'Which hospital or clinic location?',
    confirmBooking: 'Your appointment has been confirmed! Details:',
    reminderSet: 'Reminder set successfully for your medication/appointment',
    disclaimer: '⚠️ This is educational information only and not a substitute for professional medical advice. Always consult a qualified healthcare provider.',
    error: 'I didn\'t understand that. Please try again or ask for help.',
    help: 'You can ask me to:\n- Check your symptoms\n- Book appointments\n- Set reminders\n- Get medical information',
  },
  hi: {
    greeting: 'नमस्ते! मैं CareBridge स्वास्थ्य सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?\n1. अपॉइंटमेंट बुक करें\n2. लक्षणों की जांच करें\n3. दवा की याद दिलाएं\n4. स्वास्थ्य जानकारी',
    askSymptoms: 'कृपया अपने लक्षणों का विवरण दें। उदाहरण: "मुझे 2 दिन से सिरदर्द और चक्कर आ रहे हैं"',
    symptomAnalysis: 'आपके लक्षणों के आधार पर, आपको निम्नलिखित विशेषज्ञ से परामर्श की आवश्यकता हो सकती है:',
    recommendDoctor: 'मैं एक के साथ नियुक्ति बुक करने की सलाह देता हूँ',
    appointmentStart: 'बहुत अच्छा! आइए एक नियुक्ति बुक करें। आप किस प्रकार को पसंद करेंगे?\n1. डॉक्टर परामर्श\n2. टीकाकरण\n3. चिकित्सा परीक्षण',
    selectDoctor: 'आप किस डॉक्टर या विभाग को पसंद करेंगे?',
    selectDate: 'आप किस तारीख को पसंद करेंगे?',
    selectTime: 'आपके लिए कौन सा समय ठीक है?',
    selectLocation: 'कौन सा अस्पताल या क्लिनिक स्थान?',
    confirmBooking: 'आपकी नियुक्ति की पुष्टि हो गई है! विवरण:',
    reminderSet: 'आपकी दवा/नियुक्ति के लिए याद दिलाया गया है',
    disclaimer: '⚠️ यह केवल शैक्षणिक जानकारी है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    error: 'मुझे समझ में नहीं आया। कृपया फिर से कोशिश करें।',
    help: 'आप मुझसे पूछ सकते हैं:\n- लक्षणों की जांच करें\n- अपॉइंटमेंट बुक करें\n- याद दिलाएं सेट करें\n- चिकित्सा जानकारी प्राप्त करें',
  },
  ta: {
    greeting: 'வணக்கம்! நான் CareBridge சுகாதார உதவியாளன். நான் உங்களுக்கு எப்படி உதவக்கூடும்?\n1. முன்னூட்டம் பதிவு செய்யவும்\n2. அறிகுறிகள் சரிபார்க்கவும்\n3. மருந்து நினைவுபடுத்தல்\n4. சுகாதார தகவல்',
    askSymptoms: 'தயவுசெய்து உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்.',
    symptomAnalysis: 'உங்கள் அறிகுறிகளின் அடிப்படையில், நீங்கள் ஒரு நிபுணரிடம் ஆலோசனை பெற வேண்டியிருக்கலாம்:',
    recommendDoctor: 'நான் ஒரு உடன் முன்னூட்டம் பதிவு செய்ய பரிந்துரைக்கிறேன்',
    appointmentStart: 'நல்லது! முன்னூட்டத்தை பதிவு செய்யலாம். நீங்கள் எந்த வகையை விரும்புகிறீர்கள்?\n1. மருத்துவர் ஆலோசனை\n2. தடுப்பூசி\n3. மருத்துவ பரীक்षை',
    selectDoctor: 'நீங்கள் எந்த மருத்துவர் அல்லது பிரிவை விரும்புகிறீர்கள்?',
    selectDate: 'நீங்கள் எந்த தேதியை விரும்புகிறீர்கள்?',
    selectTime: 'உங்களுக்கு எந்த நேரம் சரியாக இருக்கிறது?',
    selectLocation: 'எந்த மருத்துவமனை அல்லது ক்লினிக் இருப்பிடம்?',
    confirmBooking: 'உங்கள் முன்னூட்டம் உறுதி செய்யப்பட்டுவிட்டது! விவரங்கள்:',
    reminderSet: 'உங்கள் மருந்து/முன்னூட்டத்திற்கான நினைவூட்டல் அமைக்கப்பட்டுள்ளது',
    disclaimer: '⚠️ இது கல்வி தகவல் மட்டுமே மற்றும் தொழில்முறை மருத்துவ ஆலோசனையின் மாற்றாக அல்ல.',
    error: 'நான் புரிந்து கொள்ளவில்லை. மீண்டும் முயற்சி செய்யவும்.',
    help: 'நீங்கள் என்னிடம் கேட்கலாம்:\n- அறிகுறிகள் சரிபார்க்கவும்\n- முன்னூட்டம் பதிவு செய்யவும்\n- நினைவூட்டல் அமைக்கவும்\n- மருத்துவ தகவல் பெறவும்',
  },
};

// Analyze symptoms and suggest department
export const analyzeSymptomsForDepartment = (symptomInput) => {
  const lowerInput = symptomInput.toLowerCase();
  const suggestedDepts = new Set();

  Object.entries(SYMPTOM_TO_DEPARTMENT).forEach(([symptom, dept]) => {
    if (lowerInput.includes(symptom)) {
      suggestedDepts.add(dept);
    }
  });

  return suggestedDepts.size > 0
    ? Array.from(suggestedDepts)
    : ['General Practice'];
};

// Get chatbot response in selected language
export const getChatbotResponse = (messageType, language = 'en') => {
  const responses = CHATBOT_RESPONSES[language] || CHATBOT_RESPONSES.en;
  return responses[messageType] || responses.error;
};

// Process chatbot message and extract intent
export const processChatbotMessage = (userMessage, language = 'en') => {
  const message = userMessage.toLowerCase().trim();

  if (message.includes('symptom') || message.includes('pain') || message.includes('fever')) {
    return { intent: 'symptom_check', type: 'askSymptoms' };
  }

  if (message.includes('appointment') || message.includes('book') || message.includes('doctor')) {
    return { intent: 'appointment_booking', type: 'appointmentStart' };
  }

  if (message.includes('reminder') || message.includes('medicine') || message.includes('medication')) {
    return { intent: 'set_reminder', type: 'reminderSet' };
  }

  if (message.includes('help') || message.includes('what can')) {
    return { intent: 'help', type: 'help' };
  }

  if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
    return { intent: 'greeting', type: 'greeting' };
  }

  return { intent: 'unknown', type: 'error' };
};

export default {
  analyzeSymptomsForDepartment,
  getChatbotResponse,
  processChatbotMessage,
  MEDICAL_DEPARTMENTS,
  SYMPTOM_TO_DEPARTMENT,
};
