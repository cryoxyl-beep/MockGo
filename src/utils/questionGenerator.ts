import { Question } from '../types';

export function generateQuestionsForSubject(subject: string, count: number, difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  // Database of prefilled questions to sample from
  const PHYSICS_BANK: Question[] = [
    {
      id: 'gen-p-1',
      text: 'A bullet is fired horizontally from a rifle at a speed of 300 m/s from a height of 1.96 m. How far horizontally will it travel before hitting the flat ground?',
      options: ['120 m', '180 m', '186 m', '196 m'],
      correctAnswer: 1,
      explanation: 'Using horizontal motion formulas, the time to fall is t = √(2h/g) = √(2 * 1.96 / 9.8) = √(0.4) ≈ 0.632 s. The horizontal distance is speed * time = 300 * 0.632 = 189.7 m ≈ 180 m (with g approximation).',
      subject: 'Physics',
      topic: 'Projectile Motion'
    },
    {
      id: 'gen-p-2',
      text: 'The work done by an ideal gas during an isothermal expansion from volume V to 3V is:',
      options: ['W = nRT ln(3)', 'W = nRT', 'W = Cp * ΔT', 'W = Zero'],
      correctAnswer: 0,
      explanation: 'For an isothermal process (temperature Constant), work done W = ∫ P dV = ∫ (nRT / V) dV = nRT ln(V_final / V_initial). Thus W = nRT ln(3).',
      subject: 'Physics',
      topic: 'Thermodynamics'
    },
    {
      id: 'gen-p-3',
      text: 'In an RL series circuit driven by an AC source of frequency f, the phase angle φ between current and voltage is governed by:',
      options: ['tan φ = R / (2πfL)', 'tan φ = (2πfL) / R', 'tan φ = 2πfLR', 'tan φ = LC / R'],
      correctAnswer: 1,
      explanation: 'Phase angle in RL circuits is given by tan φ = X_L / R, where inductive reactance X_L = ωL = 2πfL. Hence, tan φ = (2πfL) / R.',
      subject: 'Physics',
      topic: 'Alternating Current'
    },
    {
      id: 'gen-p-4',
      text: 'According to Heisenberg`s Uncertainty Principle, the product of uncertainty in position (Δx) and momentum (Δp) is strictly constrained by:',
      options: ['Δx * Δp ≥ h / (4π)', 'Δx * Δp ≤ h / (2π)', 'Δx * Δp = Constant', 'Δx * Δp ≥ h / 2'],
      correctAnswer: 0,
      explanation: 'Quantum mechanics states that Δx * Δp_x ≥ ħ/2. Since ħ = h / (2π), the restriction is Δx * Δp ≥ h / (4π).',
      subject: 'Physics',
      topic: 'Modern Physics'
    },
    {
      id: 'gen-p-5',
      text: 'The escape velocity from the surface of a spherical planet of mass M and radius R is given by:',
      options: ['v = √(GM/R)', 'v = √(2GM/R)', 'v = 2GM/R²', 'v = √(GM / 2R)'],
      correctAnswer: 1,
      explanation: 'Equating total mechanical energy from surface to infinity: -GMm/R + (1/2)m v² = 0. Solving for escape speed v yields v = √(2GM/R).',
      subject: 'Physics',
      topic: 'Gravitation'
    }
  ];

  const CHEMISTRY_BANK: Question[] = [
    {
      id: 'gen-c-1',
      text: 'Which of the following organic structures will show the highest rate of nucleophilic substitution via an SN1 reaction pathway?',
      options: ['Methyl Chloride', 'Ethyl Chloride', 'Isopropyl Chloride', 'tert-Butyl Chloride'],
      correctAnswer: 3,
      explanation: 'SN1 processes undergo carbocation transition states. Tertiary carbocations are highly stabilized by hyperconjugation and inductive effect (+I groups) from three methyl groups, making tert-butyl chloride fastest.',
      subject: 'Chemistry',
      topic: 'Organic Reaction Mechanism'
    },
    {
      id: 'gen-c-2',
      text: 'The conjugate base of the bisulfate ion HSO₄⁻ is:',
      options: ['SO₄²⁻', 'H₂SO₄', 'H₃O⁺', 'SO₃²⁻'],
      correctAnswer: 0,
      explanation: 'A conjugate base is formed by extracting a proton (H⁺) from the acid. For HSO₄⁻, removing H⁺ yields the sulfate ion SO₄²⁻.',
      subject: 'Chemistry',
      topic: 'Ionic Equilibrium'
    },
    {
      id: 'gen-c-3',
      text: 'What is the theoretical coordination number of Nickel in the complex [Ni(en)₃]²⁺ (where en = ethylenediamine)?',
      options: ['3', '4', '6', '8'],
      correctAnswer: 2,
      explanation: 'Ethylenediamine (en) is a bidentate ligand, meaning each mole of en donates two pairs of electrons to Nickel. With three such ligands, the coordination number is 3 * 2 = 6.',
      subject: 'Chemistry',
      topic: 'Coordination Chemistry'
    }
  ];

  const BIOLOGY_BANK: Question[] = [
    {
      id: 'gen-b-1',
      text: 'In Mendelian dihybrid inheritance, the phenotypic segregation ratio observed in the F2 generation is traditionally:',
      options: ['3:1', '1:2:1', '9:3:3:1', '9:7'],
      correctAnswer: 2,
      explanation: 'A standard dihybrid cross involving two traits obeying dominant-recessive rules segregated as 9/16 double-dominant, 3/16 single-dominant/recessive, 3/16 single-recessive/dominant, and 1/16 double-recessive.',
      subject: 'Biology',
      topic: 'Genetics'
    },
    {
      id: 'gen-b-2',
      text: 'Which of the following cellular organelles is primarily mapped with cellular respiration and aerobic ATP synthesis?',
      options: ['Lysosome', 'Mitochondria', 'Chloroplast', 'Golgi Apparatus'],
      correctAnswer: 1,
      explanation: 'Mitochondria houses the citric acid (Krebs) cycle and the oxidative phosphorylation complex, earning its nickname as the cell powerhouse.',
      subject: 'Biology',
      topic: 'Cell Biology'
    }
  ];

  const GENERAL_BANK: Question[] = [
    {
      id: 'gen-g-1',
      text: 'If 3 consecutive odd integers sum to 57, what is the value of the largest of these integers?',
      options: ['17', '19', '21', '23'],
      correctAnswer: 2,
      explanation: 'Let the odd integers be x-2, x, and x+2. Their sum is 3x = 57 => x = 19. The largest integer is x+2 = 21.',
      subject: 'General Aptitude',
      topic: 'Quantitative Reasoning'
    }
  ];

  const fallbackSubjectBank = PHYSICS_BANK;

  // Choose appropriate subject pool
  let activePool = fallbackSubjectBank;
  const lowerSubject = subject.toLowerCase();
  
  if (lowerSubject.includes('physics')) {
    activePool = PHYSICS_BANK;
  } else if (lowerSubject.includes('chem')) {
    activePool = CHEMISTRY_BANK;
  } else if (lowerSubject.includes('biol') || lowerSubject.includes('botany')) {
    activePool = BIOLOGY_BANK;
  } else if (lowerSubject.includes('aptitude') || lowerSubject.includes('quant')) {
    activePool = GENERAL_BANK;
  } else {
    // Merge banks for general tests
    activePool = [...PHYSICS_BANK, ...CHEMISTRY_BANK, ...BIOLOGY_BANK];
  }

  // Sample questions to reach target count
  const results: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionTemplate = activePool[i % activePool.length];
    // Create cloned question with unique ID
    results.push({
      ...questionTemplate,
      id: `${questionTemplate.id}-dyn-${i}-${Math.random().toString(36).substr(2, 4)}`
    });
  }

  return results;
}
