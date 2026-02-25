'use client';

import { useEffect, useState, useCallback, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.saubh.tech/api';

const GENDER_MAP: Record<string, string> = { M: 'Male', F: 'Female', T: 'Transgender', O: 'Other' };
const GENDER_OPTIONS = Object.entries(GENDER_MAP);

const USERTYPE_MAP: Record<string, string> = { BO: 'Business Owner', CL: 'Client', GW: 'Gig Worker' };
const USERTYPE_OPTIONS = Object.entries(USERTYPE_MAP);

const TOTAL_REQUIRED = 16;

// ─── Types ────────────────────────────────────────────────────────────────

interface UserProfile {
  userid: string; whatsapp: string; fname: string; lname: string | null;
  email: string | null; phone: string | null; pic: string | null;
  gender: string | null; dob: string | null; langid: number[];
  qualification: string | null; experience: string | null; usertype: string;
  countryCode: string | null; stateid: number | null; districtid: number | null;
  pincode: string | null; placeid: string | null;
}

interface MasterItem { [key: string]: any; }

// ─── Helpers ──────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function calcProgress(u: {
  fname?: string; lname?: string; email?: string; phone?: string;
  gender?: string; dob?: string; langid?: number[]; qualification?: string;
  experience?: string; usertype?: string; stateid?: number | null;
  districtid?: number | null; pincode?: string; placeid?: number | null;
  pic?: string | null;
}, photoFile: File | null): number {
  let filled = 0;
  if (u.fname) filled++;
  if (u.lname) filled++;
  if (u.email) filled++;
  if (u.phone) filled++;
  if (u.gender) filled++;
  if (u.dob) filled++;
  if (u.langid && u.langid.length > 0) filled++;
  if (u.qualification) filled++;
  if (u.experience) filled++;
  if (u.usertype) filled++;
  filled++; // countryCode always 'IN'
  if (u.stateid) filled++;
  if (u.districtid) filled++;
  if (u.pincode) filled++;
  if (u.placeid || (typeof (u as any).customPlace === 'string' && (u as any).customPlace)) filled++;
  if (u.pic || photoFile) filled++;
  return Math.round((filled / TOTAL_REQUIRED) * 100);
}

function progressColor(p: number): string {
  if (p < 40) return '#ef4444';
  if (p < 70) return '#f59e0b';
  return '#22c55e';
}

