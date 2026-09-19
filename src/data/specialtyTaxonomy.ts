import { DentalSpecialty } from '../types';

export interface TaxonomySpecialtyRule {
  specialty: DentalSpecialty;
  description: string;
  defaultSuggestedAction: string;
  procedures: {
    name: string;
    keywords: string[];
    defaultAction?: string;
  }[];
}

export const SPECIALTY_TAXONOMY: TaxonomySpecialtyRule[] = [
  {
    specialty: 'Orthodontics',
    description: 'Correction of teeth alignment, bite issues, and jaw irregularities using braces and clear aligners.',
    defaultSuggestedAction: 'Offer an approved orthodontic consultation booking option and send digital aligner guide.',
    procedures: [
      {
        name: 'Braces / Orthodontic Consultation',
        keywords: ['brace', 'braces', 'metal brace', 'ceramic brace', 'straighten', 'crooked teeth', 'gap between teeth', 'overbite', 'underbite', 'crossbite'],
        defaultAction: 'Offer an approved orthodontic consultation slot and send treatment timeline guide.'
      },
      {
        name: 'Clear Aligners / Invisalign',
        keywords: ['invisalign', 'clear aligner', 'aligner', 'aligners', 'invisible brace', 'night aligner', '3d scan'],
        defaultAction: 'Offer a complimentary 3D digital scan consult and clear aligner brochure.'
      },
      {
        name: 'Retainers & Maintenance',
        keywords: ['retainer', 'retainers', 'wire retainer', 'clear retainer', 'teeth shifted after braces'],
        defaultAction: 'Schedule retainer assessment or replacement fabrication appointment.'
      }
    ]
  },
  {
    specialty: 'Periodontics',
    description: 'Prevention, diagnosis, and treatment of gum disease and periodontal tissue inflammation.',
    defaultSuggestedAction: 'Schedule periodontal screening and clinical gum health assessment with hygienist.',
    procedures: [
      {
        name: 'Gum Health Evaluation & Treatment',
        keywords: ['bleeding gum', 'bleeding gums', 'gums bleed', 'gum disease', 'gingivitis', 'periodontitis', 'swollen gum', 'swollen gums', 'tender gum', 'gum infection'],
        defaultAction: 'Schedule clinical gum evaluation and review brushing technique.'
      },
      {
        name: 'Deep Cleaning (Scaling & Root Planing)',
        keywords: ['deep cleaning', 'root planing', 'scaling and root planing', 'pocket depth', 'gum pocket', 'periodontal cleaning'],
        defaultAction: 'Offer periodontal deep cleaning assessment and explain quadrant scaling.'
      },
      {
        name: 'Gum Recession Evaluation',
        keywords: ['gum recession', 'receding gum', 'receding gums', 'exposed root', 'gum graft'],
        defaultAction: 'Book an examination with periodontics coordinator to inspect margin recession.'
      }
    ]
  },
  {
    specialty: 'Endodontics',
    description: 'Diagnosis and treatment of the dental pulp and interior root tissues.',
    defaultSuggestedAction: 'Prioritize diagnostic assessment to evaluate tooth pulp vitality and offer endodontic consult.',
    procedures: [
      {
        name: 'Root Canal Treatment & Evaluation',
        keywords: ['root canal', 'root canals', 'endodontic', 'pulp', 'infected nerve', 'nerve pain', 'throbbing pain', 'hot and cold sensitivity', 'severe toothache', 'abscess'],
        defaultAction: 'Prioritize prompt diagnostic exam and periapical X-ray evaluation.'
      },
      {
        name: 'Root Canal Retreatment',
        keywords: ['retreatment', 'failed root canal', 're-infection after root canal'],
        defaultAction: 'Schedule specialized endodontic evaluation for previous root therapy.'
      }
    ]
  },
  {
    specialty: 'Prosthodontics',
    description: 'Restoration and replacement of missing or damaged teeth using crowns, bridges, and dentures.',
    defaultSuggestedAction: 'Invite for restorative assessment and discuss prosthetic replacement options.',
    procedures: [
      {
        name: 'Dental Crowns & Caps',
        keywords: ['crown', 'crowns', 'dental cap', 'porcelain crown', 'ceramic crown', 'loose crown', 'cracked crown', 'gold crown'],
        defaultAction: 'Schedule examination and margin integrity evaluation for crown restoration.'
      },
      {
        name: 'Dental Bridges',
        keywords: ['bridge', 'bridges', 'dental bridge', 'cantilever bridge'],
        defaultAction: 'Offer restorative consultation to examine abutment teeth and bridge options.'
      },
      {
        name: 'Dentures (Full / Partial)',
        keywords: ['denture', 'dentures', 'false teeth', 'partial denture', 'full denture', 'denture repair', 'reline'],
        defaultAction: 'Book prosthetic fitting or relining consultation with front desk.'
      }
    ]
  },
  {
    specialty: 'Oral & Maxillofacial Surgery',
    description: 'Surgical management of impacted teeth, complex extractions, and facial bone structures.',
    defaultSuggestedAction: 'Offer oral surgical consultation and review panoramic diagnostic imaging requirements.',
    procedures: [
      {
        name: 'Wisdom Tooth Removal & Extraction',
        keywords: ['wisdom tooth', 'wisdom teeth', 'impacted tooth', 'impacted wisdom', 'wisdom extraction', 'third molar', 'surgical removal'],
        defaultAction: 'Schedule surgical evaluation and request panoramic X-ray (OPG).'
      },
      {
        name: 'Complex Surgical Extraction',
        keywords: ['extraction', 'pull tooth', 'tooth removal', 'broken root', 'surgical extraction'],
        defaultAction: 'Assess necessity for surgical buffer chair and discuss sedation options.'
      },
      {
        name: 'Jaw & TMJ Evaluation',
        keywords: ['jaw pain', 'tmj', 'tmd', 'clicking jaw', 'lockjaw', 'jaw surgery'],
        defaultAction: 'Schedule maxillofacial consultation for joint and bite dynamics.'
      }
    ]
  },
  {
    specialty: 'Cosmetic Dentistry',
    description: 'Aesthetic enhancement of the smile, tooth color, shape, and overall appearance.',
    defaultSuggestedAction: 'Send approved cosmetic treatment flyer and invite to complimentary smile assessment.',
    procedures: [
      {
        name: 'Teeth Whitening (In-Office / Take-Home)',
        keywords: ['whiten', 'whitening', 'bleach', 'bleaching', 'yellow teeth', 'stained teeth', 'laser whitening', 'zoom whitening', 'brighten smile'],
        defaultAction: 'Send cosmetic whitening pricing tier guide and schedule shade assessment.'
      },
      {
        name: 'Dental Veneers & Laminates',
        keywords: ['veneer', 'veneers', 'porcelain veneer', 'composite veneer', 'laminate', 'hollywood smile'],
        defaultAction: 'Offer cosmetic consultation to review custom ceramic veneer designs.'
      },
      {
        name: 'Cosmetic Bonding & Contouring',
        keywords: ['bonding', 'cosmetic bonding', 'chipped edge', 'reshaping teeth', 'smile makeover'],
        defaultAction: 'Schedule aesthetic smile consultation to discuss composite bonding.'
      }
    ]
  },
  {
    specialty: 'Implant Dentistry',
    description: 'Permanent surgical replacement of missing tooth roots with biocompatible titanium/zirconia implants.',
    defaultSuggestedAction: 'Offer dental implant candidacy consultation and provide restorative fee breakdown.',
    procedures: [
      {
        name: 'Dental Implant Placement & Consult',
        keywords: ['implant', 'implants', 'dental implant', 'titanium implant', 'missing tooth', 'lost a tooth', 'replace missing tooth', 'tooth gap', 'all on 4', 'all on 6'],
        defaultAction: 'Offer comprehensive implant consultation including 3D CBCT bone scan evaluation.'
      },
      {
        name: 'Implant Crown & Restoration',
        keywords: ['implant crown', 'implant abutment', 'screw retained crown'],
        defaultAction: 'Book prosthetic stage consultation for custom implant crown placement.'
      }
    ]
  },
  {
    specialty: 'Pediatric Dentistry',
    description: 'Gentle, preventive and restorative dental care tailored specifically for infants, children, and teens.',
    defaultSuggestedAction: 'Reassure parent regarding gentle pediatric protocol and book introductory visit.',
    procedures: [
      {
        name: 'Children’s Dental Check-up & Gentle Care',
        keywords: ['child', 'children', 'kid', 'kids', 'toddler', 'baby teeth', 'pediatric', 'first dental visit', 'sealants', 'fluoride'],
        defaultAction: 'Reassure parent regarding gentle protocol and reserve a relaxed pediatric slot.'
      }
    ]
  },
  {
    specialty: 'General Dentistry',
    description: 'Primary dental care focusing on preventive exams, cleanings, standard fillings, and initial triage.',
    defaultSuggestedAction: 'Offer standard initial examination, digital bitewings, and routine hygiene cleaning.',
    procedures: [
      {
        name: 'Routine Check-up & Professional Cleaning',
        keywords: ['cleaning', 'routine cleaning', 'hygiene', 'checkup', 'check up', 'routine check', 'general exam', 'dental exam', 'annual visit', 'scaling', 'polish'],
        defaultAction: 'Offer new-patient preventive appointment and confirm insurance eligibility.'
      },
      {
        name: 'Composite Dental Fillings',
        keywords: ['filling', 'fillings', 'cavity', 'cavities', 'tooth decay', 'chipped tooth', 'cracked tooth', 'broken tooth', 'toothache', 'tooth pain'],
        defaultAction: 'Schedule restorative examination to evaluate tooth restoration.'
      },
      {
        name: 'General Dental Consultation',
        keywords: ['consultation', 'second opinion', 'general question', 'advice', 'teeth check'],
        defaultAction: 'Offer standard general dental consultation with front-desk staff.'
      }
    ]
  }
];

export const INTENT_CATEGORIES = [
  'Consultation Request',
  'Appointment Request',
  'Pricing Enquiry',
  'Information Request',
  'Urgent Review Request',
  'Reschedule Request',
  'Booking Confirmation'
] as const;

export type IntentCategory = typeof INTENT_CATEGORIES[number];
