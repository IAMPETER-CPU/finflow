'use client';

import { useState } from 'react';
import { useKycStore } from '@/store/useKycStore';
import { ShieldCheck, User, FileText, Camera, CheckCircle2, ArrowRight, Upload, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VerificationPage() {
  const { kyc, updateStep, updatePersonalInfo, updateDocument, setSelfieVerified, setKycVerified } = useKycStore();

  // Form states
  const [firstName, setFirstName] = useState(kyc.personalInfo.firstName || 'Sara');
  const [lastName, setLastName] = useState(kyc.personalInfo.lastName || 'Williams');
  const [dob, setDob] = useState(kyc.personalInfo.dob || '1996-04-12');
  const [phone, setPhone] = useState(kyc.personalInfo.phone || '+234 812 345 6789');

  const [docType, setDocType] = useState<'national_id' | 'drivers_license' | 'passport'>('national_id');
  const [uploadedFile, setUploadedFile] = useState<string | null>(kyc.document.fileName || 'nin_national_id_sara_williams.pdf');
  const [uploading, setUploading] = useState(false);

  // Selfie scanning simulation states
  const [scanningFace, setScanningFace] = useState(false);
  const [faceProgress, setFaceProgress] = useState(0);
  const [isSelfieDone, setIsSelfieDone] = useState(kyc.selfieVerified);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { num: 1, label: 'Personal Details', icon: User },
    { num: 2, label: 'Identity Document', icon: FileText },
    { num: 3, label: 'Selfie Verification', icon: Camera },
    { num: 4, label: 'Review & Submit', icon: CheckCircle2 },
  ];

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo({ firstName, lastName, dob, phone });
  };

  const handleSimulatedFileUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploadedFile(`${docType}_uploaded_document.pdf`);
      setUploading(false);
      updateDocument({ type: docType, fileName: `${docType}_uploaded_document.pdf`, fileSize: '2.4 MB' });
    }, 1200);
  };

  const handleSimulateSelfieScan = () => {
    setScanningFace(true);
    setFaceProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        clearInterval(interval);
        setFaceProgress(100);
        setScanningFace(false);
        setIsSelfieDone(true);
        setSelfieVerified(true);
      } else {
        setFaceProgress(current);
      }
    }, 400);
  };

  const handleFinalSubmission = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    setKycVerified();
    setSubmitting(false);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Identity Verification (KYC)
          {kyc.status === 'verified' && (
            <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase">
              Verified
            </span>
          )}
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Complete identity verification to lift transfer limits and unlock global payouts.
        </p>
      </div>

      {/* Step Tracker Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-500 z-0"
            style={{ width: `${((kyc.step - 1) / 3) * 100}%` }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = kyc.step > s.num || kyc.status === 'verified';
            const isCurrent = kyc.step === s.num && kyc.status !== 'verified';

            return (
              <button
                key={s.num}
                onClick={() => updateStep(s.num)}
                className={`relative z-10 flex flex-col items-center gap-2 transition-all ${
                  isCurrent
                    ? 'scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="text-[11px] font-bold hidden sm:block text-slate-700 dark:text-slate-300">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        {/* Step 1: Personal Info */}
        {kyc.step === 1 && (
          <form onSubmit={handlePersonalSubmit} className="space-y-4 max-w-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Step 1: Personal Information</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all mt-4"
            >
              <span>Save & Continue to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Document Upload */}
        {kyc.step === 2 && (
          <div className="space-y-5 max-w-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Step 2: Identity Document Upload</span>
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Document Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'national_id', label: 'National ID' },
                  { id: 'drivers_license', label: "Driver's License" },
                  { id: 'passport', label: 'Passport' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocType(type.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      docType === type.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Scanner */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag & drop your document here
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Supports PDF, PNG, JPG (Max 10MB)</p>
              </div>

              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 font-bold py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning & validating document...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulatedFileUpload}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100"
                >
                  Simulate Document Upload
                </button>
              )}

              {uploadedFile && (
                <div className="inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Document Uploaded: {uploadedFile}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => updateStep(1)}
                className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => updateStep(3)}
                disabled={!uploadedFile}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25"
              >
                Continue to Step 3 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Selfie Verification */}
        {kyc.step === 3 && (
          <div className="space-y-5 max-w-xl text-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              <span>Step 3: Biometric Selfie Verification</span>
            </h3>

            {/* Camera Viewport Frame */}
            <div className="relative w-64 h-64 rounded-full border-4 border-dashed border-indigo-500/60 mx-auto flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden shadow-2xl">
              {isSelfieDone ? (
                <div className="space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-400">Face Scan Verified!</p>
                </div>
              ) : scanningFace ? (
                <div className="space-y-3">
                  <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-indigo-300">
                    Scanning biometric face points... {faceProgress}%
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4 text-center">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300">Position your face inside the circle frame</p>
                </div>
              )}
            </div>

            {!isSelfieDone && (
              <button
                type="button"
                onClick={handleSimulateSelfieScan}
                disabled={scanningFace}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
              >
                {scanningFace ? 'Scanning...' : 'Capture Photo & Scan'}
              </button>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => updateStep(2)}
                className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => updateStep(4)}
                disabled={!isSelfieDone}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25"
              >
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {kyc.step === 4 && (
          <div className="space-y-5 max-w-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Step 4: Review & Final Submission</span>
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {firstName} {lastName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{dob}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Identity Document</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Uploaded</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Biometric Selfie Scan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
              </div>
            </div>

            {kyc.status === 'verified' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Account Verified Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your identity verification has been processed and approved.
                </p>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => updateStep(3)}
                  className="py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmission}
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Identity Verification'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