// ─── Component ────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  // Auth + loading
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User profile data (form state)
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [langid, setLangid] = useState<number[]>([]);
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [usertype, setUsertype] = useState('GW');
  const [stateid, setStateid] = useState<number | null>(null);
  const [districtid, setDistrictid] = useState<number | null>(null);
  const [pincode, setPincode] = useState('');
  const [placeid, setPlaceid] = useState<number | null>(null);
  const [customPlace, setCustomPlace] = useState('');
  const [showCustomPlace, setShowCustomPlace] = useState(false);
  const [pic, setPic] = useState<string | null>(null);

  // Photo: selfie camera + upload fallback
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Master data for dropdowns
  const [languages, setLanguages] = useState<MasterItem[]>([]);
  const [states, setStates] = useState<MasterItem[]>([]);
  const [districts, setDistricts] = useState<MasterItem[]>([]);
  const [pincodes, setPincodes] = useState<MasterItem[]>([]);
  const [places, setPlaces] = useState<MasterItem[]>([]);
  const [langSearch, setLangSearch] = useState('');
  const [langDropOpen, setLangDropOpen] = useState(false);

  // OTP states — mobile (4-digit)
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '']);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileCountdown, setMobileCountdown] = useState(0);
  const mobileOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP states — email (6-digit)
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Countdown timers ──────────────────────────────────────────────

  useEffect(() => {
    if (mobileCountdown <= 0) return;
    const t = setInterval(() => setMobileCountdown(c => c <= 1 ? 0 : c - 1), 1000);
    return () => clearInterval(t);
  }, [mobileCountdown]);

  useEffect(() => {
    if (emailCountdown <= 0) return;
    const t = setInterval(() => setEmailCountdown(c => c <= 1 ? 0 : c - 1), 1000);
    return () => clearInterval(t);
  }, [emailCountdown]);

  // ─── Fetch helpers ──────────────────────────────────────────────────

  const authFetch = useCallback(async (url: string, opts?: RequestInit) => {
    return fetch(url, {
      ...opts,
      headers: { ...opts?.headers, Authorization: `Bearer ${token}` },
    });
  }, [token]);

  // ─── Load profile on mount ─────────────────────────────────────────

  useEffect(() => {
    const t = getCookie('saubh_token');
    if (!t) { router.replace(`/${locale}/login`); return; }
    setToken(t);

    (async () => {
      try {
        const res = await fetch(`${API}/auth/profile`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (!res.ok) { router.replace(`/${locale}/login`); return; }
        const data = await res.json();
        if (data.isComplete) { router.replace(`/${locale}/dashboard`); return; }

        const u = data.user as UserProfile;
        setFname(u.fname || '');
        setLname(u.lname || '');
        setWhatsapp(u.whatsapp || '');
        setEmail(u.email || '');
        setPhone(u.phone || '');
        setGender(u.gender || '');
        setDob(u.dob ? u.dob.split('T')[0] : '');
        setLangid(u.langid || []);
        setQualification(u.qualification || '');
        setExperience(u.experience || '');
        setUsertype(u.usertype || 'GW');
        setStateid(u.stateid || null);
        setDistrictid(u.districtid || null);
        setPincode(u.pincode || '');
        setPlaceid(u.placeid ? Number(u.placeid) : null);
        setPic(u.pic || null);

        // Restore verification status from backend
        if (data.emailVerified) setEmailVerified(true);
        if (data.phoneVerified) setMobileVerified(true);
      } catch { router.replace(`/${locale}/login`); return; }
      setLoading(false);
    })();
  }, [locale, router]);

  // ─── Load master data ──────────────────────────────────────────────

  useEffect(() => {
    fetch(`${API}/master/geo/languages`).then(r => r.json()).then(d => setLanguages(d.data || [])).catch(() => {});
    fetch(`${API}/master/geo/states`).then(r => r.json()).then(d => setStates(d.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setDistricts([]); setPincodes([]); setPlaces([]);
    if (!stateid) return;
    fetch(`${API}/master/geo/districts?stateId=${stateid}`).then(r => r.json()).then(d => setDistricts(d.data || [])).catch(() => {});
  }, [stateid]);

  useEffect(() => {
    setPincodes([]); setPlaces([]);
    if (!districtid) return;
    fetch(`${API}/master/geo/pincodes?districtId=${districtid}`).then(r => r.json()).then(d => setPincodes(d.data || [])).catch(() => {});
  }, [districtid]);

  useEffect(() => {
    setPlaces([]);
    if (!pincode) return;
    fetch(`${API}/master/geo/places?pincode=${pincode}`).then(r => r.json()).then(d => setPlaces(d.data || [])).catch(() => {});
  }, [pincode]);

  // ─── Progress ──────────────────────────────────────────────────────

  const progress = calcProgress({
    fname, lname, email, phone, gender, dob, langid, qualification,
    experience, usertype, stateid, districtid, pincode, placeid, pic,
  }, photoFile);

  // ─── Selfie Camera ─────────────────────────────────────────────────

  const startCamera = async () => {
    setCameraError(false);
    setError('');
    // Stop any existing stream first (prevents "device busy")
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      }).catch(async (firstErr) => {
        // Retry once with relaxed constraints (fixes "Starting videoinput failed")
        console.warn('Camera first attempt failed, retrying with basic constraints...', firstErr);
        return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      });
      streamRef.current = stream;
      // Video element renders when cameraActive=true, so connect stream via useEffect
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access denied:', err);
      const msg = err?.message || String(err);
      setCameraError(true);
      // Show error to user instead of silent fallback
      if (msg.includes('Permission denied') || msg.includes('NotAllowedError')) {
        setError('Camera permission denied. Please allow camera access in your browser settings, or upload a photo instead.');
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFound')) {
        setError('No camera found on this device. Please upload a photo instead.');
      } else if (msg.includes('NotReadableError') || msg.includes('TrackStartError')) {
        setError('Camera is busy — close other tabs or apps using the camera, then try again. Or upload a photo below.');
      } else {
        setError(`Camera error: ${msg}. You can upload a photo instead.`);
      }
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('capturePhoto: refs missing', { video: !!videoRef.current, canvas: !!canvasRef.current });
      setError('Camera not ready. Please wait a moment and try again.');
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      // Try waiting briefly for metadata
      await new Promise(r => setTimeout(r, 500));
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError('Camera still loading. Please wait a moment and tap Capture again.');
        return;
      }
    }
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    // Center-crop to square
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    // Mirror for selfie
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const retakePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    startCamera();
  };

  // Connect stream to video element when camera becomes active
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      const v = videoRef.current;
      v.srcObject = streamRef.current;
      v.onloadedmetadata = () => {
        v.play().catch(() => {});
      };
    }
  }, [cameraActive]);

  // Cleanup camera on unmount + page visibility change
  useEffect(() => {
    const cleanup = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => { try { t.stop(); } catch {} });
        streamRef.current = null;
      }
      setCameraActive(false);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') cleanup();
    };
    const handleUnload = () => cleanup();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // ─── File upload fallback ──────────────────────────────────────────

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Photo must be under 5MB.'); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  // ─── OTP helpers: generic box input handler ────────────────────────

  const handleOtpBoxChange = (
    index: number, value: string, digits: number,
    otpArr: string[], setOtp: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    autoVerify?: () => void,
  ) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpArr];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < digits - 1) refs.current[index + 1]?.focus();
    if (value && index === digits - 1 && newOtp.every(d => d !== '') && autoVerify) autoVerify();
  };

  const handleOtpBoxKeyDown = (
    index: number, e: React.KeyboardEvent,
    otpArr: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  ) => {
    if (e.key === 'Backspace' && !otpArr[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handleOtpBoxPaste = (
    e: React.ClipboardEvent, digits: number,
    setOtp: (v: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    autoVerify?: () => void,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits);
    if (pasted.length === digits) {
      const arr = pasted.split('');
      setOtp(arr);
      refs.current[digits - 1]?.focus();
      if (autoVerify) autoVerify();
    }
  };

  // ─── Send OTP ──────────────────────────────────────────────────────

  const sendOtp = async (type: 'mobile' | 'email', value: string) => {
    if (!token || !value.trim()) return;
    const setL = type === 'mobile' ? setMobileLoading : setEmailLoading;
    const setSent = type === 'mobile' ? setMobileOtpSent : setEmailOtpSent;
    const setCD = type === 'mobile' ? setMobileCountdown : setEmailCountdown;
    setL(true);
    setError('');
    try {
      const res = await authFetch(`${API}/auth/profile/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: value.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setCD(data.expiresIn || 120);
        if (type === 'mobile') {
          setMobileOtp(['', '', '', '']);
          setTimeout(() => mobileOtpRefs.current[0]?.focus(), 100);
        } else {
          setEmailOtp(['', '', '', '', '', '']);
          setTimeout(() => emailOtpRefs.current[0]?.focus(), 100);
        }
      } else {
        setError(data.message || `Failed to send ${type} OTP.`);
      }
    } catch { setError('Network error.'); }
    setL(false);
  };

  // ─── Verify OTP ────────────────────────────────────────────────────

  const verifyOtp = async (type: 'mobile' | 'email', value: string, otpCode: string) => {
    if (!token || !otpCode.trim()) return;
    const setL = type === 'mobile' ? setMobileLoading : setEmailLoading;
    const setV = type === 'mobile' ? setMobileVerified : setEmailVerified;
    setL(true);
    try {
      const res = await authFetch(`${API}/auth/profile/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: value.trim(), otp: otpCode.trim() }),
      });
      if (res.ok) { setV(true); setError(''); }
      else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || `Invalid or expired ${type} OTP.`);
      }
    } catch { setError('Network error.'); }
    setL(false);
  };


  // ─── Auto-verify when all OTP digits are entered ───────────────────
  useEffect(() => {
    const code = emailOtp.join('');
    if (code.length === 6 && /^\d{6}$/.test(code) && !emailVerified && !emailLoading && emailOtpSent) {
      verifyOtp('email', email, code);
    }
  }, [emailOtp]);

  useEffect(() => {
    const code = mobileOtp.join('');
    if (code.length === 4 && /^\d{4}$/.test(code) && !mobileVerified && !mobileLoading && mobileOtpSent) {
      verifyOtp('mobile', phone, code);
    }
  }, [mobileOtp]);

  // ─── Submit ────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent, mode: 'draft' | 'complete' = 'complete') => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Basic validation — always required even for draft
    if (!fname.trim()) { setError('First name is required.'); return; }

    // Full validation only for "complete" mode
    if (mode === 'complete') {
      if (!lname.trim()) { setError('Last name is required.'); return; }
      if (!email.trim()) { setError('Email is required.'); return; }
      if (!emailVerified) { setError('Please verify your email to complete your profile.'); return; }
      if (!phone.trim()) { setError('Alternate mobile is required.'); return; }
      if (!mobileVerified) { setError('Please verify your mobile to complete your profile.'); return; }
      if (!gender) { setError('Gender is required.'); return; }
      if (!dob) { setError('Date of birth is required.'); return; }
      if (langid.length === 0) { setError('Select at least one language.'); return; }
      if (!qualification.trim()) { setError('Qualification is required.'); return; }
      if (!experience.trim()) { setError('Experience is required.'); return; }
      if (!usertype) { setError('Please select your role.'); return; }
      if (!stateid) { setError('State is required.'); return; }
      if (!districtid) { setError('District is required.'); return; }
      if (!pincode) { setError('Pin code is required.'); return; }
      if (!placeid && !customPlace.trim()) { setError('Place is required.'); return; }
      if (!pic && !photoFile) { setError('Please take a selfie or upload a photo.'); return; }
    }

    setSubmitting(true);

    try {
      // 1. Upload photo if selected
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        const photoRes = await authFetch(`${API}/auth/profile/photo`, { method: 'POST', body: fd });
        if (!photoRes.ok) { setError('Photo upload failed.'); setSubmitting(false); return; }
        // Update pic state after successful upload
        const photoData = await photoRes.json().catch(() => ({}));
        if (photoData.pic) setPic(photoData.pic);
      }

      // 2. Patch profile — include all filled fields
      const body: Record<string, any> = {
        fname: fname.trim(),
        usertype,
        countryCode: 'IN',
      };
      if (lname.trim()) body.lname = lname.trim();
      if (email.trim()) body.email = email.trim();
      if (phone.trim()) body.phone = phone.trim();
      if (gender) body.gender = gender;
      if (dob) body.dob = dob;
      if (langid.length > 0) body.langid = langid;
      if (qualification.trim()) body.qualification = qualification.trim();
      if (experience.trim()) body.experience = experience.trim();
      if (stateid) body.stateid = stateid;
      if (districtid) body.districtid = districtid;
      if (pincode) body.pincode = pincode;
      if (placeid) body.placeid = placeid;
      if (customPlace.trim()) body.customPlace = customPlace.trim();

      const res = await authFetch(`${API}/auth/profile`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.message || 'Failed to save profile.'); setSubmitting(false); return;
      }

      const data = await res.json();
      if (data.isComplete) {
        document.cookie = `saubh_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=86400; SameSite=Lax`;
        router.push(`/${locale}/dashboard`);
      } else if (mode === 'draft') {
        setSuccess('Profile saved! Complete verification to finish setup.');
        setSubmitting(false);
      } else {
        // mode === 'complete' but isComplete is false
        const missing = [];
        if (!data.emailVerified) missing.push('email verification');
        if (!data.phoneVerified) missing.push('mobile verification');
        setError('Almost there! Still need: ' + (missing.length > 0 ? missing.join(' and ') : 'some required fields') + '.');
        setSubmitting(false);
      }
    } catch { setError('Network error. Please try again.'); setSubmitting(false); }
  };

  // ─── Language chip helpers ─────────────────────────────────────────

  const addLang = (id: number) => { if (!langid.includes(id)) setLangid([...langid, id]); setLangSearch(''); setLangDropOpen(false); };
  const removeLang = (id: number) => setLangid(langid.filter(l => l !== id));
  const langName = (id: number) => languages.find(l => l.langid === id)?.language || `#${id}`;
  const filteredLangs = languages.filter(l =>
    !langid.includes(l.langid) && l.language?.toLowerCase().includes(langSearch.toLowerCase())
  );

  // ─── Loading state ─────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <style>{baseStyles}</style>
        <div className="pp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="pp-mesh"><div className="pp-m1" /><div className="pp-m2" /><div className="pp-m3" /></div>
          <div style={{ fontSize: '1.1rem', color: '#66708a', fontFamily: 'Inter,system-ui,sans-serif' }}>Loading profile...</div>
        </div>
      </>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <>
      <style>{baseStyles}</style>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="pp">
        <div className="pp-mesh"><div className="pp-m1" /><div className="pp-m2" /><div className="pp-m3" /></div>

        <div className="pp-inner">
          {/* Logo */}
          <div className="pp-head">
            <Image src="/logo.jpg" alt="Saubh.Tech" width={36} height={36} style={{ borderRadius: 10, boxShadow: '0 0 16px rgba(124,58,237,0.25)' }} />
            <span className="pp-brand">Saubh<span className="pp-dot">.</span>Tech</span>
          </div>

          {/* Progress bar */}
          <div className="pp-progress-wrap">
            <div className="pp-progress-label">Profile {progress}% complete</div>
            <div className="pp-progress-track">
              <div className="pp-progress-bar" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${progressColor(progress)}, ${progress >= 70 ? '#06b6d4' : progressColor(progress)})` }} />
            </div>
          </div>

          {/* Main card */}
          <form className="pp-card" onSubmit={handleSubmit}>
            <div className="pp-card-top" />
            <div className="pp-grid">

              {/* ── LEFT: Photo (selfie) + User Type ───────────────── */}
              <div className="pp-left">

                {/* Selfie camera area */}
                {cameraActive ? (
                  <div className="pp-camera-wrap">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="pp-camera-video"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="pp-camera-actions">
                      <button type="button" className="pp-cam-btn pp-cam-capture" onClick={capturePhoto}>
                        📸 Capture
                      </button>
                      <button type="button" className="pp-cam-btn pp-cam-cancel" onClick={stopCamera}>
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (photoPreview || pic) ? (
                  <div className="pp-photo-area">
                    <img src={photoPreview || (pic?.startsWith('http') ? pic : `${API.replace('/api', '')}${pic?.startsWith('/api') ? pic : `/api${pic}`}`)} alt="Profile" className="pp-photo-img" />
                    <div className="pp-photo-overlay" onClick={retakePhoto}>
                      <span>📸 Retake Selfie</span>
                    </div>
                  </div>
                ) : (
                  <div className="pp-photo-area pp-photo-empty" onClick={startCamera}>
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                    <div className="pp-photo-text">📸 Take a Selfie *</div>
                    <div className="pp-photo-hint">Camera will open for selfie</div>
                    {cameraError && (
                      <div className="pp-photo-fallback" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                        Or upload a photo instead
                      </div>
                    )}
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                {!cameraActive && !photoPreview && !pic && (
                  <div className="pp-upload-fallback" onClick={() => fileRef.current?.click()}>
                    📁 Upload instead
                  </div>
                )}
                {photoFile && <div className="pp-photo-name">{photoFile.name} ({(photoFile.size / 1024).toFixed(0)} KB)</div>}

                {/* User Type selector */}
                <div className="pp-field" style={{ width: '100%', marginTop: '8px' }}>
                  <label className="pp-label">I am a *</label>
                  <div className="pp-usertype-group">
                    {USERTYPE_OPTIONS.map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        className={`pp-usertype-btn${usertype === k ? ' pp-usertype-active' : ''}`}
                        onClick={() => setUsertype(k)}
                      >
                        {k === 'BO' ? '🏢' : k === 'CL' ? '👤' : '⚡'} {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Form fields ─────────────────────────────── */}
              <div className="pp-right">

                {/* Row 1: Name */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">First Name *</label>
                    <input className="pp-input" value={fname} onChange={e => setFname(e.target.value)} placeholder="First name" />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Last Name *</label>
                    <input className="pp-input" value={lname} onChange={e => setLname(e.target.value)} placeholder="Last name" />
                  </div>
                </div>

                {/* Row 2: Email + OTP (6-digit) */}
                <div className="pp-row">
                  <div className="pp-field" style={{ gridColumn: 'span 2' }}>
                    <label className="pp-label">
                      Email * {emailVerified && <span className="pp-verified-badge">✓ Verified</span>}
                    </label>
                    {!emailVerified ? (
                      <div className="pp-verify-block">
                        <div className="pp-otp-row">
                          <input className="pp-input pp-otp-input" type="email" value={email}
                            onChange={e => { setEmail(e.target.value); setEmailOtpSent(false); setEmailVerified(false); }}
                            placeholder="your@email.com" disabled={emailOtpSent && !emailVerified} />
                          {!emailOtpSent && (
                            <button type="button" className="pp-otp-btn" disabled={!email.trim() || emailLoading} onClick={() => sendOtp('email', email)}>
                              {emailLoading ? '...' : 'Send Code'}
                            </button>
                          )}
                        </div>
                        {emailOtpSent && !emailVerified && (
                          <div className="pp-otp-verify-section">
                            <div className="pp-otp-hint">Enter 6-digit code sent to {email}</div>
                            <div className="pp-otp-boxes" onPaste={(e) => handleOtpBoxPaste(e, 6, setEmailOtp, emailOtpRefs, undefined)}>
                              {emailOtp.map((d, i) => (
                                <input
                                  key={i}
                                  ref={el => { emailOtpRefs.current[i] = el; }}
                                  className={`pp-otp-box${d ? ' pp-otp-filled' : ''}`}
                                  type="text" inputMode="numeric" maxLength={1} value={d}
                                  onChange={e => handleOtpBoxChange(i, e.target.value, 6, emailOtp, setEmailOtp, emailOtpRefs,
                                    undefined
                                  )}
                                  onKeyDown={e => handleOtpBoxKeyDown(i, e, emailOtp, emailOtpRefs)}
                                  disabled={emailLoading}
                                />
                              ))}
                            </div>
                            <div className="pp-otp-meta">
                              {emailCountdown > 0 ? (
                                <span className="pp-otp-timer">Expires in {Math.floor(emailCountdown / 60)}:{(emailCountdown % 60).toString().padStart(2, '0')}</span>
                              ) : (
                                <span className="pp-otp-expired">Code expired</span>
                              )}
                              {emailCountdown > 0 ? (
                                <span className="pp-otp-resend" style={{ opacity: emailCountdown > 550 ? 0.3 : 1, pointerEvents: emailCountdown > 550 ? 'none' : 'auto' }}
                                  onClick={() => sendOtp('email', email)}>Resend</span>
                              ) : (
                                <button type="button" className="pp-otp-btn" style={{ height: '32px', fontSize: '.78rem', padding: '0 12px' }}
                                  onClick={() => { setEmailOtpSent(false); setEmailOtp(['', '', '', '', '', '']); }}
                                >Send New Code</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input className="pp-input" value={email} readOnly style={{ opacity: 0.7 }} />
                    )}
                  </div>
                </div>

                {/* Row 3: Mobile + OTP (4-digit) */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">WhatsApp (registered)</label>
                    <input className="pp-input" value={whatsapp} readOnly style={{ opacity: 0.6 }} />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">
                      Alternate Mobile * {mobileVerified && <span className="pp-verified-badge">✓ Verified</span>}
                    </label>
                    {!mobileVerified ? (
                      <div className="pp-verify-block">
                        <div className="pp-otp-row">
                          <input className="pp-input pp-otp-input" value={phone}
                            onChange={e => { setPhone(e.target.value); setMobileOtpSent(false); setMobileVerified(false); }}
                            placeholder="Alt. mobile" disabled={mobileOtpSent && !mobileVerified} />
                          {!mobileOtpSent && (
                            <button type="button" className="pp-otp-btn" disabled={!phone.trim() || mobileLoading} onClick={() => sendOtp('mobile', phone)}>
                              {mobileLoading ? '...' : 'OTP'}
                            </button>
                          )}
                        </div>
                        {mobileOtpSent && !mobileVerified && (
                          <div className="pp-otp-verify-section">
                            <div className="pp-otp-hint">Enter 4-digit code sent via WhatsApp</div>
                            <div className="pp-otp-boxes" onPaste={(e) => handleOtpBoxPaste(e, 4, setMobileOtp, mobileOtpRefs, () => verifyOtp('mobile', phone, mobileOtp.join('')))}>
                              {mobileOtp.map((d, i) => (
                                <input
                                  key={i}
                                  ref={el => { mobileOtpRefs.current[i] = el; }}
                                  className={`pp-otp-box${d ? ' pp-otp-filled' : ''}`}
                                  type="text" inputMode="numeric" maxLength={1} value={d}
                                  onChange={e => handleOtpBoxChange(i, e.target.value, 4, mobileOtp, setMobileOtp, mobileOtpRefs,
                                    undefined
                                  )}
                                  onKeyDown={e => handleOtpBoxKeyDown(i, e, mobileOtp, mobileOtpRefs)}
                                  disabled={mobileLoading}
                                />
                              ))}
                            </div>
                            <div className="pp-otp-meta">
                              {mobileCountdown > 0 ? (
                                <span className="pp-otp-timer">Expires in {Math.floor(mobileCountdown / 60)}:{(mobileCountdown % 60).toString().padStart(2, '0')}</span>
                              ) : (
                                <span className="pp-otp-expired">Code expired</span>
                              )}
                              {mobileCountdown > 0 ? (
                                <span className="pp-otp-resend" style={{ opacity: mobileCountdown > 250 ? 0.3 : 1, pointerEvents: mobileCountdown > 250 ? 'none' : 'auto' }}
                                  onClick={() => sendOtp('mobile', phone)}>Resend</span>
                              ) : (
                                <button type="button" className="pp-otp-btn" style={{ height: '32px', fontSize: '.78rem', padding: '0 12px' }}
                                  onClick={() => { setMobileOtpSent(false); setMobileOtp(['', '', '', '']); }}
                                >Send New Code</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input className="pp-input" value={phone} readOnly style={{ opacity: 0.7 }} />
                    )}
                  </div>
                </div>

                {/* Row 4: Gender + DOB */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">Gender *</label>
                    <select className="pp-input pp-select" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Date of Birth *</label>
                    <input className="pp-input" type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>

                {/* Row 5: Languages */}
                <div className="pp-row">
                  <div className="pp-field" style={{ gridColumn: 'span 2', position: 'relative' }}>
                    <label className="pp-label">Languages * (select at least one)</label>
                    <div className="pp-chips-wrap">
                      {langid.map(id => (
                        <span key={id} className="pp-chip">
                          {langName(id)}
                          <button type="button" className="pp-chip-x" onClick={() => removeLang(id)}>×</button>
                        </span>
                      ))}
                      <input
                        className="pp-chip-input"
                        value={langSearch}
                        onChange={e => { setLangSearch(e.target.value); setLangDropOpen(true); }}
                        onFocus={() => setLangDropOpen(true)}
                        placeholder={langid.length ? 'Add more...' : 'Search languages...'}
                      />
                    </div>
                    {langDropOpen && filteredLangs.length > 0 && (
                      <div className="pp-lang-drop">
                        {filteredLangs.slice(0, 12).map(l => (
                          <div key={l.langid} className="pp-lang-opt" onClick={() => addLang(l.langid)}>{l.language}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 6: Qualification + Experience */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">Qualification *</label>
                    <input className="pp-input" value={qualification} onChange={e => setQualification(e.target.value)} placeholder="e.g. B.Tech, MBA" />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Experience *</label>
                    <input className="pp-input" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 3 years" />
                  </div>
                </div>

                {/* Row 7: Country + State */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">Country</label>
                    <input className="pp-input" value="India" readOnly style={{ opacity: 0.6 }} />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">State *</label>
                    <select className="pp-input pp-select" value={stateid || ''} onChange={e => { setStateid(e.target.value ? +e.target.value : null); setDistrictid(null); setPincode(''); setPlaceid(null); }}>
                      <option value="">Select state</option>
                      {states.map((s: any) => <option key={s.stateid} value={s.stateid}>{s.state}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 8: District + Pincode */}
                <div className="pp-row">
                  <div className="pp-field">
                    <label className="pp-label">District *</label>
                    <select className="pp-input pp-select" value={districtid || ''} onChange={e => { setDistrictid(e.target.value ? +e.target.value : null); setPincode(''); setPlaceid(null); }} disabled={!stateid}>
                      <option value="">{stateid ? 'Select district' : 'Select state first'}</option>
                      {districts.map((d: any) => <option key={d.districtid} value={d.districtid}>{d.district}</option>)}
                    </select>
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Pin Code *</label>
                    <select className="pp-input pp-select" value={pincode} onChange={e => { setPincode(e.target.value); setPlaceid(null); }} disabled={!districtid}>
                      <option value="">{districtid ? 'Select pincode' : 'Select district first'}</option>
                      {pincodes.map((p: any) => <option key={p.postid} value={p.pincode}>{p.pincode} — {p.postoffice}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 9: Place */}
                <div className="pp-row">
                  <div className="pp-field" style={{ gridColumn: 'span 2' }}>
                    <label className="pp-label">Place *</label>
                    {!showCustomPlace ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <select className="pp-input pp-select" value={placeid || ''} onChange={e => { setPlaceid(e.target.value ? +e.target.value : null); setCustomPlace(''); }} disabled={!pincode}>
                          <option value="">{pincode ? 'Select place' : 'Select pincode first'}</option>
                          {places.map((p: any) => <option key={p.placeid} value={Number(p.placeid)}>{p.place}</option>)}
                        </select>
                        {pincode && (
                          <span className="pp-custom-place-link" onClick={() => { setShowCustomPlace(true); setPlaceid(null); }}>
                            + Add new place (not in list)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input
                          className="pp-input"
                          value={customPlace}
                          onChange={e => setCustomPlace(e.target.value)}
                          placeholder="Enter your place name"
                        />
                        <span className="pp-custom-place-link" onClick={() => { setShowCustomPlace(false); setCustomPlace(''); }}>
                          ← Select from list instead
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error / Success */}
                {error && <div className="pp-error">{error}</div>}
                {success && <div className="pp-success">{success}</div>}

                {/* Submit */}
                <div className="pp-submit-row">
                  <button
                    type="button"
                    className="pp-draft-btn"
                    disabled={submitting}
                    onClick={(e) => handleSubmit(e as any, 'draft')}
                  >
                    {submitting ? 'Saving...' : '💾 Save Draft'}
                  </button>
                  <button
                    type="submit"
                    className="pp-submit-btn"
                    disabled={submitting || !emailVerified || !mobileVerified}
                    onClick={(e) => { e.preventDefault(); handleSubmit(e as any, 'complete'); }}
                  >
                    {submitting ? 'Saving...' : !emailVerified || !mobileVerified
                      ? '🔒 Verify to Complete'
                      : 'Save & Continue →'}
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────

const baseStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}

.pp{
  min-height:100vh;padding:20px;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;
  background:#f4f0ff;position:relative;overflow-x:hidden;
}

/* Mesh blobs */
.pp-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;}
.pp-mesh div{position:absolute;border-radius:50%;filter:blur(120px);opacity:.35;animation:ppdrift 16s ease-in-out infinite alternate;}
.pp-m1{width:500px;height:500px;top:-8%;left:-5%;background:#7c3aed;}
.pp-m2{width:400px;height:400px;top:30%;right:-8%;background:#06b6d4;animation-delay:-4s!important;}
.pp-m3{width:350px;height:350px;bottom:-5%;left:40%;background:#22c55e;animation-delay:-8s!important;opacity:.2;}
@keyframes ppdrift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(25px,-20px) scale(1.08);}100%{transform:translate(-15px,20px) scale(.95);}}

.pp-inner{position:relative;z-index:1;max-width:920px;margin:0 auto;}

/* Header */
.pp-head{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px;}
.pp-brand{font-weight:800;font-size:1.4rem;color:#15192d;}
.pp-dot{background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

/* Progress */
.pp-progress-wrap{margin-bottom:16px;}
.pp-progress-label{font-size:.82rem;font-weight:600;color:#66708a;margin-bottom:6px;text-align:center;}
.pp-progress-track{height:8px;border-radius:8px;background:rgba(124,58,237,0.1);overflow:hidden;}
.pp-progress-bar{height:100%;border-radius:8px;transition:width .4s ease, background .4s ease;}

/* Card */
.pp-card{
  position:relative;border-radius:20px;overflow:hidden;
  background:rgba(255,255,255,0.82);
  border:1px solid rgba(124,58,237,0.12);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 8px 40px rgba(124,58,237,0.06),0 1px 3px rgba(0,0,0,0.04);
}
.pp-card-top{height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4);}

.pp-grid{display:grid;grid-template-columns:260px 1fr;gap:0;}

/* Left panel */
.pp-left{padding:28px 24px;border-right:1px solid rgba(124,58,237,0.08);display:flex;flex-direction:column;align-items:center;gap:12px;}

/* Photo area */
.pp-photo-area{
  width:210px;height:210px;border-radius:18px;overflow:hidden;position:relative;
  border:2px dashed rgba(124,58,237,0.25);
  display:flex;align-items:center;justify-content:center;
  transition:.25s;background:rgba(124,58,237,0.03);
}
.pp-photo-empty{cursor:pointer;}
.pp-photo-empty:hover{border-color:#7c3aed;background:rgba(124,58,237,0.06);}
.pp-photo-img{width:100%;height:100%;object-fit:cover;}
.pp-photo-overlay{
  position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;
  opacity:0;transition:.25s;cursor:pointer;color:#fff;font-weight:600;font-size:.85rem;
}
.pp-photo-area:hover .pp-photo-overlay{opacity:1;}
.pp-photo-text{font-size:.85rem;font-weight:600;color:#7c3aed;margin-top:10px;text-align:center;}
.pp-photo-hint{font-size:.72rem;color:#66708a;margin-top:4px;text-align:center;}
.pp-photo-fallback{font-size:.72rem;color:#7c3aed;margin-top:8px;cursor:pointer;text-decoration:underline;text-align:center;}
.pp-upload-fallback{font-size:.78rem;color:#66708a;cursor:pointer;text-align:center;transition:.2s;}
.pp-upload-fallback:hover{color:#7c3aed;}
.pp-photo-name{font-size:.75rem;color:#66708a;text-align:center;word-break:break-all;}

/* Camera */
.pp-camera-wrap{width:210px;height:260px;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;background:#000;border:2px solid #7c3aed;}
.pp-camera-video{width:100%;flex:1;object-fit:cover;border-radius:16px 16px 0 0;}
.pp-camera-actions{display:flex;gap:4px;padding:6px;}
.pp-cam-btn{flex:1;padding:8px 0;border:none;border-radius:10px;font-weight:700;font-size:.8rem;cursor:pointer;font-family:'Inter',sans-serif;}
.pp-cam-capture{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;}
.pp-cam-cancel{background:rgba(255,255,255,0.1);color:#fff;}
.pp-cam-capture:hover{opacity:.9;}
.pp-cam-cancel:hover{background:rgba(255,255,255,0.2);}

/* User type buttons */
.pp-usertype-group{display:flex;flex-direction:column;gap:6px;width:100%;}
.pp-usertype-btn{
  width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(124,58,237,0.15);
  background:rgba(255,255,255,0.9);font-size:.82rem;font-weight:600;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;cursor:pointer;
  transition:.2s;text-align:left;
}
.pp-usertype-btn:hover{border-color:#7c3aed;background:rgba(124,58,237,0.04);}
.pp-usertype-active{
  border-color:#7c3aed;background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(6,182,212,0.06));
  color:#7c3aed;box-shadow:0 0 0 2px rgba(124,58,237,0.12);
}

/* Right panel */
.pp-right{padding:24px 28px;display:flex;flex-direction:column;gap:14px;}
.pp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pp-field{display:flex;flex-direction:column;gap:4px;}
.pp-label{font-size:.78rem;font-weight:600;color:#66708a;display:flex;align-items:center;gap:6px;}

.pp-input{
  height:40px;border-radius:10px;padding:0 12px;font-size:.88rem;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;outline:none;
  background:rgba(255,255,255,0.9);border:1px solid rgba(124,58,237,0.15);
  transition:.2s;width:100%;
}
.pp-input::placeholder{color:#a0a8c0;}
.pp-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.pp-select{cursor:pointer;appearance:auto;}

/* Verified badge */
.pp-verified-badge{
  display:inline-flex;align-items:center;gap:2px;padding:1px 8px;border-radius:10px;
  font-size:.7rem;font-weight:700;background:rgba(34,197,94,0.12);color:#16a34a;
}

/* OTP verification */
.pp-verify-block{display:flex;flex-direction:column;gap:8px;}
.pp-otp-row{display:flex;gap:6px;align-items:center;}
.pp-otp-input{flex:1;}
.pp-otp-btn{
  height:40px;padding:0 14px;border-radius:10px;border:none;
  background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;
  font-weight:700;font-size:.82rem;cursor:pointer;white-space:nowrap;
  font-family:'Inter',system-ui,sans-serif;transition:.2s;
}
.pp-otp-btn:hover{opacity:.9;transform:translateY(-1px);}
.pp-otp-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.pp-otp-verify-section{display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:10px;background:rgba(124,58,237,0.03);border:1px solid rgba(124,58,237,0.08);}
.pp-otp-hint{font-size:.76rem;color:#66708a;font-weight:500;}
.pp-otp-boxes{display:flex;gap:6px;justify-content:center;}
.pp-otp-box{
  width:42px;height:48px;border-radius:10px;text-align:center;font-size:1.3rem;font-weight:800;
  font-family:'Inter',sans-serif;color:#15192d;outline:none;
  background:rgba(255,255,255,0.9);border:2px solid rgba(124,58,237,0.15);transition:.2s;
}
.pp-otp-box:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.pp-otp-filled{border-color:rgba(124,58,237,0.5);background:rgba(124,58,237,0.04);}
.pp-otp-meta{display:flex;justify-content:space-between;align-items:center;font-size:.74rem;}
.pp-otp-timer{color:#66708a;font-weight:600;}
.pp-otp-expired{color:#ef4444;font-weight:600;}
.pp-otp-resend{color:#7c3aed;font-weight:700;cursor:pointer;}
.pp-otp-resend:hover{text-decoration:underline;}

/* Language chips */
.pp-chips-wrap{
  display:flex;flex-wrap:wrap;gap:6px;padding:6px 10px;min-height:40px;
  border-radius:10px;border:1px solid rgba(124,58,237,0.15);
  background:rgba(255,255,255,0.9);align-items:center;cursor:text;
}
.pp-chip{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 10px;border-radius:16px;font-size:.78rem;font-weight:600;
  background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.1));
  color:#7c3aed;
}
.pp-chip-x{border:none;background:none;color:#7c3aed;font-size:1rem;cursor:pointer;line-height:1;padding:0 2px;}
.pp-chip-input{border:none;outline:none;background:none;flex:1;min-width:100px;font-size:.85rem;font-family:'Inter',system-ui,sans-serif;color:#15192d;}
.pp-chip-input::placeholder{color:#a0a8c0;}

.pp-lang-drop{
  position:absolute;top:100%;left:0;right:0;z-index:10;
  max-height:180px;overflow-y:auto;margin-top:4px;
  background:#fff;border:1px solid rgba(124,58,237,0.15);
  border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.08);
}
.pp-lang-opt{padding:8px 14px;font-size:.85rem;cursor:pointer;transition:.15s;}
.pp-lang-opt:hover{background:rgba(124,58,237,0.06);}

/* Error / Success */
.pp-error{padding:10px 14px;border-radius:10px;font-size:.84rem;font-weight:500;background:rgba(239,68,68,0.08);color:#dc2626;border:1px solid rgba(239,68,68,0.15);}
.pp-success{padding:10px 14px;border-radius:10px;font-size:.84rem;font-weight:500;background:rgba(34,197,94,0.08);color:#16a34a;border:1px solid rgba(34,197,94,0.15);}

/* Submit */
.pp-submit-row{display:flex;justify-content:flex-end;padding-top:4px;gap:12px;}
/* Save Draft button */
.pp-custom-place-link{
  font-size:.78rem;color:#7c3aed;cursor:pointer;font-weight:600;
  transition:.2s;user-select:none;
}
.pp-custom-place-link:hover{text-decoration:underline;color:#6d28d9;}

.pp-draft-btn{
  height:46px;padding:0 24px;border:2px solid rgba(124,58,237,0.3);border-radius:12px;
  background:transparent;color:#7c3aed;
  font-weight:700;font-size:.88rem;cursor:pointer;
  font-family:'Inter',system-ui,sans-serif;transition:.2s;
}
.pp-draft-btn:hover{background:rgba(124,58,237,0.06);border-color:#7c3aed;}
.pp-draft-btn:disabled{opacity:.4;cursor:not-allowed;}

.pp-submit-btn{
  height:46px;padding:0 36px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;
  font-weight:700;font-size:.95rem;cursor:pointer;
  font-family:'Inter',system-ui,sans-serif;
  box-shadow:0 6px 20px rgba(124,58,237,0.2);transition:.2s;
}
.pp-submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,0.3);}
.pp-submit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

/* Responsive */
@media(max-width:720px){
  .pp{padding:12px;}
  .pp-grid{grid-template-columns:1fr;}
  .pp-left{border-right:none;border-bottom:1px solid rgba(124,58,237,0.08);padding:20px;flex-direction:column;gap:12px;align-items:center;}
  .pp-photo-area{width:140px;height:140px;flex:none;}
  .pp-camera-wrap{width:140px;height:200px;}
  .pp-usertype-group{flex-direction:row;flex-wrap:wrap;}
  .pp-usertype-btn{flex:1;min-width:0;text-align:center;padding:8px 6px;font-size:.75rem;}
  .pp-right{padding:18px 16px;}
  .pp-row{grid-template-columns:1fr;}
  .pp-row > .pp-field[style*="grid-column"]{grid-column:span 1!important;}
  .pp-submit-btn{width:100%;}
  .pp-otp-box{width:36px;height:42px;font-size:1.1rem;}
}
`;
