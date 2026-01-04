import { Locale } from '../types';

export interface MedicationData {
  name: string;
  name_de?: string;
  strengths: number[];
  active_ingredients: string[];
  active_ingredients_de?: string[];
  dosage_instructions: Record<number, string>;
  dosage_instructions_de?: Record<number, string>;
  requires_prescription: boolean;
  warnings: string[];
  warnings_de?: string[];
}

export const medications: Record<string, MedicationData> = {
  claritin: {
    name: 'Claritin',
    name_de: 'Claritin',
    strengths: [10],
    active_ingredients: ['Loratadine'],
    active_ingredients_de: ['Loratadin'],
    dosage_instructions: {
      10: 'Take 1 tablet once daily. Do not exceed recommended dose.',
    },
    dosage_instructions_de: {
      10: 'Nehmen Sie 1 Tablette einmal täglich ein. Überschreiten Sie nicht die empfohlene Dosis.',
    },
    requires_prescription: false,
    warnings: ['May cause drowsiness', 'Avoid alcohol'],
    warnings_de: ['Kann Schläfrigkeit verursachen', 'Alkohol vermeiden'],
  },
  omeprazole: {
    name: 'Omeprazole',
    name_de: 'Omeprazol',
    strengths: [20, 40],
    active_ingredients: ['Omeprazole'],
    active_ingredients_de: ['Omeprazol'],
    dosage_instructions: {
      20: 'Take 1 capsule daily before a meal. Swallow whole, do not crush.',
      40: 'Take 1 capsule daily before a meal as directed by physician.',
    },
    dosage_instructions_de: {
      20: 'Nehmen Sie 1 Kapsel täglich vor einer Mahlzeit ein. Ganz schlucken, nicht zerkauen.',
      40: 'Nehmen Sie 1 Kapsel täglich vor einer Mahlzeit nach Anweisung des Arztes ein.',
    },
    requires_prescription: false,
    warnings: ['Long-term use may affect vitamin B12 absorption'],
    warnings_de: ['Langzeitanwendung kann die Vitamin-B12-Aufnahme beeinträchtigen'],
  },
  tylenol: {
    name: 'Tylenol',
    name_de: 'Tylenol',
    strengths: [325, 500, 650],
    active_ingredients: ['Acetaminophen'],
    active_ingredients_de: ['Paracetamol'],
    dosage_instructions: {
      325: 'Take 1-2 tablets every 4-6 hours. Max 10 tablets in 24 hours.',
      500: 'Take 1-2 tablets every 4-6 hours. Max 6 tablets in 24 hours.',
      650: 'Take 1 tablet every 4-6 hours. Max 6 tablets in 24 hours.',
    },
    dosage_instructions_de: {
      325: 'Nehmen Sie 1-2 Tabletten alle 4-6 Stunden. Maximal 10 Tabletten in 24 Stunden.',
      500: 'Nehmen Sie 1-2 Tabletten alle 4-6 Stunden. Maximal 6 Tabletten in 24 Stunden.',
      650: 'Nehmen Sie 1 Tablette alle 4-6 Stunden. Maximal 6 Tabletten in 24 Stunden.',
    },
    requires_prescription: false,
    warnings: ['Do not exceed recommended dose', 'Avoid alcohol', 'Liver warning'],
    warnings_de: ['Empfohlene Dosis nicht überschreiten', 'Alkohol vermeiden', 'Leberwarnung'],
  },
  ibuprofen: {
    name: 'Ibuprofen',
    name_de: 'Ibuprofen',
    strengths: [200, 400, 600],
    active_ingredients: ['Ibuprofen'],
    active_ingredients_de: ['Ibuprofen'],
    dosage_instructions: {
      200: 'Take 1-2 tablets every 4-6 hours with food. Max 6 tablets in 24 hours.',
      400: 'Take 1 tablet every 6-8 hours with food. Max 3 tablets in 24 hours.',
      600: 'Take 1 tablet every 6-8 hours with food as directed by physician.',
    },
    dosage_instructions_de: {
      200: 'Nehmen Sie 1-2 Tabletten alle 4-6 Stunden mit Nahrung ein. Maximal 6 Tabletten in 24 Stunden.',
      400: 'Nehmen Sie 1 Tablette alle 6-8 Stunden mit Nahrung ein. Maximal 3 Tabletten in 24 Stunden.',
      600: 'Nehmen Sie 1 Tablette alle 6-8 Stunden mit Nahrung nach Anweisung des Arztes ein.',
    },
    requires_prescription: false,
    warnings: ['Not for children under 12', 'Take with food', 'NSAIDs warning'],
    warnings_de: ['Nicht für Kinder unter 12 Jahren', 'Mit Nahrung einnehmen', 'NSAR-Warnung'],
  },
  amoxicillin: {
    name: 'Amoxicillin',
    name_de: 'Amoxicillin',
    strengths: [250, 500, 875],
    active_ingredients: ['Amoxicillin'],
    active_ingredients_de: ['Amoxicillin'],
    dosage_instructions: {
      250: 'Take as directed by physician. Complete full course of treatment.',
      500: 'Take 1 capsule every 8 hours. Complete full course of treatment.',
      875: 'Take 1 tablet every 12 hours with food. Complete full course.',
    },
    dosage_instructions_de: {
      250: 'Nach Anweisung des Arztes einnehmen. Behandlung vollständig abschließen.',
      500: 'Nehmen Sie 1 Kapsel alle 8 Stunden ein. Behandlung vollständig abschließen.',
      875: 'Nehmen Sie 1 Tablette alle 12 Stunden mit Nahrung ein. Behandlung vollständig abschließen.',
    },
    requires_prescription: true,
    warnings: ['Antibiotic', 'May cause allergic reaction', 'Take with or without food'],
    warnings_de: ['Antibiotikum', 'Kann allergische Reaktion verursachen', 'Mit oder ohne Nahrung einnehmen'],
  },
  lisinopril: {
    name: 'Lisinopril',
    name_de: 'Lisinopril',
    strengths: [5, 10, 20, 40],
    active_ingredients: ['Lisinopril'],
    active_ingredients_de: ['Lisinopril'],
    dosage_instructions: {
      5: 'Take 1 tablet once daily. Monitor blood pressure regularly.',
      10: 'Take 1 tablet once daily. Monitor blood pressure regularly.',
      20: 'Take 1 tablet once daily. Monitor blood pressure regularly.',
      40: 'Take 1 tablet once daily. Monitor blood pressure regularly.',
    },
    dosage_instructions_de: {
      5: 'Nehmen Sie 1 Tablette einmal täglich ein. Blutdruck regelmäßig kontrollieren.',
      10: 'Nehmen Sie 1 Tablette einmal täglich ein. Blutdruck regelmäßig kontrollieren.',
      20: 'Nehmen Sie 1 Tablette einmal täglich ein. Blutdruck regelmäßig kontrollieren.',
      40: 'Nehmen Sie 1 Tablette einmal täglich ein. Blutdruck regelmäßig kontrollieren.',
    },
    requires_prescription: true,
    warnings: ['ACE inhibitor', 'May cause dizziness', 'Avoid potassium supplements'],
    warnings_de: ['ACE-Hemmer', 'Kann Schwindel verursachen', 'Kaliumergänzungen vermeiden'],
  },
  metformin: {
    name: 'Metformin',
    name_de: 'Metformin',
    strengths: [500, 850, 1000],
    active_ingredients: ['Metformin Hydrochloride'],
    active_ingredients_de: ['Metforminhydrochlorid'],
    dosage_instructions: {
      500: 'Take with meals as directed by physician. Do not crush extended-release tablets.',
      850: 'Take with meals as directed by physician.',
      1000: 'Take with meals as directed by physician. Do not crush extended-release tablets.',
    },
    dosage_instructions_de: {
      500: 'Mit Mahlzeiten nach Anweisung des Arztes einnehmen. Retardtabletten nicht zerkauen.',
      850: 'Mit Mahlzeiten nach Anweisung des Arztes einnehmen.',
      1000: 'Mit Mahlzeiten nach Anweisung des Arztes einnehmen. Retardtabletten nicht zerkauen.',
    },
    requires_prescription: true,
    warnings: ['For diabetes', 'Take with food to reduce stomach upset', 'Avoid alcohol'],
    warnings_de: ['Für Diabetes', 'Mit Nahrung einnehmen zur Vermeidung von Magenbeschwerden', 'Alkohol vermeiden'],
  },
  atorvastatin: {
    name: 'Atorvastatin',
    name_de: 'Atorvastatin',
    strengths: [10, 20, 40, 80],
    active_ingredients: ['Atorvastatin Calcium'],
    active_ingredients_de: ['Atorvastatin-Calcium'],
    dosage_instructions: {
      10: 'Take 1 tablet once daily, preferably in the evening.',
      20: 'Take 1 tablet once daily, preferably in the evening.',
      40: 'Take 1 tablet once daily, preferably in the evening.',
      80: 'Take 1 tablet once daily, preferably in the evening.',
    },
    dosage_instructions_de: {
      10: 'Nehmen Sie 1 Tablette einmal täglich ein, vorzugsweise abends.',
      20: 'Nehmen Sie 1 Tablette einmal täglich ein, vorzugsweise abends.',
      40: 'Nehmen Sie 1 Tablette einmal täglich ein, vorzugsweise abends.',
      80: 'Nehmen Sie 1 Tablette einmal täglich ein, vorzugsweise abends.',
    },
    requires_prescription: true,
    warnings: ['Statin medication', 'Avoid grapefruit', 'Report muscle pain'],
    warnings_de: ['Statin-Medikament', 'Grapefruit vermeiden', 'Muskelschmerzen melden'],
  },
  cetirizine: {
    name: 'Cetirizine',
    name_de: 'Cetirizin',
    strengths: [5, 10],
    active_ingredients: ['Cetirizine Hydrochloride'],
    active_ingredients_de: ['Cetirizindihydrochlorid'],
    dosage_instructions: {
      5: 'Take 1-2 tablets once daily. May be taken with or without food.',
      10: 'Take 1 tablet once daily. May be taken with or without food.',
    },
    dosage_instructions_de: {
      5: 'Nehmen Sie 1-2 Tabletten einmal täglich ein. Kann mit oder ohne Nahrung eingenommen werden.',
      10: 'Nehmen Sie 1 Tablette einmal täglich ein. Kann mit oder ohne Nahrung eingenommen werden.',
    },
    requires_prescription: false,
    warnings: ['May cause drowsiness', 'Antihistamine'],
    warnings_de: ['Kann Schläfrigkeit verursachen', 'Antihistaminikum'],
  },
  diphenhydramine: {
    name: 'Diphenhydramine',
    name_de: 'Diphenhydramin',
    strengths: [25, 50],
    active_ingredients: ['Diphenhydramine Hydrochloride'],
    active_ingredients_de: ['Diphenhydraminhydrochlorid'],
    dosage_instructions: {
      25: 'Take 1-2 tablets every 4-6 hours. Do not exceed 12 tablets in 24 hours.',
      50: 'Take 1 tablet every 4-6 hours. Do not exceed 6 tablets in 24 hours.',
    },
    dosage_instructions_de: {
      25: 'Nehmen Sie 1-2 Tabletten alle 4-6 Stunden. Maximal 12 Tabletten in 24 Stunden.',
      50: 'Nehmen Sie 1 Tablette alle 4-6 Stunden. Maximal 6 Tabletten in 24 Stunden.',
    },
    requires_prescription: false,
    warnings: ['Causes drowsiness', 'Do not drive', 'Avoid alcohol'],
    warnings_de: ['Verursacht Schläfrigkeit', 'Nicht fahren', 'Alkohol vermeiden'],
  },
};

export function findMedication(name: string): MedicationData | undefined {
  const normalizedName = name.toLowerCase().trim();
  return medications[normalizedName];
}

export function getMedicationNames(): string[] {
  return Object.values(medications).map((m) => m.name);
}
