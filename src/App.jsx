import { useEffect, useMemo, useState } from 'react';
import { buildDemoState, LANGUAGE_OPTIONS } from './data/syntheticData';
import { loadAppState, saveAppState } from './lib/storage';
import { getDemoTranslation, getLanguageMeta, readAloud, translateTextWithBhasini } from './lib/bhasini';

const emptyMedicalCard = {
  allergies: '',
  chronicConditions: '',
  currentMedications: '',
};

const defaultRegistrationForm = {
  name: '',
  dob: '',
  gender: 'Female',
  bloodGroup: 'O+',
  preferredLanguage: 'English',
  phone: '',
  email: '',
  username: '',
  password: '',
  emergencyContact: '',
  emergencyContactNumber: '',
  allergies: '',
  chronicConditions: '',
  currentMedications: '',
};

const formatList = (value) => {
  if (!value) return 'None recorded';
  return Array.isArray(value) ? value.join(', ') : value;
};

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

const getPatientById = (patients, patientId) => patients.find((patient) => patient.id === patientId) || null;

function App() {
  const [appState, setAppState] = useState(() => loadAppState() || buildDemoState());
  const [loginMode, setLoginMode] = useState('patient');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registrationForm, setRegistrationForm] = useState(defaultRegistrationForm);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatTopic, setChatTopic] = useState('Allergies');
  const [staffRecordForm, setStaffRecordForm] = useState({ patientId: '', allergies: '', chronicConditions: '', currentMedications: '', notes: '' });
  const [fontScale, setFontScale] = useState(1);
  const [sosTimer, setSosTimer] = useState(30);
  const [sosActive, setSosActive] = useState(false);

  const currentLanguageCode = appState.language || 'en';
  const currentLanguage = getLanguageMeta(currentLanguageCode);
  const currentUser = appState.currentUser;

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!sosActive) return undefined;
    const interval = setInterval(() => {
      setSosTimer((previous) => {
        if (previous <= 1) {
          clearInterval(interval);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sosActive]);

  const patientList = appState.patients || [];
  const staffList = appState.staff || [];
  const appointmentList = appState.appointments || [];
  const requestList = appState.medicalCardRequests || [];
  const sosAlerts = appState.sosAlerts || [];

  const displayName = currentUser ? (currentUser.fullName || currentUser.name || 'Guest') : 'Guest';

  const summary = useMemo(() => {
    const activePatients = patientList.length;
    const pendingAppointments = appointmentList.filter((appointment) => appointment.status === 'Pending').length;
    const pendingAccess = requestList.filter((request) => request.status === 'Pending').length;
    return { activePatients, pendingAppointments, pendingAccess };
  }, [appointmentList, patientList.length, requestList]);

  const t = (key, fallback) => getDemoTranslation(key, currentLanguageCode) || fallback || key;

  const handleLogin = (event) => {
    event.preventDefault();

    const patientMatch = patientList.find(
      (patient) => patient.username === loginForm.username && patient.password === loginForm.password,
    );

    if (patientMatch) {
      setAppState((previous) => ({ ...previous, currentUser: patientMatch }));
      setToast('Login successful');
      setActiveTab('overview');
      return;
    }

    const staffMatch = staffList.find(
      (member) => member.username === loginForm.username && member.password === loginForm.password,
    );

    if (staffMatch) {
      setAppState((previous) => ({ ...previous, currentUser: staffMatch }));
      setToast('Login successful');
      setActiveTab('overview');
      return;
    }

    setToast('Invalid login credentials');
  };

  const handleRegistration = (event) => {
    event.preventDefault();

    const cleanedUsername = registrationForm.username.trim();
    const cleanedPassword = registrationForm.password.trim();

    if (!cleanedUsername || !cleanedPassword) {
      setToast('Create a username and password to continue');
      return;
    }

    const usernameExists = [...patientList, ...staffList].some((account) => account.username === cleanedUsername);
    if (usernameExists) {
      setToast('That username is already in use');
      return;
    }

    const newPatient = {
      id: `PATIENT_${Date.now()}`,
      fullName: registrationForm.name.trim() || 'New patient',
      dob: registrationForm.dob,
      gender: registrationForm.gender,
      bloodGroup: registrationForm.bloodGroup,
      preferredLanguage: registrationForm.preferredLanguage,
      phone: registrationForm.phone,
      email: registrationForm.email,
      username: cleanedUsername,
      password: cleanedPassword,
      emergencyContact: registrationForm.emergencyContact,
      emergencyContactNumber: registrationForm.emergencyContactNumber,
      allergies: registrationForm.allergies ? registrationForm.allergies.split(',').map((item) => item.trim()).filter(Boolean) : [],
      chronicConditions: registrationForm.chronicConditions ? registrationForm.chronicConditions.split(',').map((item) => item.trim()).filter(Boolean) : [],
      currentMedications: registrationForm.currentMedications ? registrationForm.currentMedications.split(',').map((item) => item.trim()).filter(Boolean) : [],
      pastMedicalHistory: 'Newly registered patient',
      vaccinationHistory: ['Demo registration completed'],
      recentTests: [],
      medicalCard: {
        id: `MC-${Date.now()}`,
        status: 'Active',
        consentToShareRecords: true,
        accessRequests: [],
      },
      isDemo: true,
      role: 'patient',
    };

    setAppState((previous) => ({
      ...previous,
      patients: [...previous.patients, newPatient],
      currentUser: newPatient,
    }));

    setRegistrationForm(defaultRegistrationForm);
    setLoginMode('patient');
    setActiveTab('overview');
    setToast('Registration successful');
  };

  const handlePatientUpdate = (event) => {
    event.preventDefault();
    if (!currentUser || currentUser.role !== 'patient') return;

    const updatedPatient = {
      ...currentUser,
      allergies: currentUser.allergies || [],
      chronicConditions: currentUser.chronicConditions || [],
      currentMedications: currentUser.currentMedications || [],
      medicalCard: {
        ...(currentUser.medicalCard || {}),
        consentToShareRecords: true,
      },
    };

    setAppState((previous) => ({
      ...previous,
      patients: previous.patients.map((patient) => (patient.id === currentUser.id ? updatedPatient : patient)),
      currentUser: updatedPatient,
    }));
    setToast(t('updateSuccessful', 'Update successful'));
  };

  const handleStaffRecordUpdate = (event) => {
    event.preventDefault();
    if (!currentUser || currentUser.role !== 'staff') return;

    const selectedPatient = getPatientById(patientList, staffRecordForm.patientId);
    if (!selectedPatient) {
      setToast('Select a patient first');
      return;
    }

    const updatedPatient = {
      ...selectedPatient,
      allergies: staffRecordForm.allergies ? staffRecordForm.allergies.split(',').map((item) => item.trim()).filter(Boolean) : selectedPatient.allergies || [],
      chronicConditions: staffRecordForm.chronicConditions ? staffRecordForm.chronicConditions.split(',').map((item) => item.trim()).filter(Boolean) : selectedPatient.chronicConditions || [],
      currentMedications: staffRecordForm.currentMedications ? staffRecordForm.currentMedications.split(',').map((item) => item.trim()).filter(Boolean) : selectedPatient.currentMedications || [],
      pastMedicalHistory: staffRecordForm.notes || selectedPatient.pastMedicalHistory || '',
      medicalCard: {
        ...(selectedPatient.medicalCard || {}),
        status: 'Active',
      },
    };

    setAppState((previous) => ({
      ...previous,
      patients: previous.patients.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient)),
      currentUser: previous.currentUser && previous.currentUser.id === currentUser.id ? { ...previous.currentUser } : previous.currentUser,
    }));

    setStaffRecordForm((previous) => ({ ...previous, allergies: '', chronicConditions: '', currentMedications: '', notes: '' }));
    setToast(t('updateSuccessful', 'Update successful'));
  };

  const handleAccessRequest = () => {
    if (!currentUser || currentUser.role !== 'patient') return;

    const requestPayload = {
      id: `REQUEST_${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.fullName,
      requestedAt: new Date().toISOString(),
      requestedCardId: currentUser.medicalCard?.id || 'MC-NEW',
      status: 'Pending',
    };

    setAppState((previous) => ({
      ...previous,
      medicalCardRequests: [requestPayload, ...previous.medicalCardRequests],
      patients: previous.patients.map((patient) =>
        patient.id === currentUser.id
          ? { ...patient, medicalCard: { ...(patient.medicalCard || {}), accessRequests: [requestPayload.id, ...(patient.medicalCard?.accessRequests || [])] } }
          : patient,
      ),
    }));

    setToast('Access request submitted');
  };

  const handleApproveRequest = (requestId) => {
    setAppState((previous) => ({
      ...previous,
      medicalCardRequests: previous.medicalCardRequests.map((request) =>
        request.id === requestId ? { ...request, status: 'Approved' } : request,
      ),
    }));
    setToast('Access approved');
  };

  const handleSosActivate = () => {
    if (!currentUser) return;
    setSosActive(true);
    setSosTimer(30);
    setAppState((previous) => ({
      ...previous,
      sosAlerts: [
        {
          id: `SOS_${Date.now()}`,
          patientId: currentUser.id,
          patientName: currentUser.fullName || currentUser.name || 'Patient',
          text: 'Local safety alert activated. No emergency service is connected yet.',
          timestamp: new Date().toISOString(),
        },
        ...previous.sosAlerts,
      ],
    }));
  };

  const handleSafe = () => {
    setSosActive(false);
    setSosTimer(30);
    setToast('Local SOS alert cleared');
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const response = `${t('chatbot', 'Medical research chat')}: Based on the current patient detail, consult a licensed clinician before acting on any advice. For ${chatTopic.toLowerCase()}, evidence shows that symptom monitoring, medication review, and clinician follow-up remain important. This demo information does not replace professional medical care.`;

    setAppState((previous) => ({
      ...previous,
      chatHistory: [
        ...(previous.chatHistory || []),
        { id: Date.now(), speaker: 'user', text: userMessage },
        { id: Date.now() + 1, speaker: 'bot', text: response },
      ],
    }));

    setChatInput('');
  };

  const currentPatient = currentUser && currentUser.role === 'patient'
    ? currentUser
    : currentUser && currentUser.role === 'staff'
      ? getPatientById(patientList, staffRecordForm.patientId) || null
      : null;

  const patientMedicalCard = (currentUser && currentUser.role === 'patient' ? currentUser : currentPatient) || null;

  if (!currentUser) {
    return (
      <div className="app-shell">
        <div className="auth-page">
          <div className="auth-card" aria-labelledby="app-title">
            <div className="brand-block">
              <div className="brand-icon" aria-hidden="true">✚</div>
              <div>
                <div className="eyebrow">CareBridge</div>
                <h1 id="app-title">Accessible care coordination</h1>
              </div>
            </div>

            <div className="demo-banner" role="status" aria-live="polite">
              {t('demoNote', 'Demo authentication is enabled for prototype testing.')}
            </div>

            <div className="role-selector" aria-label={t('loginMode', 'Select access mode')}>
              <button
                type="button"
                className={loginMode === 'patient' ? 'selected' : ''}
                onClick={() => setLoginMode('patient')}
              >
                Patient
              </button>
              <button
                type="button"
                className={loginMode === 'staff' ? 'selected' : ''}
                onClick={() => setLoginMode('staff')}
              >
                Staff
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <label>
                Username
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((previous) => ({ ...previous, username: event.target.value }))}
                  placeholder="Enter username"
                  aria-label="Username"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((previous) => ({ ...previous, password: event.target.value }))}
                  placeholder="Enter password"
                  aria-label="Password"
                />
              </label>

              <div className="demo-row" aria-live="polite">
                <span>Prototype credentials are stored locally only.</span>
                <button type="button" className="ghost-btn" onClick={() => setToast('Demo credentials are kept internally for testing only')}>
                  Learn more
                </button>
              </div>

              <button className="primary-btn" type="submit">{t('login', 'Log in')}</button>
            </form>

            <div className="divider"><span>or</span></div>

            <form onSubmit={handleRegistration} className="registration-form">
              <h2>New patient registration</h2>
              <div className="registration-grid">
                <label>
                  Full name
                  <input value={registrationForm.name} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, name: event.target.value }))} />
                </label>
                <label>
                  Date of birth
                  <input type="date" value={registrationForm.dob} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, dob: event.target.value }))} />
                </label>
                <label>
                  Gender
                  <select value={registrationForm.gender} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, gender: event.target.value }))}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>
                <label>
                  Blood group
                  <select value={registrationForm.bloodGroup} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, bloodGroup: event.target.value }))}>
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </label>
                <label>
                  Preferred language
                  <select value={registrationForm.preferredLanguage} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, preferredLanguage: event.target.value }))}>
                    {LANGUAGE_OPTIONS.map((language) => (
                      <option key={language.code} value={language.name}>{language.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Phone
                  <input value={registrationForm.phone} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, phone: event.target.value }))} />
                </label>
                <label>
                  Email
                  <input type="email" value={registrationForm.email} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, email: event.target.value }))} />
                </label>
                <label>
                  Username
                  <input value={registrationForm.username} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, username: event.target.value }))} />
                </label>
                <label>
                  Password
                  <input type="password" value={registrationForm.password} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, password: event.target.value }))} />
                </label>
                <label>
                  Emergency contact
                  <input value={registrationForm.emergencyContact} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, emergencyContact: event.target.value }))} />
                </label>
                <label>
                  Emergency contact number
                  <input value={registrationForm.emergencyContactNumber} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, emergencyContactNumber: event.target.value }))} />
                </label>
                <label>
                  Allergies
                  <input value={registrationForm.allergies} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, allergies: event.target.value }))} />
                </label>
                <label>
                  Chronic conditions
                  <input value={registrationForm.chronicConditions} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, chronicConditions: event.target.value }))} />
                </label>
                <label className="full-width">
                  Current medications
                  <input value={registrationForm.currentMedications} onChange={(event) => setRegistrationForm((previous) => ({ ...previous, currentMedications: event.target.value }))} />
                </label>
              </div>
              <button className="primary-btn" type="submit">Create demo medical card</button>
            </form>
          </div>
        </div>

        {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      </div>
    );
  }

  const renderPatientDashboard = () => (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">CareBridge</div>
          <h2>{t('patientTitle', 'Patient dashboard')}</h2>
        </div>
        <div className="toolbar" aria-label="Accessibility toolbar">
          <button className="ghost-btn" onClick={() => setFontScale((previous) => Math.min(previous + 0.1, 1.4))}>A+</button>
          <button className="ghost-btn" onClick={() => setFontScale((previous) => Math.max(previous - 0.1, 0.9))}>A-</button>
          <select value={currentLanguageCode} onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}>
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
          <button className="soft-btn" onClick={() => readAloud(`${displayName}, ${t('patientTitle', 'Patient dashboard')}`, currentLanguageCode)}>
            {t('readAloud', 'Read aloud')}
          </button>
          <button className="danger-btn" type="button" onClick={handleSosActivate}>{t('sos', 'SOS')}</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="left-panel">
          <div className="profile-pill">
            <div className="avatar" aria-hidden="true">{displayName.slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{displayName}</strong>
              <div className="muted">{currentUser.role === 'patient' ? 'Patient' : 'Care staff'}</div>
            </div>
          </div>

          <nav className="side-nav" aria-label="Dashboard navigation">
            {['overview', 'records', 'appointments', 'chatbot'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' ? 'Overview' : tab === 'records' ? 'Medical card' : tab === 'appointments' ? 'Appointments' : 'Chatbot'}
              </button>
            ))}
          </nav>

          <div className="summary-box">
            <strong>Quick summary</strong>
            <ul>
              <li>{currentUser.allergies?.length || 0} allergies logged</li>
              <li>{currentUser.chronicConditions?.length || 0} chronic conditions</li>
              <li>{currentUser.currentMedications?.length || 0} medications</li>
            </ul>
          </div>
        </aside>

        <main className="main-panel">
          {activeTab === 'overview' && (
            <>
              <div className="summary-grid">
                <div className="card summary-card">
                  <div className="card-head">
                    <h3>{t('medicalCard', 'Medical card')}</h3>
                    <span className="status-badge success">{currentUser.medicalCard?.status || 'Active'}</span>
                  </div>
                  <p>Card ID: {currentUser.medicalCard?.id || 'N/A'}</p>
                </div>

                <div className="card summary-card">
                  <div className="card-head">
                    <h3>{t('appointments', 'Appointments')}</h3>
                    <span className="status-badge info">{appointmentList.filter((item) => item.patientId === currentUser.id).length}</span>
                  </div>
                  <p>Upcoming care visits</p>
                </div>

                <div className="card summary-card">
                  <div className="card-head">
                    <h3>Emergency</h3>
                    <span className="status-badge alert">{t('noEmergency', 'No emergency service is connected yet.')}</span>
                  </div>
                  <p>Use the SOS feature only for local safety checks.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h3>Patient details</h3>
                  <button className="soft-btn" onClick={() => readAloud(`${currentUser.fullName}, blood group ${currentUser.bloodGroup}, language ${currentUser.preferredLanguage}`, currentLanguageCode)}>
                    {t('readAloud', 'Read aloud')}
                  </button>
                </div>
                <div className="meta-grid">
                  <div><strong>Full name</strong><p>{currentUser.fullName}</p></div>
                  <div><strong>Date of birth</strong><p>{formatDate(currentUser.dob)}</p></div>
                  <div><strong>Gender</strong><p>{currentUser.gender}</p></div>
                  <div><strong>Preferred language</strong><p>{currentUser.preferredLanguage}</p></div>
                  <div><strong>Emergency contact</strong><p>{currentUser.emergencyContact}</p></div>
                  <div><strong>Emergency number</strong><p>{currentUser.emergencyContactNumber}</p></div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'records' && (
            <div className="card">
              <div className="card-head">
                <h3>Medical card</h3>
                <button className="soft-btn" onClick={handleAccessRequest}>{t('requestAccess', 'Request access')}</button>
              </div>

              <form className="provider-form" onSubmit={handlePatientUpdate}>
                <label>
                  Allergies
                  <input value={currentUser.allergies?.join(', ') || ''} onChange={(event) => setAppState((previous) => ({ ...previous, currentUser: { ...previous.currentUser, allergies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) } }))} />
                </label>
                <label>
                  Chronic conditions
                  <input value={currentUser.chronicConditions?.join(', ') || ''} onChange={(event) => setAppState((previous) => ({ ...previous, currentUser: { ...previous.currentUser, chronicConditions: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) } }))} />
                </label>
                <label>
                  Current medications
                  <input value={currentUser.currentMedications?.join(', ') || ''} onChange={(event) => setAppState((previous) => ({ ...previous, currentUser: { ...previous.currentUser, currentMedications: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) } }))} />
                </label>
                <button type="submit" className="primary-btn">Save medical card</button>
              </form>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="card">
              <div className="card-head">
                <h3>{t('appointments', 'Appointments')}</h3>
              </div>
              <ul className="appointments-list">
                {appointmentList.filter((item) => item.patientId === currentUser.id).map((appointment) => (
                  <li key={appointment.id}>
                    <strong>{appointment.doctorName}</strong>
                    <span>{appointment.specialty}</span>
                    <span>{formatDate(appointment.date)} • {appointment.time}</span>
                    <span className="status-badge success">{appointment.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'chatbot' && (
            <div className="card">
              <div className="card-head">
                <h3>{t('chatbot', 'Medical research chat')}</h3>
                <select value={chatTopic} onChange={(event) => setChatTopic(event.target.value)}>
                  <option>Allergies</option>
                  <option>Diabetes</option>
                  <option>Vaccination</option>
                  <option>Cardiovascular</option>
                </select>
              </div>

              <div className="chat-box" aria-live="polite">
                {(appState.chatHistory || []).length === 0 && (
                  <div className="chat-bubble bot">
                    This demo chatbot provides general educational information only and does not replace professional medical care.
                  </div>
                )}
                {(appState.chatHistory || []).map((message) => (
                  <div key={message.id} className={`chat-bubble ${message.speaker === 'user' ? 'user' : 'bot'}`}>
                    {message.text}
                  </div>
                ))}
              </div>

              <form className="chat-actions" onSubmit={handleChatSubmit}>
                <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about symptoms, treatment, or patient education" aria-label="Ask the medical research chatbot" />
                <button className="primary-btn" type="submit">Send</button>
              </form>
            </div>
          )}
        </main>
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      {sosActive && (
        <div className="sos-overlay" role="alertdialog" aria-live="assertive" aria-modal="true">
          <div className="sos-card">
            <div className="eyebrow">Emergency local alert</div>
            <h2>Local SOS active</h2>
            <p>No emergency service is connected yet.</p>
            <div className="sos-timer" aria-live="polite">{sosTimer}s</div>
            <button className="safe-btn" onClick={handleSafe}>{t('iAmSafe', 'I AM SAFE')}</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">Care team</div>
          <h2>{t('staffTitle', 'Care team dashboard')}</h2>
        </div>
        <div className="toolbar">
          <button className="ghost-btn" onClick={() => setFontScale((previous) => Math.min(previous + 0.1, 1.4))}>A+</button>
          <button className="ghost-btn" onClick={() => setFontScale((previous) => Math.max(previous - 0.1, 0.9))}>A-</button>
          <select value={currentLanguageCode} onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}>
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
          <button className="danger-btn" type="button" onClick={handleSosActivate}>SOS</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="left-panel">
          <div className="profile-pill">
            <div className="avatar" aria-hidden="true">{(currentUser.name || currentUser.fullName || 'C').slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{currentUser.name || currentUser.fullName}</strong>
              <div className="muted">{currentUser.role}</div>
            </div>
          </div>

          <div className="summary-box">
            <strong>Provider summary</strong>
            <ul>
              <li>{summary.activePatients} patients</li>
              <li>{summary.pendingAppointments} pending appointments</li>
              <li>{summary.pendingAccess} access requests</li>
            </ul>
          </div>
        </aside>

        <main className="main-panel">
          <div className="summary-grid">
            <div className="card summary-card">
              <div className="card-head">
                <h3>Patients</h3>
                <span className="status-badge success">{summary.activePatients}</span>
              </div>
              <p>{patientList.length} active records</p>
            </div>

            <div className="card summary-card">
              <div className="card-head">
                <h3>Pending approvals</h3>
                <span className="status-badge warning">{summary.pendingAccess}</span>
              </div>
              <p>Access to medical cards</p>
            </div>

            <div className="card summary-card">
              <div className="card-head">
                <h3>SOS alerts</h3>
                <span className="status-badge alert">{sosAlerts.length}</span>
              </div>
              <p>Local safety notifications only</p>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Update patient record</h3>
            </div>
            <form className="provider-form" onSubmit={handleStaffRecordUpdate}>
              <label>
                Patient
                <select value={staffRecordForm.patientId} onChange={(event) => setStaffRecordForm((previous) => ({ ...previous, patientId: event.target.value }))}>
                  <option value="">Select patient</option>
                  {patientList.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                  ))}
                </select>
              </label>
              <label>
                Allergies
                <input value={staffRecordForm.allergies} onChange={(event) => setStaffRecordForm((previous) => ({ ...previous, allergies: event.target.value }))} placeholder="Penicillin, Shellfish" />
              </label>
              <label>
                Chronic conditions
                <input value={staffRecordForm.chronicConditions} onChange={(event) => setStaffRecordForm((previous) => ({ ...previous, chronicConditions: event.target.value }))} placeholder="Asthma, Hypertension" />
              </label>
              <label>
                Current medications
                <input value={staffRecordForm.currentMedications} onChange={(event) => setStaffRecordForm((previous) => ({ ...previous, currentMedications: event.target.value }))} placeholder="Metformin, Salbutamol" />
              </label>
              <label>
                Clinical note
                <textarea value={staffRecordForm.notes} onChange={(event) => setStaffRecordForm((previous) => ({ ...previous, notes: event.target.value }))} rows={4} />
              </label>
              <button type="submit" className="primary-btn">{t('updateSuccessful', 'Update successful')}</button>
            </form>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Pending medical card access</h3>
            </div>
            <ul className="request-list">
              {requestList.filter((request) => request.status === 'Pending').length === 0 && <li>No pending access requests.</li>}
              {requestList.filter((request) => request.status === 'Pending').map((request) => (
                <li key={request.id}>
                  <strong>{request.patientName}</strong>
                  <span>{request.requestedCardId}</span>
                  <span>{formatDate(request.requestedAt)}</span>
                  <button className="primary-btn" onClick={() => handleApproveRequest(request.id)}>Approve</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Hospital SOS alerts</h3>
            </div>
            <ul className="request-list">
              {sosAlerts.length === 0 && <li>No local alerts yet.</li>}
              {sosAlerts.map((alert) => (
                <li key={alert.id}>
                  <strong>{alert.patientName}</strong>
                  <span>{alert.text}</span>
                  <span>{formatDate(alert.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      {sosActive && (
        <div className="sos-overlay" role="alertdialog" aria-live="assertive" aria-modal="true">
          <div className="sos-card">
            <div className="eyebrow">Emergency local alert</div>
            <h2>Local SOS active</h2>
            <p>No emergency service is connected yet.</p>
            <div className="sos-timer" aria-live="polite">{sosTimer}s</div>
            <button className="safe-btn" onClick={handleSafe}>{t('iAmSafe', 'I AM SAFE')}</button>
          </div>
        </div>
      )}
    </div>
  );

  return currentUser && currentUser.role === 'staff' ? renderStaffDashboard() : renderPatientDashboard();
}

export default App;


