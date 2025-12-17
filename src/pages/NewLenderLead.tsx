import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { LeadHeader } from "@/components/lead/LeadHeader";
import { LeadStepper } from "@/components/lead/LeadStepper";
import { LeadSectionCard } from "@/components/lead/LeadSectionCard";
import { FollowupCard } from "@/components/lead/FollowupCard";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "lenderLeadFormData";

// Dropdown options
const stateOptions = ["Maharashtra", "Gujarat", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Rajasthan", "Uttar Pradesh", "West Bengal", "Other"];
const cityOptions = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Other"];
const sourceOptions = ["Referral", "Website", "Social Media", "Cold Call", "Event", "Partner", "Other"];
const lenderCategoryOptions = ["Individual", "HNI", "Corporate", "Family Office", "NRI", "Institutional", "Other"];
const investmentPreferenceOptions = ["SME Term Loan", "Invoice Discounting", "Supply Chain", "Secured", "Unsecured", "Other"];
const complianceOptions = ["KYC-ready", "Needs more info", "NDA required", "Other"];
const ticketSizeOptions = ["<50k", "50k–250k", "250k–1M", "1M+"];
const returnExpectationOptions = ["8–10%", "10–12%", "12–15%", "15%+"];
const outcomeOptions = ["Positive", "Negative", "Neutral", "Follow-up Required"];
const leadQualityOptions = ["Hot", "Warm", "Cold"];
const visitModeOptions = ["In-person", "Video Call", "Phone Call", "Email"];
const yesNoOptions = ["Yes", "No"];

interface Section1Data {
  lenderName: string;
  contactNumber: string;
  contactPerson: string;
  state: string;
  officeAddress: string;
  sourceOfLead: string;
  lenderCategory: string;
  investmentPreference: string;
  compliance: string;
  businessEmail: string;
  dateTimeOfVisit: string;
  city: string;
  expectedInvestmentValue: string;
  ticketSizePreference: string;
  targetReturnExpectation: string;
  nextFollowupDate: string;
  outcomeOfMeeting: string;
  leadQuality: string;
  comments: string;
}

interface Followup {
  id: string;
  visitMode: string;
  date: string;
  nextFollowupDate: string;
  photos: FileList | null;
  description: string;
}

interface Section3Data {
  lenderOnboarded: string;
  finalFollowupMode: string;
  dateOfOnboarding: string;
  completeDescription: string;
}

interface FormState {
  section1: Section1Data;
  followups: Followup[];
  section3: Section3Data;
  section1Submitted: boolean;
  section2Submitted: boolean;
  section3Submitted: boolean;
}

const initialSection1: Section1Data = {
  lenderName: "",
  contactNumber: "",
  contactPerson: "",
  state: "",
  officeAddress: "",
  sourceOfLead: "",
  lenderCategory: "",
  investmentPreference: "",
  compliance: "",
  businessEmail: "",
  dateTimeOfVisit: "",
  city: "",
  expectedInvestmentValue: "",
  ticketSizePreference: "",
  targetReturnExpectation: "",
  nextFollowupDate: "",
  outcomeOfMeeting: "",
  leadQuality: "",
  comments: "",
};

const initialSection3: Section3Data = {
  lenderOnboarded: "",
  finalFollowupMode: "",
  dateOfOnboarding: "",
  completeDescription: "",
};

const createFollowup = (): Followup => ({
  id: crypto.randomUUID(),
  visitMode: "",
  date: "",
  nextFollowupDate: "",
  photos: null,
  description: "",
});

const initialFormState: FormState = {
  section1: initialSection1,
  followups: [createFollowup()],
  section3: initialSection3,
  section1Submitted: false,
  section2Submitted: false,
  section3Submitted: false,
};

export default function NewLenderLead() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore followups without file data
        return {
          ...parsed,
          followups: parsed.followups.map((f: any) => ({ ...f, photos: null })),
        };
      } catch {
        return initialFormState;
      }
    }
    return initialFormState;
  });

  // Debounced autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      // Exclude file objects from storage
      const toSave = {
        ...formState,
        followups: formState.followups.map((f) => ({ ...f, photos: null })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }, 500);
    return () => clearTimeout(timer);
  }, [formState]);

  const clearForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormState(initialFormState);
    toast({ title: "Form cleared", description: "All form data has been reset." });
  };

  const updateSection1 = useCallback((field: keyof Section1Data, value: string) => {
    setFormState((prev) => ({
      ...prev,
      section1: { ...prev.section1, [field]: value },
    }));
  }, []);

  const updateSection3 = useCallback((field: keyof Section3Data, value: string) => {
    setFormState((prev) => ({
      ...prev,
      section3: { ...prev.section3, [field]: value },
    }));
  }, []);

  const updateFollowup = useCallback((id: string, field: keyof Followup, value: any) => {
    setFormState((prev) => ({
      ...prev,
      followups: prev.followups.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    }));
  }, []);

  const addFollowup = () => {
    setFormState((prev) => ({
      ...prev,
      followups: [...prev.followups, createFollowup()],
    }));
  };

  const removeFollowup = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      followups: prev.followups.filter((f) => f.id !== id),
    }));
  };

  const validateSection1 = (): boolean => {
    const { section1 } = formState;
    const required: (keyof Section1Data)[] = [
      "lenderName", "contactNumber", "contactPerson", "state", "officeAddress",
      "sourceOfLead", "lenderCategory", "investmentPreference", "businessEmail",
      "dateTimeOfVisit", "city", "expectedInvestmentValue", "ticketSizePreference",
      "targetReturnExpectation", "outcomeOfMeeting", "leadQuality", "comments"
    ];
    return required.every((field) => section1[field].trim() !== "");
  };

  const validateSection2 = (): boolean => {
    return formState.followups.every(
      (f) => f.visitMode && f.date && f.description
    );
  };

  const validateSection3 = (): boolean => {
    const { section3 } = formState;
    if (!section3.lenderOnboarded || !section3.finalFollowupMode || !section3.completeDescription) {
      return false;
    }
    if (section3.lenderOnboarded === "Yes" && !section3.dateOfOnboarding) {
      return false;
    }
    return true;
  };

  const submitSection1 = () => {
    if (!validateSection1()) {
      toast({ title: "Validation Error", description: "Please fill all required fields in Section 1.", variant: "destructive" });
      return;
    }
    setFormState((prev) => ({ ...prev, section1Submitted: true }));
    toast({ title: "Section 1 Submitted", description: "You can now proceed to Section 2." });
  };

  const submitSection2 = () => {
    if (!validateSection2()) {
      toast({ title: "Validation Error", description: "Please fill all required fields in followups.", variant: "destructive" });
      return;
    }
    setFormState((prev) => ({ ...prev, section2Submitted: true }));
    toast({ title: "Section 2 Submitted", description: "You can now proceed to Section 3." });
  };

  const submitSection3 = () => {
    if (!validateSection3()) {
      toast({ title: "Validation Error", description: "Please fill all required fields in Section 3.", variant: "destructive" });
      return;
    }
    setFormState((prev) => ({ ...prev, section3Submitted: true }));
    toast({ title: "Form Completed!", description: "Lender lead has been successfully submitted." });
  };

  const completedCount = [
    formState.section1Submitted,
    formState.section2Submitted,
    formState.section3Submitted,
  ].filter(Boolean).length;

  const getSection1Status = () => formState.section1Submitted ? "completed" : "in-progress";
  const getSection2Status = () => {
    if (formState.section2Submitted) return "completed";
    return formState.section1Submitted ? "in-progress" : "not-started";
  };
  const getSection3Status = () => {
    if (formState.section3Submitted) return "completed";
    return formState.section1Submitted && formState.section2Submitted ? "in-progress" : "not-started";
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <LeadHeader title="NEW LENDER LEAD" onClearForm={clearForm} />
        
        <LeadStepper
          completedSections={completedCount}
          totalSections={3}
          section1Submitted={formState.section1Submitted}
          section2Submitted={formState.section2Submitted}
          section3Submitted={formState.section3Submitted}
        />

        {/* Section 1 - Lender Lead Details */}
        <LeadSectionCard section={1} title="Section 1" status={getSection1Status()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Lender / Entity Name*</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.section1.lenderName}
                  onChange={(e) => updateSection1("lenderName", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">Contact Number*</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formState.section1.contactNumber}
                  onChange={(e) => updateSection1("contactNumber", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">Contact Person*</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.section1.contactPerson}
                  onChange={(e) => updateSection1("contactPerson", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">State*</label>
                <select
                  className="form-select"
                  value={formState.section1.state}
                  onChange={(e) => updateSection1("state", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select state</option>
                  {stateOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Office Address*</label>
                <input
                  type="text"
                  className="form-input"
                  value={formState.section1.officeAddress}
                  onChange={(e) => updateSection1("officeAddress", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">Source of Lead*</label>
                <select
                  className="form-select"
                  value={formState.section1.sourceOfLead}
                  onChange={(e) => updateSection1("sourceOfLead", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select source</option>
                  {sourceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lender Category*</label>
                <select
                  className="form-select"
                  value={formState.section1.lenderCategory}
                  onChange={(e) => updateSection1("lenderCategory", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select category</option>
                  {lenderCategoryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Investment Preference*</label>
                <select
                  className="form-select"
                  value={formState.section1.investmentPreference}
                  onChange={(e) => updateSection1("investmentPreference", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select preference</option>
                  {investmentPreferenceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Compliance / Constraints</label>
                <select
                  className="form-select"
                  value={formState.section1.compliance}
                  onChange={(e) => updateSection1("compliance", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select compliance status</option>
                  {complianceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Business Email*</label>
                <input
                  type="email"
                  className="form-input"
                  value={formState.section1.businessEmail}
                  onChange={(e) => updateSection1("businessEmail", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">Date & Time of Visit*</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formState.section1.dateTimeOfVisit}
                  onChange={(e) => updateSection1("dateTimeOfVisit", e.target.value)}
                  disabled={formState.section1Submitted}
                />
              </div>
              <div>
                <label className="form-label">City*</label>
                <select
                  className="form-select"
                  value={formState.section1.city}
                  onChange={(e) => updateSection1("city", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select city</option>
                  {cityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Expected Investment Value*</label>
                <input
                  type="number"
                  className="form-input"
                  value={formState.section1.expectedInvestmentValue}
                  onChange={(e) => updateSection1("expectedInvestmentValue", e.target.value)}
                  disabled={formState.section1Submitted}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="form-label">Ticket Size Preference*</label>
                <select
                  className="form-select"
                  value={formState.section1.ticketSizePreference}
                  onChange={(e) => updateSection1("ticketSizePreference", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select ticket size</option>
                  {ticketSizeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Target Return Expectation*</label>
                <select
                  className="form-select"
                  value={formState.section1.targetReturnExpectation}
                  onChange={(e) => updateSection1("targetReturnExpectation", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select return expectation</option>
                  {returnExpectationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Next Followup Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formState.section1.nextFollowupDate}
                  onChange={(e) => updateSection1("nextFollowupDate", e.target.value)}
                  disabled={formState.section1Submitted}
                />
                <p className="text-xs text-muted-foreground mt-1">When should the next follow-up be scheduled?</p>
              </div>
              <div>
                <label className="form-label">Outcome of Meeting*</label>
                <select
                  className="form-select"
                  value={formState.section1.outcomeOfMeeting}
                  onChange={(e) => updateSection1("outcomeOfMeeting", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select outcome</option>
                  {outcomeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lead Quality*</label>
                <select
                  className="form-select"
                  value={formState.section1.leadQuality}
                  onChange={(e) => updateSection1("leadQuality", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select quality</option>
                  {leadQualityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Full width fields */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="form-label">Comments on the meeting*</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={formState.section1.comments}
                onChange={(e) => updateSection1("comments", e.target.value)}
                disabled={formState.section1Submitted}
                placeholder="Enter detailed comments about the meeting..."
              />
            </div>
            <div>
              <label className="form-label">Visit Pictures</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="form-input"
                disabled={formState.section1Submitted}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="btn-primary"
              onClick={submitSection1}
              disabled={formState.section1Submitted}
            >
              {formState.section1Submitted ? "SECTION 1 SUBMITTED" : "SUBMIT SECTION 1"}
            </button>
          </div>
        </LeadSectionCard>

        {/* Section 2 - Followups */}
        <LeadSectionCard section={2} title="Section 2" status={getSection2Status()}>
          {formState.followups.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">
              No existing followups found. Add a new followup below
            </p>
          ) : (
            formState.followups.map((followup, index) => (
              <FollowupCard
                key={followup.id}
                followup={followup}
                index={index}
                disabled={!formState.section1Submitted || formState.section2Submitted}
                visitModeOptions={visitModeOptions}
                onChange={updateFollowup}
                onRemove={removeFollowup}
              />
            ))
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className="btn-outline flex items-center gap-2"
              onClick={addFollowup}
              disabled={!formState.section1Submitted || formState.section2Submitted}
            >
              <Plus className="w-4 h-4" />
              ADD FOLLOWUP
            </button>
            <button
              className="btn-primary"
              onClick={submitSection2}
              disabled={!formState.section1Submitted || formState.section2Submitted}
            >
              {!formState.section1Submitted 
                ? "COMPLETE SECTION 1 FIRST" 
                : formState.section2Submitted 
                ? "SECTION 2 SUBMITTED" 
                : "SUBMIT SECTION 2"}
            </button>
          </div>
        </LeadSectionCard>

        {/* Section 3 - Closure */}
        <LeadSectionCard section={3} title="Section 3" status={getSection3Status()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Lender Onboarded*</label>
              <select
                className="form-select"
                value={formState.section3.lenderOnboarded}
                onChange={(e) => updateSection3("lenderOnboarded", e.target.value)}
                disabled={!formState.section1Submitted || !formState.section2Submitted || formState.section3Submitted}
              >
                <option value="">Select</option>
                {yesNoOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Final Followup Mode*</label>
              <select
                className="form-select"
                value={formState.section3.finalFollowupMode}
                onChange={(e) => updateSection3("finalFollowupMode", e.target.value)}
                disabled={!formState.section1Submitted || !formState.section2Submitted || formState.section3Submitted}
              >
                <option value="">Select mode</option>
                {visitModeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">
                Date of onboarding{formState.section3.lenderOnboarded === "Yes" ? "*" : ""}
              </label>
              <input
                type="date"
                className="form-input"
                value={formState.section3.dateOfOnboarding}
                onChange={(e) => updateSection3("dateOfOnboarding", e.target.value)}
                disabled={!formState.section1Submitted || !formState.section2Submitted || formState.section3Submitted}
              />
              <p className="text-xs text-muted-foreground mt-1">Only required if Lender Onboarded is Yes</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="form-label">Complete Description*</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formState.section3.completeDescription}
              onChange={(e) => updateSection3("completeDescription", e.target.value)}
              disabled={!formState.section1Submitted || !formState.section2Submitted || formState.section3Submitted}
              placeholder="Enter complete description of the closure..."
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="btn-primary"
              onClick={submitSection3}
              disabled={!formState.section1Submitted || !formState.section2Submitted || formState.section3Submitted}
            >
              {!formState.section1Submitted || !formState.section2Submitted
                ? "COMPLETE SECTIONS 1 & 2 FIRST"
                : formState.section3Submitted
                ? "FORM COMPLETED"
                : "SUBMIT SECTION 3"}
            </button>
          </div>
        </LeadSectionCard>
      </div>
    </div>
  );
}
