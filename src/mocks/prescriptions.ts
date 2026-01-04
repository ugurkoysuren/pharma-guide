import { MedicationForm } from '../types';

export interface PrescriptionRequirement {
  medication_name: string;
  requires_prescription: boolean;
  prescriber_types: string[];
  notes: string;
  notes_de?: string;
  forms: MedicationForm[];
}

export const prescriptionRequirements: Record<string, PrescriptionRequirement> = {
  claritin: {
    medication_name: 'Claritin',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'Over-the-counter antihistamine. No prescription required.',
    notes_de: 'Rezeptfreies Antihistaminikum. Kein Rezept erforderlich.',
    forms: [MedicationForm.TABLET],
  },
  omeprazole: {
    medication_name: 'Omeprazole',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'Available OTC for short-term use (14 days). Consult pharmacist for longer use.',
    notes_de: 'Rezeptfrei für Kurzzeitanwendung (14 Tage). Bei längerer Anwendung Apotheker konsultieren.',
    forms: [MedicationForm.CAPSULE, MedicationForm.TABLET],
  },
  tylenol: {
    medication_name: 'Tylenol',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'Over-the-counter pain reliever. Follow dosage instructions carefully.',
    notes_de: 'Rezeptfreies Schmerzmittel. Dosierungsanweisungen sorgfältig befolgen.',
    forms: [MedicationForm.TABLET, MedicationForm.CAPSULE, MedicationForm.SYRUP],
  },
  ibuprofen: {
    medication_name: 'Ibuprofen',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'OTC NSAID. Higher strengths (600mg+) may require prescription.',
    notes_de: 'Rezeptfreies NSAR. Höhere Dosierungen (600mg+) können rezeptpflichtig sein.',
    forms: [MedicationForm.TABLET, MedicationForm.CAPSULE, MedicationForm.SYRUP],
  },
  amoxicillin: {
    medication_name: 'Amoxicillin',
    requires_prescription: true,
    prescriber_types: ['Physician', 'Nurse Practitioner', 'Physician Assistant'],
    notes: 'Antibiotic. Valid prescription must be less than 6 months old.',
    notes_de: 'Antibiotikum. Gültiges Rezept darf nicht älter als 6 Monate sein.',
    forms: [MedicationForm.CAPSULE, MedicationForm.TABLET, MedicationForm.SYRUP],
  },
  lisinopril: {
    medication_name: 'Lisinopril',
    requires_prescription: true,
    prescriber_types: ['Physician', 'Nurse Practitioner', 'Physician Assistant'],
    notes: 'ACE inhibitor for blood pressure. Requires regular monitoring.',
    notes_de: 'ACE-Hemmer für Blutdruck. Regelmäßige Überwachung erforderlich.',
    forms: [MedicationForm.TABLET],
  },
  metformin: {
    medication_name: 'Metformin',
    requires_prescription: true,
    prescriber_types: ['Physician', 'Endocrinologist', 'Nurse Practitioner'],
    notes: 'Diabetes medication. Regular blood glucose monitoring recommended.',
    notes_de: 'Diabetes-Medikament. Regelmäßige Blutzuckerkontrolle empfohlen.',
    forms: [MedicationForm.TABLET],
  },
  atorvastatin: {
    medication_name: 'Atorvastatin',
    requires_prescription: true,
    prescriber_types: ['Physician', 'Cardiologist', 'Nurse Practitioner'],
    notes: 'Statin for cholesterol. Regular liver function tests recommended.',
    notes_de: 'Statin für Cholesterin. Regelmäßige Leberfunktionstests empfohlen.',
    forms: [MedicationForm.TABLET],
  },
  cetirizine: {
    medication_name: 'Cetirizine',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'OTC antihistamine. Less sedating than first-generation antihistamines.',
    notes_de: 'Rezeptfreies Antihistaminikum. Weniger sedierend als Antihistaminika der ersten Generation.',
    forms: [MedicationForm.TABLET, MedicationForm.SYRUP],
  },
  diphenhydramine: {
    medication_name: 'Diphenhydramine',
    requires_prescription: false,
    prescriber_types: [],
    notes: 'OTC antihistamine. Causes significant drowsiness. Do not drive.',
    notes_de: 'Rezeptfreies Antihistaminikum. Verursacht erhebliche Schläfrigkeit. Nicht fahren.',
    forms: [MedicationForm.TABLET, MedicationForm.CAPSULE, MedicationForm.SYRUP],
  },
};

export function findPrescriptionRequirement(
  medicationName: string
): PrescriptionRequirement | undefined {
  const normalizedName = medicationName.toLowerCase().trim();
  return prescriptionRequirements[normalizedName];
}

export function getMedicationsRequiringPrescription(): string[] {
  return Object.values(prescriptionRequirements)
    .filter((req) => req.requires_prescription)
    .map((req) => req.medication_name);
}
