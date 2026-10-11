import { useEffect, useMemo, useState } from 'react';
import { buildDemoState, LANGUAGE_OPTIONS } from './data/syntheticData';
import { loadAppState, saveAppState } from './lib/storage';
import { getDemoTranslation, readAloud } from './lib/bhasini';

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const normalizeAppState = (incoming) => {
  const seed = buildDemoState();
  if (!incoming || typeof incoming !== 'object') {
    return seed;
  }

  return {
    ...seed,
    ...incoming,
    language: incoming.language || seed.language,
    currentUser: incoming.currentUser || null,
    patients: Array.isArray(incoming.patients) ? incoming.patients : seed.patients,
    staff: Array.isArray(incoming.staff) ? incoming.staff : seed.staff,
    providers: Array.isArray(incoming.providers) ? incoming.providers : seed.providers,
    appointments: Array.isArray(incoming.appointments) ? incoming.appointments : seed.appointments,
    requests: Array.isArray(incoming.requests)
      ? incoming.requests
      : Array.isArray(incoming.medicalCardRequests)
        ? incoming.medicalCardRequests
        : seed.requests,
    medicalCardRequests: Array.isArray(incoming.requests)
      ? incoming.requests
      : Array.isArray(incoming.medicalCardRequests)
        ? incoming.medicalCardRequests
        : seed.requests,
    sosAlerts: Array.isArray(incoming.sosAlerts) ? incoming.sosAlerts : seed.sosAlerts,
    chatHistory: Array.isArray(incoming.chatHistory) ? incoming.chatHistory : seed.chatHistory,
    chatTopics: Array.isArray(incoming.chatTopics) ? incoming.chatTopics : seed.chatTopics,
  };
};

const getDisplayName = (user) => {
  if (!user) return 'User';
  return user.fullName || user.facilityName || user.name || 'User';
};

const defaultPatientForm = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  password: '',
};

const defaultHospitalForm = {
  facilityName: '',
  contactName: '',
  email: '',
  phone: '',
  password: '',
  facilityType: 'Clinic',
};

