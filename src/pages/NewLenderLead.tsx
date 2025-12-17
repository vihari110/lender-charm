import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { LeadHeader } from "@/components/lead/LeadHeader";
import { LeadStepper } from "@/components/lead/LeadStepper";
import { LeadSectionCard } from "@/components/lead/LeadSectionCard";
import { FollowupCard } from "@/components/lead/FollowupCard";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "lenderLeadFormData";

// Dropdown options with label/value pairs
const stateOptions = [
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Karnataka", value: "karnataka" },
  { label: "Delhi", value: "delhi" },
  { label: "Tamil Nadu", value: "tamil_nadu" },
  { label: "Telangana", value: "telangana" },
  { label: "Rajasthan", value: "rajasthan" },
  { label: "Uttar Pradesh", value: "uttar_pradesh" },
  { label: "West Bengal", value: "west_bengal" },
  { label: "Other", value: "other" }
];

const cityOptions = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi", value: "delhi" },
  { label: "Bangalore", value: "bangalore" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Ahmedabad", value: "ahmedabad" },
  { label: "Chennai", value: "chennai" },
  { label: "Kolkata", value: "kolkata" },
  { label: "Pune", value: "pune" },
  { label: "Jaipur", value: "jaipur" },
  { label: "Other", value: "other" }
];

const lenderTypeOptions = [
  { label: "Individual", value: "individual" },
  { label: "HNI", value: "hni" },
  { label: "Corporate / Treasury", value: "corporate_treasury" },
  { label: "Family Office", value: "family_office" },
  { label: "Institutional", value: "institutional" },
  { label: "NRI", value: "nri" },
  { label: "Other (specify)", value: "other" }
];

const sourceOfLeadOptions = [
  { label: "Referral", value: "referral" },
  { label: "Walk-in", value: "walk_in" },
  { label: "Inbound (Website/App)", value: "inbound" },
  { label: "Outbound Calling", value: "outbound_call" },
  { label: "Partner / Channel", value: "partner_channel" },
  { label: "Event / Networking", value: "event" },
  { label: "Digital Ads", value: "digital_ads" },
  { label: "Social Media", value: "social_media" },
  { label: "Existing Customer Upsell", value: "existing_customer" },
  { label: "Other (specify)", value: "other" }
];

const riskAppetiteOptions = [
  { label: "Conservative", value: "conservative" },
  { label: "Moderate", value: "moderate" },
  { label: "Aggressive", value: "aggressive" }
];

const investmentPreferenceOptions = [
  { label: "SME Term Loans", value: "sme_term_loans" },
  { label: "Invoice Discounting", value: "invoice_discounting" },
  { label: "Supply Chain Finance", value: "supply_chain_finance" },
  { label: "Secured Lending", value: "secured" },
  { label: "Unsecured Lending", value: "unsecured" },
  { label: "Diversified Basket / Auto-Allocate", value: "auto_allocate" },
  { label: "Other (specify)", value: "other" }
];

const securityPreferenceOptions = [
  { label: "Secured only", value: "secured_only" },
  { label: "Unsecured OK", value: "unsecured_ok" },
  { label: "Either", value: "either" }
];

const ticketSizeOptions = [
  { label: "< 50,000", value: "lt_50k" },
  { label: "50,000 – 2,50,000", value: "50k_250k" },
  { label: "2,50,000 – 10,00,000", value: "250k_1m" },
  { label: "10,00,000 – 50,00,000", value: "1m_5m" },
  { label: "50,00,000+", value: "gt_5m" }
];

const tenurePreferenceOptions = [
  { label: "1 – 3 months", value: "1_3m" },
  { label: "3 – 6 months", value: "3_6m" },
  { label: "6 – 12 months", value: "6_12m" },
  { label: "12 months+", value: "gt_12m" }
];

const targetReturnOptions = [
  { label: "8% – 10%", value: "8_10" },
  { label: "10% – 12%", value: "10_12" },
  { label: "12% – 15%", value: "12_15" },
  { label: "15%+", value: "gt_15" }
];

const leadQualityOptions = [
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" }
];

const outcomeOfMeetingOptions = [
  { label: "Interested (wants next step)", value: "interested" },
  { label: "Needs More Information", value: "needs_more_info" },
  { label: "KYC / Docs Pending", value: "kyc_pending" },
  { label: "Call Scheduled", value: "call_scheduled" },
  { label: "Proposal Shared", value: "proposal_shared" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Revisit Later", value: "revisit_later" }
];

const followupVisitModeOptions = [
  { label: "Call", value: "call" },
  { label: "In-person Meeting", value: "in_person" },
  { label: "Video Call", value: "video" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
  { label: "Other (specify)", value: "other" }
];

const complianceConstraintsOptions = [
  { label: "KYC-ready", value: "kyc_ready" },
  { label: "Needs KYC Guidance", value: "needs_kyc_guidance" },
  { label: "NDA Required", value: "nda_required" },
  { label: "Investment Committee Approval Needed", value: "ic_approval_needed" },
  { label: "Only Secured Products", value: "secured_only" },
  { label: "Sector Restrictions (specify)", value: "sector_restrictions" },
  { label: "Other (specify)", value: "other" }
];

const closureLenderOnboardedOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" }
];

const closureStageAchievedOptions = [
  { label: "Registered", value: "registered" },
  { label: "KYC Completed", value: "kyc_completed" },
  { label: "Bank Account Added", value: "bank_added" },
  { label: "Agreement Signed", value: "agreement_signed" },
  { label: "First Pay-in Completed", value: "first_payin_completed" }
];

const dropReasonOptions = [
  { label: "Return expectation mismatch", value: "return_mismatch" },
  { label: "Risk appetite mismatch", value: "risk_mismatch" },
  { label: "Compliance / KYC not feasible", value: "kyc_not_feasible" },
  { label: "Not responsive", value: "not_responsive" },
  { label: "Chose competitor", value: "competitor" },
  { label: "Other (specify)", value: "other" }
];

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
  riskAppetite: string;
  securityPreference: string;
  tenurePreference: string;
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
  riskAppetite: "",
  securityPreference: "",
  tenurePreference: "",
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
    if (section3.lenderOnboarded === "yes" && !section3.dateOfOnboarding) {
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
                  {stateOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {sourceOfLeadOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lender Type*</label>
                <select
                  className="form-select"
                  value={formState.section1.lenderCategory}
                  onChange={(e) => updateSection1("lenderCategory", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select type</option>
                  {lenderTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {investmentPreferenceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {complianceConstraintsOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Risk Appetite</label>
                <select
                  className="form-select"
                  value={formState.section1.riskAppetite}
                  onChange={(e) => updateSection1("riskAppetite", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select risk appetite</option>
                  {riskAppetiteOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Security Preference</label>
                <select
                  className="form-select"
                  value={formState.section1.securityPreference}
                  onChange={(e) => updateSection1("securityPreference", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select security preference</option>
                  {securityPreferenceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Tenure Preference</label>
                <select
                  className="form-select"
                  value={formState.section1.tenurePreference}
                  onChange={(e) => updateSection1("tenurePreference", e.target.value)}
                  disabled={formState.section1Submitted}
                >
                  <option value="">Select tenure</option>
                  {tenurePreferenceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                <label className="form-label">Date & Time*</label>
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
                  {cityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {ticketSizeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {targetReturnOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {outcomeOfMeetingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                  {leadQualityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                visitModeOptions={followupVisitModeOptions}
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
                {closureLenderOnboardedOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
                {followupVisitModeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">
                Date of onboarding{formState.section3.lenderOnboarded === "yes" ? "*" : ""}
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