function App() {
  const [appState, setAppState] = useState(() => normalizeAppState(loadAppState()));
  const [selectedRole, setSelectedRole] = useState('patient');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ identifier: '', password: '' });
  const [patientForm, setPatientForm] = useState(defaultPatientForm);
  const [hospitalForm, setHospitalForm] = useState(defaultHospitalForm);
  const [activeTab, setActiveTab] = useState('overview');
  const [requestForm, setRequestForm] = useState({ patientId: '', purpose: 'Care coordination review', notes: '' });
  const [toast, setToast] = useState(null);
  const [fontScale, setFontScale] = useState(1);
  const [sosTimer, setSosTimer] = useState(30);
  const [sosActive, setSosActive] = useState(false);

  const currentUser = appState.currentUser;
  const currentLanguageCode = appState.language || 'en';
  const patientList = useMemo(() => appState.patients || [], [appState.patients]);
  const hospitalList = useMemo(() => appState.staff || [], [appState.staff]);
  const requestList = useMemo(() => appState.requests || [], [appState.requests]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const t = (key, fallback) => getDemoTranslation(key, currentLanguageCode) || fallback || key;

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!sosActive) return undefined;
    const interval = setInterval(() => {
      setSosTimer((previous) => (previous <= 1 ? 0 : previous - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [sosActive]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'hospital') return;
    if (!requestForm.patientId && patientList.length > 0) {
      setRequestForm((previous) => ({ ...previous, patientId: patientList[0].id }));
    }
  }, [currentUser, patientList, requestForm.patientId]);

  const patientIncomingRequests = currentUser?.role === 'patient'
    ? requestList.filter((request) => request.patientId === currentUser.id).sort((a, b) => new Date(b.createdAt || b.requestedAt || 0) - new Date(a.createdAt || a.requestedAt || 0))
    : [];

  const hospitalOutgoingRequests = currentUser?.role === 'hospital'
    ? requestList.filter((request) => request.hospitalId === currentUser.id).sort((a, b) => new Date(b.createdAt || b.requestedAt || 0) - new Date(a.createdAt || a.requestedAt || 0))
    : [];

  const handleLogin = (event) => {
    event.preventDefault();

    const identifier = authForm.identifier.trim().toLowerCase();
    const password = authForm.password.trim();

    if (!identifier || !password) {
      showToast('Please enter your email or username and password.', 'error');
      return;
    }

    const accountList = selectedRole === 'patient' ? patientList : hospitalList;
    const match = accountList.find((account) => {
      const email = (account.email || '').toLowerCase();
      const username = (account.username || '').toLowerCase();
      return (email === identifier || username === identifier) && account.password === password;
    });

    if (!match) {
      showToast('Incorrect login details for this role. Please try again.', 'error');
      return;
    }

    setAppState((previous) => ({ ...previous, currentUser: match }));
    setAuthForm({ identifier: '', password: '' });
    setActiveTab('overview');
    showToast(`Welcome back, ${getDisplayName(match)}.`, 'success');
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (selectedRole === 'patient') {
      const name = patientForm.fullName.trim();
      const email = patientForm.email.trim().toLowerCase();
      const phone = patientForm.phone.trim();
      const dob = patientForm.dob;
      const password = patientForm.password.trim();

      if (!name || !email || !phone || !dob || !password) {
        showToast('Please complete all required patient fields.', 'error');
        return;
      }

      const existingEmail = patientList.some((patient) => (patient.email || '').toLowerCase() === email);
      if (existingEmail) {
        showToast('An account with that email already exists.', 'error');
        return;
      }

      const usernameSeed = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'patient';
      const newPatient = {
        id: `PATIENT_${Date.now()}`,
        username: `${usernameSeed}_${Math.floor(Math.random() * 90 + 10)}`,
        password,
        email,
        fullName: name,
        phone,
        dob,
        gender: 'Not specified',
        bloodGroup: 'Unknown',
        preferredLanguage: 'English',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        emergencyContact: 'Not provided',
        emergencyContactNumber: 'Not provided',
        role: 'patient',
        medicalCard: { id: `MC-${Date.now()}`, status: 'Active', consentToShareRecords: false },
      };

      setAppState((previous) => ({
        ...previous,
        patients: [...previous.patients, newPatient],
        currentUser: newPatient,
      }));
      setPatientForm(defaultPatientForm);
      setAuthMode('login');
      showToast('Patient account created successfully.', 'success');
      return;
    }

    const facilityName = hospitalForm.facilityName.trim();
    const contactName = hospitalForm.contactName.trim();
    const email = hospitalForm.email.trim().toLowerCase();
    const phone = hospitalForm.phone.trim();
    const password = hospitalForm.password.trim();

    if (!facilityName || !contactName || !email || !phone || !password) {
      showToast('Please complete all required clinic information.', 'error');
      return;
    }

    const existingEmail = hospitalList.some((member) => (member.email || '').toLowerCase() === email);
    if (existingEmail) {
      showToast('A clinic account with that email already exists.', 'error');
      return;
    }

    const usernameSeed = facilityName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'clinic';
    const newHospital = {
      id: `HOSPITAL_${Date.now()}`,
      username: `${usernameSeed}_${Math.floor(Math.random() * 90 + 10)}`,
      password,
      email,
      fullName: contactName,
      name: contactName,
      facilityName,
      hospital: facilityName,
      role: 'hospital',
      specialty: hospitalForm.facilityType || 'Healthcare',
      phone,
      providerId: `PROV_${Date.now()}`,
    };

    setAppState((previous) => ({
      ...previous,
      staff: [...previous.staff, newHospital],
      currentUser: newHospital,
    }));
    setHospitalForm(defaultHospitalForm);
    setAuthMode('login');
    showToast('Clinic account created successfully.', 'success');
  };

  const handleLogout = () => {
    setAppState((previous) => ({ ...previous, currentUser: null }));
    setActiveTab('overview');
    setAuthMode('login');
    setSelectedRole('patient');
    setSosActive(false);
    setSosTimer(30);
    showToast('Logged out successfully.', 'success');
  };

  const handleSendRequest = (event) => {
    event.preventDefault();

    if (!currentUser || currentUser.role !== 'hospital') {
      showToast('Only clinic accounts can send requests.', 'error');
      return;
    }

    const patient = patientList.find((person) => person.id === requestForm.patientId);
    if (!patient) {
      showToast('Please select a patient before sending the request.', 'error');
      return;
    }

    const purpose = requestForm.purpose.trim() || 'Care coordination review';
    const notes = requestForm.notes.trim();

    const duplicate = requestList.some(
      (request) => request.hospitalId === currentUser.id && request.patientId === patient.id && request.status === 'Pending' && request.purpose === purpose,
    );

    if (duplicate) {
      showToast('A similar pending request is already active for this patient.', 'error');
      return;
    }

    const createdRequest = {
      id: `REQ_${Date.now()}`,
      hospitalId: currentUser.id,
      hospitalName: currentUser.facilityName || currentUser.name || 'Clinic',
      patientId: patient.id,
      patientName: patient.fullName,
      purpose,
      notes,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      requestedAt: new Date().toISOString(),
    };

    setAppState((previous) => ({
      ...previous,
      requests: [createdRequest, ...(previous.requests || [])],
      medicalCardRequests: [createdRequest, ...(previous.requests || [])],
    }));
    setRequestForm((previous) => ({ ...previous, purpose: 'Care coordination review', notes: '' }));
    showToast('Request sent to patient successfully.', 'success');
  };

  const handleRequestDecision = (requestId, nextStatus) => {
    const targetRequest = requestList.find((request) => request.id === requestId);
    if (!targetRequest) {
      showToast('That request could not be found.', 'error');
      return;
    }

    if (!currentUser || currentUser.role !== 'patient') {
      showToast('Only the patient can make this decision.', 'error');
      return;
    }

    if (targetRequest.patientId !== currentUser.id) {
      showToast('This request is not addressed to your account.', 'error');
      return;
    }

    if (targetRequest.status !== 'Pending') {
      showToast('A decision has already been recorded for this request.', 'error');
      return;
    }

    setAppState((previous) => ({
      ...previous,
      requests: (previous.requests || []).map((request) => (
        request.id === requestId
          ? {
              ...request,
              status: nextStatus,
              decisionAt: new Date().toISOString(),
              decisionBy: currentUser.id,
            }
          : request
      )),
      medicalCardRequests: (previous.requests || []).map((request) => (
        request.id === requestId
          ? {
              ...request,
              status: nextStatus,
              decisionAt: new Date().toISOString(),
              decisionBy: currentUser.id,
            }
          : request
      )),
    }));

    showToast(`Request ${nextStatus.toLowerCase()} successfully.`, 'success');
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
          patientName: getDisplayName(currentUser),
          text: 'Local safety alert activated. No emergency service is connected yet.',
          timestamp: new Date().toISOString(),
        },
        ...(previous.sosAlerts || []),
      ],
    }));
  };

  const handleSafe = () => {
    setSosActive(false);
    setSosTimer(30);
    showToast('Local SOS alert cleared.', 'success');
  };

  const renderAuthPage = () => (
    <div className="app-shell">
      <div className="auth-page">
        <div className="auth-card" aria-labelledby="carebridge-title">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">✚</div>
            <div>
              <div className="eyebrow">CareBridge</div>
              <h1 id="carebridge-title">Accessible care coordination</h1>
            </div>
          </div>

          <div className="info-banner" role="status" aria-live="polite">
            {t('demoNote', 'Prototype authentication is enabled for the demonstration. Your data is stored locally in the browser only.')}
          </div>

          <div className="role-grid" aria-label={t('loginMode', 'Select a role')}>
            <button
              type="button"
              className={`role-option ${selectedRole === 'hospital' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('hospital')}
            >
              <span className="role-title">HOSPITAL / CLINICS</span>
              <span className="role-subtitle">Manage patient access and referrals</span>
            </button>
            <button
              type="button"
              className={`role-option ${selectedRole === 'patient' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('patient')}
            >
              <span className="role-title">INDIVIDUAL / PATIENT</span>
              <span className="role-subtitle">Review, approve, and track care access</span>
            </button>
          </div>

          <div className="auth-mode-switch" aria-label="Authentication mode">
            <button
              type="button"
              className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              LOGIN
            </button>
            <button
              type="button"
              className={`mode-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              REGISTER
            </button>
          </div>

          {authMode === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="field">
                <span>Email or username</span>
                <input
                  type="text"
                  value={authForm.identifier}
                  onChange={(event) => setAuthForm((previous) => ({ ...previous, identifier: event.target.value }))}
                  placeholder="Enter your email or username"
                  aria-label="Email or username"
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm((previous) => ({ ...previous, password: event.target.value }))}
                  placeholder="Enter your password"
                  aria-label="Password"
                />
              </label>

              <button type="submit" className="primary-btn">{selectedRole === 'hospital' ? 'Access clinic portal' : 'Access patient portal'}</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              {selectedRole === 'patient' ? (
                <>
                  <label className="field">
                    <span>Full name</span>
                    <input
                      value={patientForm.fullName}
                      onChange={(event) => setPatientForm((previous) => ({ ...previous, fullName: event.target.value }))}
                      placeholder="Your full name"
                    />
                  </label>

                  <div className="field-row">
                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={patientForm.email}
                        onChange={(event) => setPatientForm((previous) => ({ ...previous, email: event.target.value }))}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className="field">
                      <span>Phone number</span>
                      <input
                        value={patientForm.phone}
                        onChange={(event) => setPatientForm((previous) => ({ ...previous, phone: event.target.value }))}
                        placeholder="+91 98xxx xxxxx"
                      />
                    </label>
                  </div>

                  <div className="field-row">
                    <label className="field">
                      <span>Date of birth</span>
                      <input
                        type="date"
                        value={patientForm.dob}
                        onChange={(event) => setPatientForm((previous) => ({ ...previous, dob: event.target.value }))}
                      />
                    </label>
                    <label className="field">
                      <span>Create password</span>
                      <input
                        type="password"
                        value={patientForm.password}
                        onChange={(event) => setPatientForm((previous) => ({ ...previous, password: event.target.value }))}
                        placeholder="Create a secure password"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label className="field">
                    <span>Facility name</span>
                    <input
                      value={hospitalForm.facilityName}
                      onChange={(event) => setHospitalForm((previous) => ({ ...previous, facilityName: event.target.value }))}
                      placeholder="City Care Clinic"
                    />
                  </label>

                  <div className="field-row">
                    <label className="field">
                      <span>Contact person</span>
                      <input
                        value={hospitalForm.contactName}
                        onChange={(event) => setHospitalForm((previous) => ({ ...previous, contactName: event.target.value }))}
                        placeholder="Dr. Aditi Nair"
                      />
                    </label>
                    <label className="field">
                      <span>Clinic type</span>
                      <select
                        value={hospitalForm.facilityType}
                        onChange={(event) => setHospitalForm((previous) => ({ ...previous, facilityType: event.target.value }))}
                      >
                        <option value="Clinic">Clinic</option>
                        <option value="Hospital">Hospital</option>
                        <option value="Diagnostic Centre">Diagnostic Centre</option>
                        <option value="Community Health">Community Health</option>
                      </select>
                    </label>
                  </div>

                  <div className="field-row">
                    <label className="field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={hospitalForm.email}
                        onChange={(event) => setHospitalForm((previous) => ({ ...previous, email: event.target.value }))}
                        placeholder="care@facility.com"
                      />
                    </label>
                    <label className="field">
                      <span>Phone number</span>
                      <input
                        value={hospitalForm.phone}
                        onChange={(event) => setHospitalForm((previous) => ({ ...previous, phone: event.target.value }))}
                        placeholder="+91 98xxx xxxxx"
                      />
                    </label>
                  </div>

                  <label className="field">
                    <span>Create password</span>
                    <input
                      type="password"
                      value={hospitalForm.password}
                      onChange={(event) => setHospitalForm((previous) => ({ ...previous, password: event.target.value }))}
                      placeholder="Create a secure password"
                    />
                  </label>
                </>
              )}

              <button type="submit" className="primary-btn">
                {selectedRole === 'hospital' ? 'Create clinic account' : 'Create patient account'}
              </button>
            </form>
          )}
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="app-shell">
      <header className="top-header">
        <div className="header-brand">
          <span className="brand-badge">CB</span>
          <div>
            <h1>CareBridge</h1>
            <p>{t('patientTitle', 'Patient portal')}</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => readAloud('CareBridge patient portal.', currentLanguageCode)}
          >
            Read aloud
          </button>
          <button type="button" className="icon-btn" onClick={() => setFontScale((previous) => Math.max(previous - 0.1, 0.9))}>A-</button>
          <button type="button" className="icon-btn" onClick={() => setFontScale((previous) => Math.min(previous + 0.1, 1.4))}>A+</button>
          <select
            value={currentLanguageCode}
            onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}
            className="header-select"
            aria-label="Select language"
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
          <button type="button" className="sos-btn" onClick={handleSosActivate}>🚨 SOS</button>
          <button type="button" className="logout-btn" onClick={handleLogout}>LOG OUT</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="sidebar-panel">
          <div className="user-card">
            <div className="avatar">{getDisplayName(currentUser).slice(0, 1).toUpperCase()}</div>
            <div className="user-meta">
              <h3>{getDisplayName(currentUser)}</h3>
              <p>{currentUser.bloodGroup || 'Patient'} • {currentUser.preferredLanguage || 'English'}</p>
            </div>
          </div>

          <nav className="nav-menu" aria-label="Patient navigation">
            <button type="button" className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('overview')}>Overview</button>
            <button type="button" className={activeTab === 'health' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('health')}>Medical card</button>
            <button type="button" className={activeTab === 'requests' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('requests')}>Incoming requests</button>
            <button type="button" className={activeTab === 'hospitals' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('hospitals')}>Hospital records</button>
            <button type="button" className={activeTab === 'appointments' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('appointments')}>Appointments</button>
          </nav>

          <div className="summary-card">
            <h4>Health summary</h4>
            <ul>
              <li>🚨 {currentUser.allergies?.length || 0} allergies</li>
              <li>💊 {currentUser.chronicConditions?.length || 0} conditions</li>
              <li>💉 {currentUser.currentMedications?.length || 0} medications</li>
            </ul>
          </div>
        </aside>

        <main className="main-panel">
          {activeTab === 'overview' && (
            <section className="card">
              <div className="card-header">
                <h2>Patient overview</h2>
                <span className="status-pill success">Active</span>
              </div>
              <div className="info-grid">
                <div className="info-block"><strong>Full name</strong><span>{currentUser.fullName}</span></div>
                <div className="info-block"><strong>Date of birth</strong><span>{formatDate(currentUser.dob)}</span></div>
                <div className="info-block"><strong>Blood group</strong><span>{currentUser.bloodGroup}</span></div>
                <div className="info-block"><strong>Gender</strong><span>{currentUser.gender}</span></div>
                <div className="info-block"><strong>Emergency contact</strong><span>{currentUser.emergencyContact}</span></div>
                <div className="info-block"><strong>Emergency number</strong><span>{currentUser.emergencyContactNumber}</span></div>
              </div>
            </section>
          )}

          {activeTab === 'health' && (
            <section className="card">
              <div className="card-header">
                <h2>Medical card</h2>
              </div>

              <div className="section">
                <h3>Allergies</h3>
                <div className="tag-list">
                  {(currentUser.allergies || []).length === 0 ? (
                    <p className="empty-state">No allergies recorded</p>
                  ) : (
                    (currentUser.allergies || []).map((allergy) => (
                      <span key={allergy} className="tag">{allergy}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="section">
                <h3>Chronic conditions</h3>
                <p>{(currentUser.chronicConditions || []).join(', ') || 'None recorded'}</p>
              </div>

              <div className="section">
                <h3>Current medications</h3>
                <p>{(currentUser.currentMedications || []).join(', ') || 'None recorded'}</p>
              </div>
            </section>
          )}

          {activeTab === 'requests' && (
            <section className="card">
              <div className="card-header">
                <h2>Incoming requests</h2>
                <span className="status-pill info">{patientIncomingRequests.length}</span>
              </div>

              {patientIncomingRequests.length === 0 ? (
                <div className="empty-state-panel">
                  <h3>No incoming requests yet</h3>
                  <p>This panel shows requests sent by hospitals and clinics that require your decision. You will be able to accept or deny them here.</p>
                </div>
              ) : (
                <div className="request-list">
                  {patientIncomingRequests.map((request) => (
                    <div key={request.id} className="request-card">
                      <div className="request-card-header">
                        <div>
                          <strong>{request.hospitalName || 'Healthcare provider'}</strong>
                          <p>{request.purpose}</p>
                        </div>
                        <span className={`status-pill ${request.status.toLowerCase()}`}>{request.status}</span>
                      </div>

                      <div className="request-meta">
                        <span>{formatDate(request.createdAt || request.requestedAt)}</span>
                        {request.notes ? <span>{request.notes}</span> : <span>No additional notes</span>}
                      </div>

                      {request.status === 'Pending' ? (
                        <div className="request-actions">
                          <button type="button" className="action-btn accept" onClick={() => handleRequestDecision(request.id, 'Accepted')}>ACCEPT</button>
                          <button type="button" className="action-btn deny" onClick={() => handleRequestDecision(request.id, 'Denied')}>DENY</button>
                        </div>
                      ) : (
                        <div className="request-summary">Decision recorded on {formatDate(request.decisionAt)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'hospitals' && (
            <section className="card">
              <div className="card-header">
                <h2>Hospital and clinic records</h2>
              </div>
              <div className="section">
                <h3>Partner facilities</h3>
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Facility</th>
                      <th>Doctor</th>
                      <th>Specialty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitalList.slice(0, 4).map((provider) => (
                      <tr key={provider.id}>
                        <td>{provider.facilityName || provider.hospital || 'Clinic'}</td>
                        <td>{provider.name || provider.fullName}</td>
                        <td>{provider.specialty || 'General care'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'appointments' && (
            <section className="card">
              <div className="card-header">
                <h2>Your appointments</h2>
              </div>
              {(appState.appointments || []).filter((appointment) => appointment.patientId === currentUser.id).length === 0 ? (
                <div className="empty-state-panel">
                  <h3>No appointments scheduled</h3>
                  <p>Bookings from your care team will appear here.</p>
                </div>
              ) : (
                <div className="appointment-list">
                  {(appState.appointments || []).filter((appointment) => appointment.patientId === currentUser.id).map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <div>
                        <strong>{appointment.doctorName}</strong>
                        <p>{appointment.specialty}</p>
                      </div>
                      <div className="appointment-meta">
                        <span>{appointment.time}</span>
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <span className={`status-pill ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      {sosActive && (
        <div className="sos-overlay" role="alertdialog" aria-modal="true" aria-labelledby="sos-title">
          <div className="sos-card">
            <h2 id="sos-title">🚨 Local SOS active</h2>
            <p>No emergency service is connected yet.</p>
            <div className="sos-timer">{sosTimer}s</div>
            <button type="button" className="safe-btn" onClick={handleSafe}>✓ I AM SAFE</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHospitalDashboard = () => (
    <div className="app-shell">
      <header className="top-header">
        <div className="header-brand">
          <span className="brand-badge">CB</span>
          <div>
            <h1>CareBridge</h1>
            <p>Care team dashboard</p>
          </div>
        </div>

        <div className="header-actions">
          <button type="button" className="icon-btn" onClick={() => readAloud('CareBridge clinic dashboard.', currentLanguageCode)}>Read aloud</button>
          <button type="button" className="icon-btn" onClick={() => setFontScale((previous) => Math.max(previous - 0.1, 0.9))}>A-</button>
          <button type="button" className="icon-btn" onClick={() => setFontScale((previous) => Math.min(previous + 0.1, 1.4))}>A+</button>
          <select
            value={currentLanguageCode}
            onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}
            className="header-select"
            aria-label="Select language"
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
          <button type="button" className="logout-btn" onClick={handleLogout}>LOG OUT</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="sidebar-panel">
          <div className="user-card">
            <div className="avatar">{(currentUser.facilityName || currentUser.name || 'C').slice(0, 1).toUpperCase()}</div>
            <div className="user-meta">
              <h3>{currentUser.facilityName || currentUser.name}</h3>
              <p>{currentUser.specialty || 'Healthcare provider'}</p>
            </div>
          </div>

          <nav className="nav-menu" aria-label="Hospital navigation">
            <button type="button" className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('overview')}>Overview</button>
            <button type="button" className={activeTab === 'patients' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('patients')}>Patients</button>
            <button type="button" className={activeTab === 'requests' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('requests')}>Requests</button>
            <button type="button" className={activeTab === 'alerts' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab('alerts')}>SOS alerts</button>
          </nav>
        </aside>

        <main className="main-panel">
          {activeTab === 'overview' && (
            <section className="card">
              <div className="card-header">
                <h2>Facility overview</h2>
                <span className="status-pill success">Online</span>
              </div>

              <div className="summary-grid">
                <div className="mini-card">
                  <strong>{patientList.length}</strong>
                  <span>Patients in care</span>
                </div>
                <div className="mini-card">
                  <strong>{hospitalOutgoingRequests.filter((request) => request.status === 'Pending').length}</strong>
                  <span>Pending requests</span>
                </div>
                <div className="mini-card">
                  <strong>{hospitalOutgoingRequests.filter((request) => request.status !== 'Pending').length}</strong>
                  <span>Responses received</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-block"><strong>Facility</strong><span>{currentUser.facilityName || currentUser.hospital}</span></div>
                <div className="info-block"><strong>Contact</strong><span>{currentUser.name || currentUser.fullName}</span></div>
                <div className="info-block"><strong>Email</strong><span>{currentUser.email}</span></div>
                <div className="info-block"><strong>Phone</strong><span>{currentUser.phone || 'Not provided'}</span></div>
              </div>
            </section>
          )}

          {activeTab === 'patients' && (
            <section className="card">
              <div className="card-header">
                <h2>Patient list</h2>
              </div>
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Blood group</th>
                    <th>Allergies</th>
                    <th>Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.fullName}</td>
                      <td>{patient.bloodGroup || 'Unknown'}</td>
                      <td>{(patient.allergies || []).join(', ') || 'None'}</td>
                      <td>{patient.chronicConditions?.[0] || 'General care'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === 'requests' && (
            <section className="card request-panel">
              <div className="card-header">
                <h2>Send and track requests</h2>
              </div>

              <form onSubmit={handleSendRequest} className="request-form">
                <label className="field">
                  <span>Select patient</span>
                  <select
                    value={requestForm.patientId}
                    onChange={(event) => setRequestForm((previous) => ({ ...previous, patientId: event.target.value }))}
                  >
                    <option value="">Choose a patient</option>
                    {patientList.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Request purpose</span>
                  <input
                    value={requestForm.purpose}
                    onChange={(event) => setRequestForm((previous) => ({ ...previous, purpose: event.target.value }))}
                    placeholder="Care review, referral, or follow-up"
                  />
                </label>

                <label className="field">
                  <span>Notes for patient</span>
                  <textarea
                    rows="4"
                    value={requestForm.notes}
                    onChange={(event) => setRequestForm((previous) => ({ ...previous, notes: event.target.value }))}
                    placeholder="Include the reason for this request and any relevant details."
                  />
                </label>

                <button type="submit" className="primary-btn">Send request</button>
              </form>

              <div className="section">
                <h3>Requests sent</h3>
                {hospitalOutgoingRequests.length === 0 ? (
                  <div className="empty-state-panel compact">
                    <p>No clinic requests sent yet.</p>
                  </div>
                ) : (
                  <div className="request-list">
                    {hospitalOutgoingRequests.map((request) => (
                      <div key={request.id} className="request-card">
                        <div className="request-card-header">
                          <div>
                            <strong>{request.patientName}</strong>
                            <p>{request.purpose}</p>
                          </div>
                          <span className={`status-pill ${request.status.toLowerCase()}`}>{request.status}</span>
                        </div>
                        <div className="request-meta">
                          <span>{formatDate(request.createdAt || request.requestedAt)}</span>
                          <span>{request.notes || 'No notes provided'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'alerts' && (
            <section className="card">
              <div className="card-header">
                <h2>SOS alerts</h2>
              </div>
              {(appState.sosAlerts || []).length === 0 ? (
                <div className="empty-state-panel">
                  <h3>No active alerts</h3>
                  <p>Patient emergency alerts will appear here when triggered.</p>
                </div>
              ) : (
                <div className="request-list">
                  {(appState.sosAlerts || []).map((alert) => (
                    <div key={alert.id} className="request-card alert-card">
                      <div className="request-card-header">
                        <div>
                          <strong>{alert.patientName}</strong>
                          <p>{alert.text}</p>
                        </div>
                      </div>
                      <div className="request-meta">
                        <span>{formatDate(alert.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  );

  if (!currentUser) {
    return renderAuthPage();
  }

  return currentUser.role === 'hospital' ? renderHospitalDashboard() : renderPatientDashboard();
}

export default App;

