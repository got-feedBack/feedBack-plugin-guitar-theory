(function() {
"use strict";

// === notes.js ===
// Chromatic scale - 12 notes
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enharmonic equivalents for display
const ENHARMONIC = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

// Get display name for dropdown (shows enharmonic equivalents)
function getNoteDisplayName(note) {
  if (ENHARMONIC[note]) {
    // Replace # with ♯ and add flat equivalent with ♭
    return note.replace('#', '♯') + '/' + ENHARMONIC[note].replace('b', '♭');
  }
  // Natural notes remain unchanged
  return note;
}

// Get note index (0-11)
function getNoteIndex(note) {
  const normalized = note.replace('b', '#');
  // Handle flats
  if (note.includes('b')) {
    const baseNote = note[0];
    const baseIndex = NOTES.indexOf(baseNote);
    return (baseIndex - 1 + 12) % 12;
  }
  return NOTES.indexOf(normalized);
}

// Get note at specific interval from root
function getNoteAtInterval(rootNote, semitones) {
  const rootIndex = getNoteIndex(rootNote);
  const targetIndex = (rootIndex + semitones) % 12;
  return NOTES[targetIndex];
}

// Get note on fretboard given string open note and fret number
function getNoteOnFret(openNote, fret) {
  return getNoteAtInterval(openNote, fret);
}

// Standard number of frets
const FRET_COUNT = 22;

// Fret marker positions (dots on fretboard)
const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_MARKERS = [12, 24]; // Octave markers (double dots)

// === scales.js ===
// Scale definitions with intervals (in semitones from root)
// Intervals array: each number is semitones from the root note

const SCALES = {
  major: {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    formula: 'W-W-H-W-W-W-H',
    description: 'The foundation of Western music theory'
  },
  naturalMinor: {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    formula: 'W-H-W-W-H-W-W',
    description: 'The relative minor scale'
  },
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    formula: 'W-H-W-W-H-3H-H',
    description: 'Natural minor with raised 7th'
  },
  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    formula: 'W-H-W-W-W-W-H',
    description: 'Natural minor with raised 6th and 7th'
  },
  pentatonicMajor: {
    name: 'Pentatonic Major',
    intervals: [0, 2, 4, 7, 9],
    formula: 'W-W-3H-W-3H',
    description: 'Five-note major scale, great for soloing'
  },
  pentatonicMinor: {
    name: 'Pentatonic Minor',
    intervals: [0, 3, 5, 7, 10],
    formula: '3H-W-W-3H-W',
    description: 'Five-note minor scale, blues/rock staple'
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    formula: '3H-W-H-H-3H-W',
    description: 'Minor pentatonic with added b5 (blue note)'
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    formula: 'W-H-W-W-W-H-W',
    description: 'Minor scale with raised 6th, jazzy feel'
  },
  phrygian: {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    formula: 'H-W-W-W-H-W-W',
    description: 'Spanish/flamenco flavor'
  },
  lydian: {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    formula: 'W-W-W-H-W-W-H',
    description: 'Major scale with raised 4th, dreamy sound'
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    formula: 'W-W-H-W-W-H-W',
    description: 'Major scale with lowered 7th, dominant feel'
  },
  locrian: {
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    formula: 'H-W-W-H-W-W-W',
    description: 'Diminished scale, rarely used as tonic'
  },
  chromatic: {
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    formula: 'H-H-H-H-H-H-H-H-H-H-H-H',
    description: 'All 12 notes'
  }
};

// Interval names for display
const INTERVAL_NAMES = {
  0: 'R',   // Root
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7'
};

// Get scale options for selector
function getScaleOptions() {
  return Object.entries(SCALES).map(([key, scale]) => ({
    value: key,
    label: scale.name
  }));
}

// === chords.js ===
// Chord definitions with intervals (in semitones from root)

const CHORDS = {
  major: {
    name: 'Major',
    intervals: [0, 4, 7],
    formula: '1-3-5',
    description: 'Happy, bright sound',
    theoryContext: {
      commonUses: 'The foundation of Western music. Used as the "home" chord (I) in pop, rock, country, and folk. Creates feelings of happiness and resolution.',
      tensionResolution: 'Stable and resolved. The chord everything else wants to come back to.',
      relatedChords: ['minor', 'sus4', 'maj7', 'add9'],
      typicalProgressions: ['I-IV-V (most common in rock/pop)', 'I-V-vi-IV (pop anthem progression)']
    }
  },
  minor: {
    name: 'Minor',
    intervals: [0, 3, 7],
    formula: '1-b3-5',
    description: 'Sad, dark sound',
    theoryContext: {
      commonUses: 'Essential for emotional depth. The vi chord in major keys, or the i chord in minor keys. Common in ballads, rock, R&B, and any music expressing sadness or introspection.',
      tensionResolution: 'Moderate tension with a melancholic quality. Stable in minor keys, creates contrast in major keys.',
      relatedChords: ['major', 'diminished', 'min7', 'min9'],
      typicalProgressions: ['i-iv-v (natural minor)', 'vi-IV-I-V (pop progression from minor perspective)']
    }
  },
  diminished: {
    name: 'Diminished',
    intervals: [0, 3, 6],
    formula: '1-b3-b5',
    description: 'Tense, unstable sound',
    theoryContext: {
      commonUses: 'A passing chord that creates drama. Common in classical, jazz, and musical theater. Often used as the vii° chord leading to the I chord.',
      tensionResolution: 'High tension that demands resolution. Naturally wants to resolve up a half-step to a major or minor chord.',
      relatedChords: ['dim7', 'min7b5', 'minor'],
      typicalProgressions: ['vii°-I (leading tone resolution)', 'Used as chromatic passing chord between IV and V']
    }
  },
  augmented: {
    name: 'Augmented',
    intervals: [0, 4, 8],
    formula: '1-3-#5',
    description: 'Bright, unsettled sound',
    theoryContext: {
      commonUses: 'Creates dreamlike, mysterious moments. Used in film scores, progressive rock, and jazz. Often appears in Beatles songs and classical music for dramatic effect.',
      tensionResolution: 'Unstable and floating. Can resolve to either major or minor, creating ambiguity. The raised 5th wants to continue rising.',
      relatedChords: ['major', 'dom7', 'maj7'],
      typicalProgressions: ['I-I+-vi (chromatic bass line)', 'V+-I (enhanced dominant resolution)']
    }
  },
  sus2: {
    name: 'Suspended 2nd',
    intervals: [0, 2, 7],
    formula: '1-2-5',
    description: 'Open, unresolved sound',
    theoryContext: {
      commonUses: 'Creates an open, airy feel. Popular in ambient, folk, indie, and worship music. The Police and U2 use sus2 chords extensively.',
      tensionResolution: 'Suspended between major and minor - neither happy nor sad. Can resolve to major or minor, or stand alone for an ambiguous mood.',
      relatedChords: ['major', 'sus4', 'add9'],
      typicalProgressions: ['Isus2-I (subtle resolution)', 'Often used as a color chord without resolution']
    }
  },
  sus4: {
    name: 'Suspended 4th',
    intervals: [0, 5, 7],
    formula: '1-4-5',
    description: 'Tension waiting to resolve',
    theoryContext: {
      commonUses: 'Classic rock and pop anticipation chord. Creates tension before resolving to major. Essential in songs like "Pinball Wizard" and countless worship songs.',
      tensionResolution: 'The 4th degree pulls down to the 3rd, creating anticipation. More urgent tension than sus2. Almost always resolves to major.',
      relatedChords: ['major', 'sus2', 'dom7sus4'],
      typicalProgressions: ['Isus4-I (classic resolution)', 'Vsus4-V-I (extended dominant resolution)']
    }
  },
  dom7: {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    formula: '1-3-5-b7',
    description: 'Blues/jazz essential',
    theoryContext: {
      commonUses: 'The backbone of blues, jazz, and rock. As the V7 chord, it creates the strongest pull back to the I chord. Every 12-bar blues uses dominant 7ths throughout.',
      tensionResolution: 'Strong tension from the tritone between the 3rd and b7th. This interval desperately wants to resolve, making V7-I the most powerful resolution in music.',
      relatedChords: ['major', 'maj7', 'dom9', 'min7'],
      typicalProgressions: ['V7-I (strongest resolution)', 'I7-IV7-V7 (12-bar blues)', 'ii-V7-I (jazz standard)']
    }
  },
  maj7: {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    formula: '1-3-5-7',
    description: 'Smooth, jazzy sound',
    theoryContext: {
      commonUses: 'The sophisticated "jazz" chord. Common as the I chord in jazz, R&B, neo-soul, and bossa nova. Adds warmth and complexity to any major chord.',
      tensionResolution: 'Stable but colorful. The major 7th adds a dreamy quality without creating urgency to resolve. Can function as a resting point.',
      relatedChords: ['major', 'dom7', 'maj9', 'add9'],
      typicalProgressions: ['Imaj7-IVmaj7 (smooth jazz vamp)', 'IVmaj7-V7-Imaj7 (jazz cadence)']
    }
  },
  min7: {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    formula: '1-b3-5-b7',
    description: 'Mellow, soulful sound',
    theoryContext: {
      commonUses: 'The workhorse of jazz and soul. Functions as the ii chord in major keys (ii-V-I). Essential in R&B, neo-soul, and any music needing smooth, mellow color.',
      tensionResolution: 'Gentle tension that flows naturally to dominant chords. More relaxed than plain minor. Creates movement without urgency.',
      relatedChords: ['minor', 'dom7', 'min9', 'maj7'],
      typicalProgressions: ['ii7-V7-Imaj7 (the jazz progression)', 'i7-iv7 (minor groove)']
    }
  },
  dim7: {
    name: 'Diminished 7th',
    intervals: [0, 3, 6, 9],
    formula: '1-b3-b5-bb7',
    description: 'Symmetrical, mysterious',
    theoryContext: {
      commonUses: 'Dramatic tension in classical, jazz, and film scores. Symmetrical structure means it can resolve in four different directions. Common in silent film music and horror.',
      tensionResolution: 'Maximum tension. The fully diminished sound is unstable from every angle. Can resolve up or down by half-step to major or minor chords.',
      relatedChords: ['diminished', 'min7b5', 'dom7b9'],
      typicalProgressions: ['vii°7-I (dramatic resolution)', 'Used as pivot chord for modulation']
    }
  },
  min7b5: {
    name: 'Half-Diminished (m7b5)',
    intervals: [0, 3, 6, 10],
    formula: '1-b3-b5-b7',
    description: 'Jazz minor ii chord',
    theoryContext: {
      commonUses: 'Essential jazz chord. The ii chord in minor keys, setting up the V7 to i resolution. Also appears naturally as vii in major keys. Common in jazz standards and film noir.',
      tensionResolution: 'Dark tension that leads beautifully to dominant 7th chords. Less harsh than fully diminished. The "half" means it has a minor 7th instead of diminished 7th.',
      relatedChords: ['dim7', 'min7', 'dom7'],
      typicalProgressions: ['ii°7-V7-i (minor ii-V-i)', 'viiø7-I (in major keys)']
    }
  },
  add9: {
    name: 'Add 9',
    intervals: [0, 4, 7, 14],
    formula: '1-3-5-9',
    description: 'Major with added 9th',
    theoryContext: {
      commonUses: 'Adds sparkle to a basic major chord. Popular in pop, rock, and acoustic music. Oasis and many 90s bands loved this sound. More accessible than full 9th chords.',
      tensionResolution: 'Stable with added color. The 9th adds interest without changing the chord\'s function. No 7th means less jazz complexity.',
      relatedChords: ['major', 'maj9', 'sus2'],
      typicalProgressions: ['Can replace any major chord for added color', 'Iadd9-IVadd9 (shimmery progression)']
    }
  },
  power: {
    name: 'Power Chord (5)',
    intervals: [0, 7],
    formula: '1-5',
    description: 'Rock essential, no 3rd',
    theoryContext: {
      commonUses: 'The foundation of rock, metal, and punk. No 3rd means it\'s neither major nor minor - pure power. Works great with distortion because simpler intervals sound cleaner.',
      tensionResolution: 'Neutral and aggressive. Without the 3rd, there\'s no happy/sad quality - just raw energy. Can substitute for any major or minor chord.',
      relatedChords: ['major', 'minor', 'sus4'],
      typicalProgressions: ['I5-IV5-V5 (punk/rock)', 'i5-bVII5-bVI5 (metal)']
    }
  },
  dom9: {
    name: 'Dominant 9th',
    intervals: [0, 4, 7, 10, 14],
    formula: '1-3-5-b7-9',
    description: 'Funky, soulful',
    theoryContext: {
      commonUses: 'The funk and soul chord. James Brown, Prince, and Stevie Wonder built careers on this sound. Also essential in jazz as an extended V chord.',
      tensionResolution: 'Funky tension with the dominant pull. The 9th adds richness while the b7 maintains the drive to resolve. Can also groove without resolving in funk contexts.',
      relatedChords: ['dom7', 'min9', 'dom7sus4'],
      typicalProgressions: ['V9-I (jazz resolution)', 'I9-IV9 (funk vamp)']
    }
  },
  maj9: {
    name: 'Major 9th',
    intervals: [0, 4, 7, 11, 14],
    formula: '1-3-5-7-9',
    description: 'Lush, sophisticated',
    theoryContext: {
      commonUses: 'The ultimate "pretty" chord. Staple of neo-soul, jazz ballads, and sophisticated pop. D\'Angelo, Erykah Badu, and jazz pianists love this lush sound.',
      tensionResolution: 'Rich and stable. All the color of maj7 plus the 9th\'s shimmer. Functions as a luxurious tonic chord that doesn\'t need to go anywhere.',
      relatedChords: ['maj7', 'add9', 'min9'],
      typicalProgressions: ['Imaj9-IVmaj9 (neo-soul)', 'iim9-V9-Imaj9 (jazz ballad)']
    }
  },
  min9: {
    name: 'Minor 9th',
    intervals: [0, 3, 7, 10, 14],
    formula: '1-b3-5-b7-9',
    description: 'Smooth R&B/jazz',
    theoryContext: {
      commonUses: 'The smooth R&B and neo-soul sound. Perfect as the ii chord in jazz or as a tonic in R&B. Common in music by Sade, Maxwell, and contemporary jazz.',
      tensionResolution: 'Velvety tension. The minor quality plus the 9th creates sophisticated melancholy. Flows beautifully to dominant chords or can vamp on its own.',
      relatedChords: ['min7', 'maj9', 'dom9'],
      typicalProgressions: ['iim9-V9-Imaj9 (smooth jazz)', 'im9-IVmaj9 (R&B ballad)']
    }
  }
};

// Chord interval names for display
const CHORD_INTERVAL_NAMES = {
  0: 'R',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: '#5',
  9: 'bb7',
  10: 'b7',
  11: '7',
  14: '9'
};

// Get chord options for selector
function getChordOptions() {
  return Object.entries(CHORDS).map(([key, chord]) => ({
    value: key,
    label: chord.name
  }));
}

// === intervals.js ===
// Interval definitions for ear training
// Each interval includes semitones, names, quality, and song references for learning

const INTERVALS = {
  m2: {
    semitones: 1,
    name: 'Minor 2nd',
    shortName: 'm2',
    quality: 'dissonant',
    description: 'Half step - the smallest interval, very tense',
    songReference: 'Jaws theme (duh-duh)',
    songArtist: 'John Williams',
    difficulty: 'hard'
  },
  M2: {
    semitones: 2,
    name: 'Major 2nd',
    shortName: 'M2',
    quality: 'mild',
    description: 'Whole step - slightly tense but common',
    songReference: 'Happy Birthday (Hap-py)',
    songArtist: 'Traditional',
    difficulty: 'hard'
  },
  m3: {
    semitones: 3,
    name: 'Minor 3rd',
    shortName: 'm3',
    quality: 'consonant',
    description: 'Sad, dark quality - defines minor chords',
    songReference: 'Greensleeves (A-las)',
    songArtist: 'Traditional',
    difficulty: 'medium'
  },
  M3: {
    semitones: 4,
    name: 'Major 3rd',
    shortName: 'M3',
    quality: 'consonant',
    description: 'Happy, bright quality - defines major chords',
    songReference: 'Oh When the Saints (Oh-when)',
    songArtist: 'Traditional',
    difficulty: 'medium'
  },
  P4: {
    semitones: 5,
    name: 'Perfect 4th',
    shortName: 'P4',
    quality: 'perfect',
    description: 'Strong, open sound - common in melodies',
    songReference: 'Here Comes the Bride (Here-comes)',
    songArtist: 'Wagner',
    difficulty: 'easy'
  },
  TT: {
    semitones: 6,
    name: 'Tritone',
    shortName: 'TT',
    quality: 'dissonant',
    description: 'The "devil\'s interval" - unstable, wants to resolve',
    songReference: 'The Simpsons theme (The-Simp)',
    songArtist: 'Danny Elfman',
    difficulty: 'hard'
  },
  P5: {
    semitones: 7,
    name: 'Perfect 5th',
    shortName: 'P5',
    quality: 'perfect',
    description: 'Strong, powerful - the foundation of power chords',
    songReference: 'Star Wars main theme (first two notes)',
    songArtist: 'John Williams',
    difficulty: 'easy'
  },
  m6: {
    semitones: 8,
    name: 'Minor 6th',
    shortName: 'm6',
    quality: 'consonant',
    description: 'Bittersweet, emotional quality',
    songReference: 'The Entertainer (opening)',
    songArtist: 'Scott Joplin',
    difficulty: 'medium'
  },
  M6: {
    semitones: 9,
    name: 'Major 6th',
    shortName: 'M6',
    quality: 'consonant',
    description: 'Bright, wide - romantic feel',
    songReference: 'My Bonnie Lies Over the Ocean (My-Bon)',
    songArtist: 'Traditional',
    difficulty: 'medium'
  },
  m7: {
    semitones: 10,
    name: 'Minor 7th',
    shortName: 'm7',
    quality: 'mild',
    description: 'Bluesy, jazzy - defines dominant 7th sound',
    songReference: 'Somewhere from West Side Story (There\'s-a)',
    songArtist: 'Leonard Bernstein',
    difficulty: 'medium'
  },
  M7: {
    semitones: 11,
    name: 'Major 7th',
    shortName: 'M7',
    quality: 'dissonant',
    description: 'Almost an octave - dreamy but tense',
    songReference: 'Take On Me (Take-on)',
    songArtist: 'a-ha',
    difficulty: 'hard'
  },
  P8: {
    semitones: 12,
    name: 'Octave',
    shortName: 'P8',
    quality: 'perfect',
    description: 'Same note, higher - complete and resolved',
    songReference: 'Somewhere Over the Rainbow (Some-where)',
    songArtist: 'Harold Arlen',
    difficulty: 'easy'
  }
};

// Interval categories for difficulty filtering
const INTERVAL_DIFFICULTIES = {
  easy: ['P4', 'P5', 'P8'],
  medium: ['m3', 'M3', 'm6', 'M6', 'm7'],
  hard: ['m2', 'M2', 'TT', 'M7']
};

// Get intervals by difficulty level (cumulative)
function getIntervalsByDifficulty(difficulty) {
  const allIntervals = [];

  if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
    allIntervals.push(...INTERVAL_DIFFICULTIES.easy);
  }
  if (difficulty === 'medium' || difficulty === 'hard') {
    allIntervals.push(...INTERVAL_DIFFICULTIES.medium);
  }
  if (difficulty === 'hard') {
    allIntervals.push(...INTERVAL_DIFFICULTIES.hard);
  }

  return allIntervals;
}

// Get interval options for dropdown/selector
function getIntervalOptions() {
  return Object.entries(INTERVALS).map(([key, interval]) => ({
    value: key,
    label: interval.name,
    shortName: interval.shortName,
    semitones: interval.semitones
  }));
}

// Get interval by semitones
function getIntervalBySemitones(semitones) {
  const normalizedSemitones = semitones % 12;
  return Object.entries(INTERVALS).find(
    ([, interval]) => interval.semitones === normalizedSemitones
  );
}

// Chord quality definitions for ear training
const CHORD_QUALITIES = {
  major: {
    name: 'Major',
    quality: 'bright',
    description: 'Happy, stable, resolved',
    intervals: [0, 4, 7],
    difficulty: 'easy'
  },
  minor: {
    name: 'Minor',
    quality: 'dark',
    description: 'Sad, melancholic, emotional',
    intervals: [0, 3, 7],
    difficulty: 'easy'
  },
  dom7: {
    name: 'Dominant 7th',
    quality: 'tense',
    description: 'Bluesy tension, wants to resolve',
    intervals: [0, 4, 7, 10],
    difficulty: 'medium'
  },
  maj7: {
    name: 'Major 7th',
    quality: 'smooth',
    description: 'Jazzy, sophisticated, dreamy',
    intervals: [0, 4, 7, 11],
    difficulty: 'medium'
  },
  min7: {
    name: 'Minor 7th',
    quality: 'mellow',
    description: 'Smooth, soulful, relaxed',
    intervals: [0, 3, 7, 10],
    difficulty: 'medium'
  },
  diminished: {
    name: 'Diminished',
    quality: 'unstable',
    description: 'Very tense, dramatic, mysterious',
    intervals: [0, 3, 6],
    difficulty: 'hard'
  },
  augmented: {
    name: 'Augmented',
    quality: 'floating',
    description: 'Unsettled, dreamlike, unresolved',
    intervals: [0, 4, 8],
    difficulty: 'hard'
  },
  sus2: {
    name: 'Suspended 2nd',
    quality: 'open',
    description: 'Airy, neither major nor minor',
    intervals: [0, 2, 7],
    difficulty: 'hard'
  },
  sus4: {
    name: 'Suspended 4th',
    quality: 'suspended',
    description: 'Anticipation, wants to resolve to major',
    intervals: [0, 5, 7],
    difficulty: 'hard'
  }
};

// Chord quality categories for difficulty filtering
const CHORD_QUALITY_DIFFICULTIES = {
  easy: ['major', 'minor'],
  medium: ['dom7', 'maj7', 'min7'],
  hard: ['diminished', 'augmented', 'sus2', 'sus4']
};

// Get chord qualities by difficulty level (cumulative)
function getChordQualitiesByDifficulty(difficulty) {
  const qualities = [];

  if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
    qualities.push(...CHORD_QUALITY_DIFFICULTIES.easy);
  }
  if (difficulty === 'medium' || difficulty === 'hard') {
    qualities.push(...CHORD_QUALITY_DIFFICULTIES.medium);
  }
  if (difficulty === 'hard') {
    qualities.push(...CHORD_QUALITY_DIFFICULTIES.hard);
  }

  return qualities;
}

// === tunings.js ===
// Guitar and Bass tuning presets
// Each tuning is an array of notes from low to high

const TUNINGS = {
  // === 6-String Guitar ===
  standard: {
    name: 'Guitar - Standard',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
    description: 'Standard EADGBE tuning',
    instrument: 'guitar'
  },
  dropD: {
    name: 'Guitar - Drop D',
    notes: ['D', 'A', 'D', 'G', 'B', 'E'],
    description: 'Low E dropped to D',
    instrument: 'guitar'
  },
  halfStepDown: {
    name: 'Guitar - Half Step Down',
    notes: ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'],
    description: 'All strings down 1 semitone',
    instrument: 'guitar'
  },
  dStandard: {
    name: 'Guitar - D Standard',
    notes: ['D', 'G', 'C', 'F', 'A', 'D'],
    description: 'All strings down 1 whole step',
    instrument: 'guitar'
  },
  openG: {
    name: 'Guitar - Open G',
    notes: ['D', 'G', 'D', 'G', 'B', 'D'],
    description: 'Strumming open strings plays G major',
    instrument: 'guitar'
  },
  openD: {
    name: 'Guitar - Open D',
    notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
    description: 'Strumming open strings plays D major',
    instrument: 'guitar'
  },
  openE: {
    name: 'Guitar - Open E',
    notes: ['E', 'B', 'E', 'G#', 'B', 'E'],
    description: 'Strumming open strings plays E major',
    instrument: 'guitar'
  },
  openA: {
    name: 'Guitar - Open A',
    notes: ['E', 'A', 'E', 'A', 'C#', 'E'],
    description: 'Strumming open strings plays A major',
    instrument: 'guitar'
  },
  dadgad: {
    name: 'Guitar - DADGAD',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
    description: 'Celtic/folk tuning, Dsus4 chord',
    instrument: 'guitar'
  },
  dropC: {
    name: 'Guitar - Drop C',
    notes: ['C', 'G', 'C', 'F', 'A', 'D'],
    description: 'Drop D tuned down a whole step',
    instrument: 'guitar'
  },

  // === 4-String Bass ===
  bass4Standard: {
    name: 'Bass 4 - Standard',
    notes: ['E', 'A', 'D', 'G'],
    description: 'Standard 4-string bass EADG',
    instrument: 'bass'
  },
  bass4DropD: {
    name: 'Bass 4 - Drop D',
    notes: ['D', 'A', 'D', 'G'],
    description: '4-string bass with low D',
    instrument: 'bass'
  },
  bass4DStandard: {
    name: 'Bass 4 - D Standard',
    notes: ['D', 'G', 'C', 'F'],
    description: '4-string bass down 1 whole step',
    instrument: 'bass'
  },
  bass4HalfStep: {
    name: 'Bass 4 - Half Step Down',
    notes: ['D#', 'G#', 'C#', 'F#'],
    description: '4-string bass down 1 semitone',
    instrument: 'bass'
  },

  // === 5-String Bass ===
  bass5Standard: {
    name: 'Bass 5 - Standard (Low B)',
    notes: ['B', 'E', 'A', 'D', 'G'],
    description: '5-string bass with low B',
    instrument: 'bass'
  },
  bass5HighC: {
    name: 'Bass 5 - High C',
    notes: ['E', 'A', 'D', 'G', 'C'],
    description: '5-string bass with high C',
    instrument: 'bass'
  },
  bass5DropA: {
    name: 'Bass 5 - Drop A',
    notes: ['A', 'E', 'A', 'D', 'G'],
    description: '5-string bass with drop A',
    instrument: 'bass'
  },

  // === 6-String Bass ===
  bass6Standard: {
    name: 'Bass 6 - Standard',
    notes: ['B', 'E', 'A', 'D', 'G', 'C'],
    description: '6-string bass B-E-A-D-G-C',
    instrument: 'bass'
  },
  bass6DropA: {
    name: 'Bass 6 - Drop A',
    notes: ['A', 'E', 'A', 'D', 'G', 'C'],
    description: '6-string bass with drop A',
    instrument: 'bass'
  }
};

const DEFAULT_TUNING = 'standard';

// Get tuning options for selector
function getTuningOptions() {
  return Object.entries(TUNINGS).map(([key, tuning]) => ({
    value: key,
    label: tuning.name,
    description: tuning.description
  }));
}

// === voicings.js ===
// Chord voicing definitions
// Each voicing defines exact string/fret positions for a playable chord shape
// String indices: 0 = low E, 1 = A, 2 = D, 3 = G, 4 = B, 5 = high e
// Fret values: null = muted (don't play), 0 = open string, 1+ = fret number

// ============================================================================
// OPEN CHORD VOICINGS (Root-specific, for standard tuning)
// ============================================================================

const OPEN_VOICINGS = {
  major: {
    'C': [
      {
        id: 'c_major_open',
        name: 'C Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'g_major_open',
        name: 'G Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 3 }      // e - 3rd fret (G)
        ],
        category: 'open',
        difficulty: 'beginner'
      },
      {
        id: 'g_major_open_alt',
        name: 'G Open (Alt)',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 3 },     // B - 3rd fret (D)
          { string: 5, fret: 3 }      // e - 3rd fret (G)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'd_major_open',
        name: 'D Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 3 },     // B - 3rd fret (D)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'A': [
      {
        id: 'a_major_open',
        name: 'A Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 2 },     // B - 2nd fret (C#)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'E': [
      {
        id: 'e_major_open',
        name: 'E Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 1 },     // G - 1st fret (G#)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'F': [
      {
        id: 'f_major_partial',
        name: 'F (Mini Barre)',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 3 },     // D - 3rd fret (F)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 1 }      // e - 1st fret (F)
        ],
        barreInfo: { fret: 1, fromString: 4, toString: 5 },
        category: 'partial_barre',
        difficulty: 'intermediate'
      }
    ]
  },

  minor: {
    'A': [
      {
        id: 'a_minor_open',
        name: 'Am Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'E': [
      {
        id: 'e_minor_open',
        name: 'Em Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'd_minor_open',
        name: 'Dm Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 3 },     // B - 3rd fret (D)
          { string: 5, fret: 1 }      // e - 1st fret (F)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  dom7: {
    'E': [
      {
        id: 'e7_open',
        name: 'E7 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 1 },     // G - 1st fret (G#)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'A': [
      {
        id: 'a7_open',
        name: 'A7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 2 },     // B - 2nd fret (C#)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'd7_open',
        name: 'D7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'g7_open',
        name: 'G7 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 1 }      // e - 1st fret (F)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'C': [
      {
        id: 'c7_open',
        name: 'C7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 3 },     // G - 3rd fret (Bb)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  maj7: {
    'C': [
      {
        id: 'cmaj7_open',
        name: 'Cmaj7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'gmaj7_open',
        name: 'Gmaj7 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'F': [
      {
        id: 'fmaj7_open',
        name: 'Fmaj7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 3 },     // D - 3rd fret (F)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'dmaj7_open',
        name: 'Dmaj7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 2 },     // B - 2nd fret (C#)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'A': [
      {
        id: 'amaj7_open',
        name: 'Amaj7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 1 },     // G - 1st fret (G#)
          { string: 4, fret: 2 },     // B - 2nd fret (C#)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  power: {
    'E': [
      {
        id: 'e5_open',
        name: 'E5 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 2 },     // D - 2nd fret (E) - octave
          { string: 3, fret: null },  // G - muted
          { string: 4, fret: null },  // B - muted
          { string: 5, fret: null }   // e - muted
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'A': [
      {
        id: 'a5_open',
        name: 'A5 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 2 },     // G - 2nd fret (A) - octave
          { string: 4, fret: null },  // B - muted
          { string: 5, fret: null }   // e - muted
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'd5_open',
        name: 'D5 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 3 },     // B - 3rd fret (D) - octave
          { string: 5, fret: null }   // e - muted
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'g5_open',
        name: 'G5 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G) - octave
          { string: 4, fret: null },  // B - muted
          { string: 5, fret: null }   // e - muted
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'C': [
      {
        id: 'c5_open',
        name: 'C5 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: null },  // D - muted
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: null },  // B - muted
          { string: 5, fret: null }   // e - muted
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  add9: {
    'C': [
      {
        id: 'cadd9_open',
        name: 'Cadd9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 3 },     // B - 3rd fret (D)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'gadd9_open',
        name: 'Gadd9 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 3 }      // e - 3rd fret (G)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'dadd9_open',
        name: 'Dadd9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 3 },     // B - 3rd fret (D)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'A': [
      {
        id: 'aadd9_open',
        name: 'Aadd9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'E': [
      {
        id: 'eadd9_open',
        name: 'Eadd9 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 1 },     // G - 1st fret (G#)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'intermediate'
      }
    ]
  },

  dom9: {
    'E': [
      {
        id: 'e9_open',
        name: 'E9 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 1 },     // G - 1st fret (G#)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'intermediate'
      }
    ],
    'A': [
      {
        id: 'a9_open',
        name: 'A9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'g9_open',
        name: 'G9 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 1 }      // e - 1st fret (F)
        ],
        category: 'open',
        difficulty: 'intermediate'
      }
    ]
  },

  maj9: {
    'C': [
      {
        id: 'cmaj9_open',
        name: 'Cmaj9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 3 },     // A - 3rd fret (C)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E) - actually D would be 9
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'G': [
      {
        id: 'gmaj9_open',
        name: 'Gmaj9 Open',
        positions: [
          { string: 0, fret: 3 },     // Low E - 3rd fret (G)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'intermediate'
      }
    ],
    'F': [
      {
        id: 'fmaj9_open',
        name: 'Fmaj9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 3 },     // D - 3rd fret (F)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  min9: {
    'A': [
      {
        id: 'am9_open',
        name: 'Am9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'E': [
      {
        id: 'em9_open',
        name: 'Em9 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 2 }      // e - 2nd fret (F#)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'dm9_open',
        name: 'Dm9 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  },

  min7: {
    'A': [
      {
        id: 'am7_open',
        name: 'Am7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: 0 },     // A - open (A)
          { string: 2, fret: 2 },     // D - 2nd fret (E)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'E': [
      {
        id: 'em7_open',
        name: 'Em7 Open',
        positions: [
          { string: 0, fret: 0 },     // Low E - open (E)
          { string: 1, fret: 2 },     // A - 2nd fret (B)
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 0 },     // G - open (G)
          { string: 4, fret: 0 },     // B - open (B)
          { string: 5, fret: 0 }      // e - open (E)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ],
    'D': [
      {
        id: 'dm7_open',
        name: 'Dm7 Open',
        positions: [
          { string: 0, fret: null },  // Low E - muted
          { string: 1, fret: null },  // A - muted
          { string: 2, fret: 0 },     // D - open (D)
          { string: 3, fret: 2 },     // G - 2nd fret (A)
          { string: 4, fret: 1 },     // B - 1st fret (C)
          { string: 5, fret: 1 }      // e - 1st fret (F)
        ],
        category: 'open',
        difficulty: 'beginner'
      }
    ]
  }
};

// ============================================================================
// MOVEABLE (BARRE) CHORD SHAPES
// These can be transposed to any root note by moving up/down the neck
// rootString = which string has the root note (for calculating position)
// basePosition = array represents the shape with frets relative to root fret
// ============================================================================

const MOVEABLE_VOICINGS = {
  major: [
    {
      id: 'major_e_shape',
      name: 'E-Shape Barre',
      rootString: 0,           // Root is on low E string
      // Positions relative to root fret (root fret = 0)
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },
        { string: 2, fret: 2 },
        { string: 3, fret: 1 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'major_a_shape',
      name: 'A-Shape Barre',
      rootString: 1,           // Root is on A string
      basePositions: [
        { string: 0, fret: null },  // Muted
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },
        { string: 3, fret: 2 },
        { string: 4, fret: 2 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'major_c_shape',
      name: 'C-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },    // One fret below root
        { string: 3, fret: -3 },
        { string: 4, fret: -2 },
        { string: 5, fret: -3 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'major_g_shape',
      name: 'G-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: -1 },
        { string: 2, fret: -3 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: 0 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'major_d_shape',
      name: 'D-Shape',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },
        { string: 4, fret: 3 },
        { string: 5, fret: 2 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    }
  ],

  minor: [
    {
      id: 'minor_e_shape',
      name: 'Em-Shape Barre',
      rootString: 0,
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'minor_a_shape',
      name: 'Am-Shape Barre',
      rootString: 1,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },
        { string: 3, fret: 2 },
        { string: 4, fret: 1 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'minor_c_shape',
      name: 'Cm-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: -3 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'minor_g_shape',
      name: 'Gm-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: -1 },
        { string: 2, fret: -3 },
        { string: 3, fret: -3 },
        { string: 4, fret: -4 },
        { string: 5, fret: 0 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'minor_d_shape',
      name: 'Dm-Shape',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },
        { string: 4, fret: 3 },
        { string: 5, fret: 1 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    }
  ],

  dom7: [
    {
      id: 'dom7_e_shape',
      name: 'E7-Shape Barre',
      rootString: 0,
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },
        { string: 2, fret: 0 },
        { string: 3, fret: 1 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'dom7_a_shape',
      name: 'A7-Shape Barre',
      rootString: 1,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 2 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'dom7_c_shape',
      name: 'C7-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },
        { string: 3, fret: 0 },
        { string: 4, fret: -2 },
        { string: 5, fret: -3 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'dom7_g_shape',
      name: 'G7-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: -1 },
        { string: 2, fret: -3 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: -2 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'dom7_d_shape',
      name: 'D7-Shape',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },
        { string: 4, fret: 1 },
        { string: 5, fret: 2 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    }
  ],

  min7: [
    {
      id: 'min7_e_shape',
      name: 'Em7-Shape Barre',
      rootString: 0,
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },
        { string: 2, fret: 0 },
        { string: 3, fret: 0 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'min7_a_shape',
      name: 'Am7-Shape Barre',
      rootString: 1,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },
        { string: 3, fret: 0 },
        { string: 4, fret: 1 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'min7_c_shape',
      name: 'Cm7-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: -3 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'min7_g_shape',
      name: 'Gm7-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: -1 },
        { string: 2, fret: -3 },
        { string: 3, fret: -3 },
        { string: 4, fret: -4 },
        { string: 5, fret: -2 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'min7_d_shape',
      name: 'Dm7-Shape',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },
        { string: 4, fret: 1 },
        { string: 5, fret: 1 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    }
  ],

  maj7: [
    {
      id: 'maj7_e_shape',
      name: 'Emaj7-Shape Barre',
      rootString: 0,
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },
        { string: 2, fret: 1 },
        { string: 3, fret: 1 },
        { string: 4, fret: 0 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'maj7_a_shape',
      name: 'Amaj7-Shape Barre',
      rootString: 1,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },
        { string: 3, fret: 1 },
        { string: 4, fret: 2 },
        { string: 5, fret: 0 }
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'maj7_c_shape',
      name: 'Cmaj7-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: -3 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'maj7_g_shape',
      name: 'Gmaj7-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: -1 },
        { string: 2, fret: -3 },
        { string: 3, fret: -3 },
        { string: 4, fret: -3 },
        { string: 5, fret: -1 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    },
    {
      id: 'maj7_d_shape',
      name: 'Dmaj7-Shape',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },
        { string: 4, fret: 2 },
        { string: 5, fret: 2 }
      ],
      category: 'caged',
      difficulty: 'advanced'
    }
  ],

  power: [
    {
      id: 'power_e_shape',
      name: 'E5-Shape (2 string)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: null },
        { string: 3, fret: null },
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    },
    {
      id: 'power_e_shape_octave',
      name: 'E5-Shape (with octave)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: 2 },     // Octave
        { string: 3, fret: null },
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    },
    {
      id: 'power_a_shape',
      name: 'A5-Shape (2 string)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: null },
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    },
    {
      id: 'power_a_shape_octave',
      name: 'A5-Shape (with octave)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 2 },     // Octave
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    },
    {
      id: 'power_d_shape',
      name: 'D5-Shape (2 string)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },     // 5th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    },
    {
      id: 'power_d_shape_octave',
      name: 'D5-Shape (with octave)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 2 },     // 5th
        { string: 4, fret: 3 },     // Octave
        { string: 5, fret: null }
      ],
      category: 'power',
      difficulty: 'beginner'
    }
  ],

  add9: [
    {
      id: 'add9_e_shape',
      name: 'Eadd9-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: 2 },     // Root octave
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 2 }      // 9th
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 4 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'add9_a_shape',
      name: 'Aadd9-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 2 },     // Root octave
        { string: 4, fret: 0 },     // 9th
        { string: 5, fret: 0 }      // 5th
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    }
  ],

  dom9: [
    {
      id: 'dom9_e_shape',
      name: 'E9-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 2 }      // 9th
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 4 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'dom9_a_shape',
      name: 'A9-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 0 },     // 9th
        { string: 5, fret: 0 }      // 5th
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'dom9_funk',
      name: '9 Funk Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root (moved to A)
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 0 },     // 9th
        { string: 5, fret: null }
      ],
      category: 'jazz',
      difficulty: 'intermediate'
    }
  ],

  maj9: [
    {
      id: 'maj9_a_shape',
      name: 'Amaj9-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 1 },     // 7th
        { string: 4, fret: 0 },     // 9th
        { string: 5, fret: 0 }      // 5th
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'maj9_e_shape',
      name: 'Emaj9-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: 1 },     // 7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 2 }      // 9th
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 4 },
      category: 'barre',
      difficulty: 'advanced'
    }
  ],

  min9: [
    {
      id: 'min9_e_shape',
      name: 'Em9-Shape',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: 2 },     // 5th
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 2 }      // 9th
      ],
      barreInfo: { fretOffset: 0, fromString: 0, toString: 4 },
      category: 'barre',
      difficulty: 'intermediate'
    },
    {
      id: 'min9_a_shape',
      name: 'Am9-Shape',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 0 },     // 9th
        { string: 5, fret: 0 }      // 5th
      ],
      barreInfo: { fretOffset: 0, fromString: 1, toString: 5 },
      category: 'barre',
      difficulty: 'intermediate'
    }
  ]
};

// ============================================================================
// TRIAD VOICINGS - Compact 3-note voicings for different string sets
// Great for comping, arpeggios, and learning chord tones across the neck
// ============================================================================

const TRIAD_VOICINGS = {
  major: [
    // Top 3 strings (G-B-e) - Root position and inversions
    {
      id: 'major_triad_top3_root',
      name: 'Major Triad (High) - Root',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: 0 },     // 3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'major_triad_top3_1st',
      name: 'Major Triad (High) - 1st Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: -1 },    // 5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: 0 }      // 3rd
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'major_triad_top3_2nd',
      name: 'Major Triad (High) - 2nd Inv',
      rootString: 5,           // Root on high e string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: -1 },    // 3rd
        { string: 4, fret: -1 },    // 5th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    // Middle 3 strings (D-G-B) - Root position and inversions
    {
      id: 'major_triad_mid3_root',
      name: 'Major Triad (Mid) - Root',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'major_triad_mid3_1st',
      name: 'Major Triad (Mid) - 1st Inv',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // 5th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: 0 },     // 3rd
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'major_triad_mid3_2nd',
      name: 'Major Triad (Mid) - 2nd Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // 3rd
        { string: 3, fret: -2 },    // 5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    // Low-Mid strings (A-D-G) - Root position and inversions
    {
      id: 'major_triad_low3_root',
      name: 'Major Triad (Low-Mid) - Root',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 0 },     // 3rd
        { string: 3, fret: 0 },     // 5th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'major_triad_low3_1st',
      name: 'Major Triad (Low-Mid) - 1st Inv',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: -2 },    // 5th
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // 3rd
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'major_triad_low3_2nd',
      name: 'Major Triad (Low-Mid) - 2nd Inv',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: -3 },    // 3rd
        { string: 2, fret: -2 },    // 5th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    }
  ],

  minor: [
    // Top 3 strings (G-B-e) - Root position and inversions
    {
      id: 'minor_triad_top3_root',
      name: 'Minor Triad (High) - Root',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'minor_triad_top3_1st',
      name: 'Minor Triad (High) - 1st Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // 5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: 0 }      // b3rd
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'minor_triad_top3_2nd',
      name: 'Minor Triad (High) - 2nd Inv',
      rootString: 5,           // Root on high e string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: -2 },    // b3rd
        { string: 4, fret: -1 },    // 5th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    // Middle 3 strings (D-G-B)
    {
      id: 'minor_triad_mid3_root',
      name: 'Minor Triad (Mid) - Root',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: -1 },    // b3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'minor_triad_mid3_1st',
      name: 'Minor Triad (Mid) - 1st Inv',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // 5th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    {
      id: 'minor_triad_mid3_2nd',
      name: 'Minor Triad (Mid) - 2nd Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // b3rd
        { string: 3, fret: -2 },    // 5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'beginner'
    },
    // Low-Mid strings (A-D-G)
    {
      id: 'minor_triad_low3_root',
      name: 'Minor Triad (Low-Mid) - Root',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: -1 },    // b3rd
        { string: 3, fret: 0 },     // 5th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'minor_triad_low3_1st',
      name: 'Minor Triad (Low-Mid) - 1st Inv',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: -2 },    // 5th
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: -1 },    // b3rd
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'minor_triad_low3_2nd',
      name: 'Minor Triad (Low-Mid) - 2nd Inv',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: -4 },    // b3rd
        { string: 2, fret: -2 },    // 5th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    }
  ],

  dim: [
    // Top 3 strings (G-B-e)
    {
      id: 'dim_triad_top3_root',
      name: 'Dim Triad (High) - Root',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: -1 }     // b5th
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'dim_triad_top3_1st',
      name: 'Dim Triad (High) - 1st Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: -1 }     // b3rd
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    // Middle 3 strings (D-G-B)
    {
      id: 'dim_triad_mid3_root',
      name: 'Dim Triad (Mid) - Root',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: -1 },    // b3rd
        { string: 4, fret: -1 },    // b5th
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    }
  ],

  aug: [
    // Top 3 strings (G-B-e)
    {
      id: 'aug_triad_top3_root',
      name: 'Aug Triad (High) - Root',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: 0 },     // 3rd
        { string: 5, fret: 1 }      // #5th
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    {
      id: 'aug_triad_top3_1st',
      name: 'Aug Triad (High) - 1st Inv',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // #5th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: 0 }      // 3rd
      ],
      category: 'triad',
      difficulty: 'intermediate'
    },
    // Middle 3 strings (D-G-B)
    {
      id: 'aug_triad_mid3_root',
      name: 'Aug Triad (Mid) - Root',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // 3rd
        { string: 4, fret: 1 },     // #5th
        { string: 5, fret: null }
      ],
      category: 'triad',
      difficulty: 'intermediate'
    }
  ]
};

// ============================================================================
// SHELL VOICINGS - Jazz comping voicings with Root, 3rd, and 7th
// Essential for jazz guitar - minimum notes for chord quality
// ============================================================================

const SHELL_VOICINGS = {
  dom7: [
    // Root on 6th string (low E)
    {
      id: 'dom7_shell_e_r37',
      name: 'Dom7 Shell (E) R-3-7',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'dom7_shell_e_r73',
      name: 'Dom7 Shell (E) R-7-3',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    // Root on 5th string (A)
    {
      id: 'dom7_shell_a_r37',
      name: 'Dom7 Shell (A) R-3-7',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'dom7_shell_a_r73',
      name: 'Dom7 Shell (A) R-7-3',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 1 },     // 3rd
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    }
  ],

  maj7: [
    // Root on 6th string (low E)
    {
      id: 'maj7_shell_e_r37',
      name: 'Maj7 Shell (E) R-3-7',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 1 },     // 7th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'maj7_shell_e_r73',
      name: 'Maj7 Shell (E) R-7-3',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    // Root on 5th string (A)
    {
      id: 'maj7_shell_a_r37',
      name: 'Maj7 Shell (A) R-3-7',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 1 },     // 7th
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'maj7_shell_a_r73',
      name: 'Maj7 Shell (A) R-7-3',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 1 },     // 7th
        { string: 4, fret: 2 },     // 3rd
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    }
  ],

  min7: [
    // Root on 6th string (low E)
    {
      id: 'min7_shell_e_r37',
      name: 'Min7 Shell (E) R-b3-7',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'min7_shell_e_r73',
      name: 'Min7 Shell (E) R-7-b3',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    // Root on 5th string (A)
    {
      id: 'min7_shell_a_r37',
      name: 'Min7 Shell (A) R-b3-7',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    {
      id: 'min7_shell_a_r73',
      name: 'Min7 Shell (A) R-7-b3',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 1 },     // b3rd
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    }
  ],

  min7b5: [
    // Root on 6th string (low E)
    {
      id: 'min7b5_shell_e_r37',
      name: 'Min7b5 Shell (E) R-b3-7',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    // Root on 5th string (A)
    {
      id: 'min7b5_shell_a_r37',
      name: 'Min7b5 Shell (A) R-b3-7',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    }
  ],

  dim7: [
    // Root on 6th string (low E)
    {
      id: 'dim7_shell_e_r37',
      name: 'Dim7 Shell (E) R-b3-bb7',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b3rd
        { string: 3, fret: -1 },    // bb7th (dim 7th)
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    },
    // Root on 5th string (A)
    {
      id: 'dim7_shell_a_r37',
      name: 'Dim7 Shell (A) R-b3-bb7',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: -1 },    // bb7th
        { string: 5, fret: null }
      ],
      category: 'shell',
      difficulty: 'intermediate'
    }
  ]
};

// ============================================================================
// DROP 2 VOICINGS - Jazz voicings with the 2nd highest note dropped an octave
// Standard jazz guitar voicings for smooth voice leading
// ============================================================================

const DROP2_VOICINGS = {
  maj7: [
    // Top 4 strings - Root on different strings
    {
      id: 'maj7_drop2_top4_r4',
      name: 'Maj7 Drop 2 (Root on 4th)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 1 },     // 7th
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'maj7_drop2_top4_r3',
      name: 'Maj7 Drop 2 (Root on 3rd)',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 7th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: 0 },     // 3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'maj7_drop2_top4_r2',
      name: 'Maj7 Drop 2 (Root on 2nd)',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 5th
        { string: 3, fret: -1 },    // 7th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: 0 }      // 3rd
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'maj7_drop2_top4_r1',
      name: 'Maj7 Drop 2 (Root on 1st)',
      rootString: 5,           // Root on high e string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 3rd
        { string: 3, fret: -1 },    // 5th
        { string: 4, fret: -1 },    // 7th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    // Middle 4 strings (A-D-G-B)
    {
      id: 'maj7_drop2_mid4_r5',
      name: 'Maj7 Drop 2 Mid (Root on 5th)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 1 },     // 7th
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: null }
      ],
      category: 'drop2',
      difficulty: 'advanced'
    }
  ],

  dom7: [
    // Top 4 strings
    {
      id: 'dom7_drop2_top4_r4',
      name: 'Dom7 Drop 2 (Root on 4th)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'dom7_drop2_top4_r3',
      name: 'Dom7 Drop 2 (Root on 3rd)',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // b7th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: 0 },     // 3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'dom7_drop2_top4_r2',
      name: 'Dom7 Drop 2 (Root on 2nd)',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 5th
        { string: 3, fret: -2 },    // b7th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: 0 }      // 3rd
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'dom7_drop2_top4_r1',
      name: 'Dom7 Drop 2 (Root on 1st)',
      rootString: 5,           // Root on high e string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 3rd
        { string: 3, fret: -1 },    // 5th
        { string: 4, fret: -2 },    // b7th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    // Middle 4 strings
    {
      id: 'dom7_drop2_mid4_r5',
      name: 'Dom7 Drop 2 Mid (Root on 5th)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: null }
      ],
      category: 'drop2',
      difficulty: 'advanced'
    }
  ],

  min7: [
    // Top 4 strings
    {
      id: 'min7_drop2_top4_r4',
      name: 'Min7 Drop 2 (Root on 4th)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'min7_drop2_top4_r3',
      name: 'Min7 Drop 2 (Root on 3rd)',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // b7th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'min7_drop2_top4_r2',
      name: 'Min7 Drop 2 (Root on 2nd)',
      rootString: 4,           // Root on B string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -1 },    // 5th
        { string: 3, fret: -2 },    // b7th
        { string: 4, fret: 0 },     // Root
        { string: 5, fret: -1 }     // b3rd
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'min7_drop2_top4_r1',
      name: 'Min7 Drop 2 (Root on 1st)',
      rootString: 5,           // Root on high e string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // b3rd
        { string: 3, fret: -1 },    // 5th
        { string: 4, fret: -2 },    // b7th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    // Middle 4 strings
    {
      id: 'min7_drop2_mid4_r5',
      name: 'Min7 Drop 2 Mid (Root on 5th)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 0 },     // b3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: null }
      ],
      category: 'drop2',
      difficulty: 'advanced'
    }
  ],

  min7b5: [
    // Top 4 strings
    {
      id: 'min7b5_drop2_top4_r4',
      name: 'Min7b5 Drop 2 (Root on 4th)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: -1 }     // b5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'min7b5_drop2_top4_r3',
      name: 'Min7b5 Drop 2 (Root on 3rd)',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -2 },    // b7th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: -1 }     // b5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    }
  ],

  dim7: [
    // Top 4 strings
    {
      id: 'dim7_drop2_top4_r4',
      name: 'Dim7 Drop 2 (Root on 4th)',
      rootString: 2,           // Root on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // Root
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: -1 },    // bb7th
        { string: 5, fret: -1 }     // b5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    },
    {
      id: 'dim7_drop2_top4_r3',
      name: 'Dim7 Drop 2 (Root on 3rd)',
      rootString: 3,           // Root on G string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: -3 },    // bb7th
        { string: 3, fret: 0 },     // Root
        { string: 4, fret: -1 },    // b3rd
        { string: 5, fret: -1 }     // b5th
      ],
      category: 'drop2',
      difficulty: 'advanced'
    }
  ]
};

// ============================================================================
// SPREAD VOICINGS - Wider voicings across the neck for fuller sound
// Good for solo guitar and arrangement work
// ============================================================================

const SPREAD_VOICINGS = {
  major: [
    {
      id: 'major_spread_e_wide',
      name: 'Major Spread (E string root)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: null },
        { string: 4, fret: 1 },     // 3rd
        { string: 5, fret: 0 }      // Root octave
      ],
      category: 'spread',
      difficulty: 'intermediate'
    },
    {
      id: 'major_spread_a_wide',
      name: 'Major Spread (A string root)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 2 },     // 5th
        { string: 4, fret: 2 },     // Root octave
        { string: 5, fret: 1 }      // 3rd
      ],
      category: 'spread',
      difficulty: 'intermediate'
    }
  ],

  minor: [
    {
      id: 'minor_spread_e_wide',
      name: 'Minor Spread (E string root)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: null },
        { string: 4, fret: 0 },     // b3rd
        { string: 5, fret: 0 }      // Root octave
      ],
      category: 'spread',
      difficulty: 'intermediate'
    },
    {
      id: 'minor_spread_a_wide',
      name: 'Minor Spread (A string root)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 2 },     // 5th
        { string: 4, fret: 2 },     // Root octave
        { string: 5, fret: 0 }      // b3rd
      ],
      category: 'spread',
      difficulty: 'intermediate'
    }
  ],

  dom7: [
    {
      id: 'dom7_spread_e_wide',
      name: 'Dom7 Spread (E string root)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: null },
        { string: 4, fret: 1 },     // 3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'spread',
      difficulty: 'intermediate'
    },
    {
      id: 'dom7_spread_a_wide',
      name: 'Dom7 Spread (A string root)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 2 },     // Root octave
        { string: 5, fret: 1 }      // 3rd
      ],
      category: 'spread',
      difficulty: 'intermediate'
    }
  ],

  maj7: [
    {
      id: 'maj7_spread_e_wide',
      name: 'Maj7 Spread (E string root)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 7th
        { string: 3, fret: null },
        { string: 4, fret: 1 },     // 3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'spread',
      difficulty: 'intermediate'
    },
    {
      id: 'maj7_spread_a_wide',
      name: 'Maj7 Spread (A string root)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 1 },     // 7th
        { string: 4, fret: 2 },     // Root octave
        { string: 5, fret: 1 }      // 3rd
      ],
      category: 'spread',
      difficulty: 'intermediate'
    }
  ],

  min7: [
    {
      id: 'min7_spread_e_wide',
      name: 'Min7 Spread (E string root)',
      rootString: 0,           // Root on low E string
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: null },
        { string: 4, fret: 0 },     // b3rd
        { string: 5, fret: 0 }      // 5th
      ],
      category: 'spread',
      difficulty: 'intermediate'
    },
    {
      id: 'min7_spread_a_wide',
      name: 'Min7 Spread (A string root)',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: null },
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 2 },     // Root octave
        { string: 5, fret: 0 }      // b3rd
      ],
      category: 'spread',
      difficulty: 'intermediate'
    }
  ]
};

// ============================================================================
// PARTIAL VOICINGS - Common partial chord shapes (3-4 notes)
// Useful for rhythm guitar, partial barres, and easier alternatives
// ============================================================================

const PARTIAL_VOICINGS = {
  major: [
    // High 4 strings only - easy barre alternatives
    {
      id: 'major_partial_high4_e',
      name: 'Major High 4 (E-shape)',
      rootString: 0,           // Conceptual root on E
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // Root octave
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      barreInfo: { fretOffset: 0, fromString: 4, toString: 5 },
      category: 'partial',
      difficulty: 'beginner'
    },
    {
      id: 'major_partial_high4_a',
      name: 'Major High 4 (A-shape)',
      rootString: 1,           // Root on A
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // 3rd
        { string: 3, fret: 2 },     // Root
        { string: 4, fret: 2 },     // 5th
        { string: 5, fret: 0 }      // Root octave
      ],
      barreInfo: { fretOffset: 2, fromString: 2, toString: 4 },
      category: 'partial',
      difficulty: 'intermediate'
    },
    // Interior strings (A-D-G-B) - good for mid-range comping
    {
      id: 'major_partial_mid4',
      name: 'Major Mid 4 Strings',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 2 },     // Root
        { string: 4, fret: 2 },     // 3rd
        { string: 5, fret: null }
      ],
      barreInfo: { fretOffset: 2, fromString: 2, toString: 4 },
      category: 'partial',
      difficulty: 'intermediate'
    }
  ],

  minor: [
    // High 4 strings only
    {
      id: 'minor_partial_high4_e',
      name: 'Minor High 4 (Em-shape)',
      rootString: 0,           // Conceptual root on E
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // Root octave
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      barreInfo: { fretOffset: 0, fromString: 3, toString: 5 },
      category: 'partial',
      difficulty: 'beginner'
    },
    {
      id: 'minor_partial_high4_a',
      name: 'Minor High 4 (Am-shape)',
      rootString: 1,           // Root on A
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // b3rd
        { string: 3, fret: 2 },     // Root
        { string: 4, fret: 1 },     // 5th
        { string: 5, fret: 0 }      // Root octave
      ],
      category: 'partial',
      difficulty: 'intermediate'
    },
    // Mid 4 strings
    {
      id: 'minor_partial_mid4',
      name: 'Minor Mid 4 Strings',
      rootString: 1,           // Root on A string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: 0 },     // Root
        { string: 2, fret: 2 },     // 5th
        { string: 3, fret: 2 },     // Root
        { string: 4, fret: 1 },     // b3rd
        { string: 5, fret: null }
      ],
      category: 'partial',
      difficulty: 'intermediate'
    }
  ],

  dom7: [
    // High 4 strings
    {
      id: 'dom7_partial_high4_e',
      name: 'Dom7 High 4 (E7-shape)',
      rootString: 0,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      barreInfo: { fretOffset: 0, fromString: 4, toString: 5 },
      category: 'partial',
      difficulty: 'beginner'
    },
    {
      id: 'dom7_partial_high4_a',
      name: 'Dom7 High 4 (A7-shape)',
      rootString: 1,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 2 },     // 3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: 2 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      category: 'partial',
      difficulty: 'intermediate'
    },
    // Freddie Green style - 3 notes, roots/3rds/7ths
    {
      id: 'dom7_partial_freddie',
      name: 'Dom7 Freddie Green',
      rootString: 0,           // Root on low E
      basePositions: [
        { string: 0, fret: 0 },     // Root
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 3rd
        { string: 3, fret: 0 },     // b7th
        { string: 4, fret: null },
        { string: 5, fret: null }
      ],
      category: 'partial',
      difficulty: 'intermediate'
    }
  ],

  maj7: [
    // High 4 strings
    {
      id: 'maj7_partial_high4',
      name: 'Maj7 High 4 Strings',
      rootString: 0,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 1 },     // 7th
        { string: 3, fret: 1 },     // 3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      barreInfo: { fretOffset: 0, fromString: 4, toString: 5 },
      category: 'partial',
      difficulty: 'intermediate'
    },
    // Rootless voicing - common in jazz
    {
      id: 'maj7_partial_rootless',
      name: 'Maj7 Rootless (3-5-7)',
      rootString: 2,           // 3rd on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // 3rd
        { string: 3, fret: 0 },     // 5th
        { string: 4, fret: 0 },     // 7th
        { string: 5, fret: null }
      ],
      category: 'partial',
      difficulty: 'advanced'
    }
  ],

  min7: [
    // High 4 strings
    {
      id: 'min7_partial_high4',
      name: 'Min7 High 4 Strings',
      rootString: 0,
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b7th
        { string: 3, fret: 0 },     // b3rd
        { string: 4, fret: 0 },     // 5th
        { string: 5, fret: 0 }      // Root
      ],
      barreInfo: { fretOffset: 0, fromString: 2, toString: 5 },
      category: 'partial',
      difficulty: 'intermediate'
    },
    // Rootless voicing
    {
      id: 'min7_partial_rootless',
      name: 'Min7 Rootless (b3-5-7)',
      rootString: 2,           // b3rd on D string
      basePositions: [
        { string: 0, fret: null },
        { string: 1, fret: null },
        { string: 2, fret: 0 },     // b3rd
        { string: 3, fret: 1 },     // 5th
        { string: 4, fret: 0 },     // b7th
        { string: 5, fret: null }
      ],
      category: 'partial',
      difficulty: 'advanced'
    }
  ]
};

// Standard tuning for reference
const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];


// === musicTheory.js ===

// Get all notes in a scale given root note and scale type
function getScaleNotes(rootNote, scaleKey) {
  const scale = SCALES[scaleKey];
  if (!scale) return [];

  return scale.intervals.map(interval => getNoteAtInterval(rootNote, interval));
}

// Get all notes in a chord given root note and chord type
function getChordNotes(rootNote, chordKey) {
  const chord = CHORDS[chordKey];
  if (!chord) return [];

  return chord.intervals.map(interval => getNoteAtInterval(rootNote, interval % 12));
}

// Check if a note is in a scale
function isNoteInScale(note, rootNote, scaleKey) {
  const scaleNotes = getScaleNotes(rootNote, scaleKey);
  return scaleNotes.includes(note);
}

// Check if a note is in a chord
function isNoteInChord(note, rootNote, chordKey) {
  const chordNotes = getChordNotes(rootNote, chordKey);
  return chordNotes.includes(note);
}

// Get the interval of a note relative to root
function getIntervalFromRoot(note, rootNote) {
  const rootIndex = getNoteIndex(rootNote);
  const noteIndex = getNoteIndex(note);
  return (noteIndex - rootIndex + 12) % 12;
}

// Get interval name for display
function getIntervalName(note, rootNote, isChord = false) {
  const interval = getIntervalFromRoot(note, rootNote);
  return isChord ? CHORD_INTERVAL_NAMES[interval] : INTERVAL_NAMES[interval];
}

// Generate fretboard data for given tuning
function generateFretboardData(tuning, fretCount = 22) {
  return tuning.map((openNote, stringIndex) => {
    const frets = [];
    for (let fret = 0; fret <= fretCount; fret++) {
      frets.push({
        fret,
        note: getNoteOnFret(openNote, fret),
        stringIndex
      });
    }
    return frets;
  });
}

// Get notes to highlight based on current selection
function getHighlightedNotes(rootNote, type, typeKey) {
  if (type === 'scale') {
    return getScaleNotes(rootNote, typeKey);
  } else if (type === 'chord') {
    return getChordNotes(rootNote, typeKey);
  }
  return [];
}

// Get scale/chord info for reference panel
function getSelectionInfo(type, typeKey) {
  if (type === 'scale') {
    return SCALES[typeKey] || null;
  } else if (type === 'chord') {
    return CHORDS[typeKey] || null;
  }
  return null;
}

// Calculate neck traversal path for scales/chords
function calculateNeckTraversalPath(
  tuning,
  highlightedNotes,
  rootNote,
  fretCount = 22,
  fretRangeWidth = 4,
  tabView = false,
  direction = 'ascending'
) {
  if (!highlightedNotes.length) return [];

  // 1. Build list of all valid fret positions for each string
  const stringPositions = tuning.map((openNote, stringIndex) => {
    const positions = [];
    for (let fret = 0; fret <= fretCount; fret++) {
      const note = getNoteOnFret(openNote, fret);
      if (highlightedNotes.includes(note)) {
        positions.push({ stringIndex, fret, note });
      }
    }
    return positions;
  });

  // 2. Handle inverted view (tab view reverses strings)
  const orderedStrings = tabView ? [...stringPositions].reverse() : stringPositions;

  // 3. Build diagonal path based on direction
  const path = [];
  let currentFret = null;

  for (let i = 0; i < orderedStrings.length; i++) {
    const stringCandidates = orderedStrings[i];
    if (stringCandidates.length === 0) continue;

    let selectedPosition;

    if (currentFret === null) {
      // First string: choose starting position based on direction
      const rootPositions = stringCandidates.filter(p => p.note === rootNote);

      if (direction === 'ascending') {
        // Start at lowest fret (prefer root if available)
        selectedPosition = rootPositions.length > 0
          ? rootPositions.reduce((lowest, pos) => pos.fret < lowest.fret ? pos : lowest)
          : stringCandidates[0];
      } else {
        // Start at highest fret (prefer root if available)
        selectedPosition = rootPositions.length > 0
          ? rootPositions.reduce((highest, pos) => pos.fret > highest.fret ? pos : highest)
          : stringCandidates[stringCandidates.length - 1];
      }
    } else {
      // Subsequent strings: choose position that moves in the desired direction
      if (direction === 'ascending') {
        // Prefer positions at higher frets than current
        const higherPositions = stringCandidates.filter(p => p.fret >= currentFret);
        if (higherPositions.length > 0) {
          // Choose the one closest to current + ideal step size
          const idealNextFret = currentFret + 2; // Step up by ~2 frets per string for diagonal
          selectedPosition = higherPositions.reduce((closest, pos) => {
            const currentDistance = Math.abs(pos.fret - idealNextFret);
            const closestDistance = Math.abs(closest.fret - idealNextFret);
            return currentDistance < closestDistance ? pos : closest;
          });
        } else {
          // No higher positions available, take the highest available
          selectedPosition = stringCandidates[stringCandidates.length - 1];
        }
      } else {
        // Prefer positions at lower frets than current
        const lowerPositions = stringCandidates.filter(p => p.fret <= currentFret);
        if (lowerPositions.length > 0) {
          // Choose the one closest to current - ideal step size
          const idealNextFret = currentFret - 2; // Step down by ~2 frets per string for diagonal
          selectedPosition = lowerPositions.reduce((closest, pos) => {
            const currentDistance = Math.abs(pos.fret - idealNextFret);
            const closestDistance = Math.abs(closest.fret - idealNextFret);
            return currentDistance < closestDistance ? pos : closest;
          });
        } else {
          // No lower positions available, take the lowest available
          selectedPosition = stringCandidates[0];
        }
      }
    }

    path.push(selectedPosition);
    currentFret = selectedPosition.fret;
  }

  if (path.length === 0) return [];

  // 4. Expand path to include notes within fret range window
  const expandedPath = [];
  const addedPositions = new Set();

  for (const pathNote of path) {
    const key = `${pathNote.stringIndex}-${pathNote.fret}`;
    if (!addedPositions.has(key)) {
      expandedPath.push(pathNote);
      addedPositions.add(key);
    }

    // Find all notes on same string within range of this path point
    const sameStringNotes = stringPositions[pathNote.stringIndex];
    for (const candidate of sameStringNotes) {
      const candidateKey = `${candidate.stringIndex}-${candidate.fret}`;
      const isInRange = Math.abs(candidate.fret - pathNote.fret) <= fretRangeWidth;

      if (isInRange && !addedPositions.has(candidateKey)) {
        expandedPath.push(candidate);
        addedPositions.add(candidateKey);
      }
    }
  }

  return expandedPath;
}

// Get position name (Roman numeral) for fretboard positions
function getPositionName(startFret) {
  if (startFret === 0) return 'Open';

  const romanNumerals = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
    6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
    11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV'
  };
  return romanNumerals[startFret] || String(startFret);
}

// Get all available position options for the dropdown
function getPositionOptions() {
  const positions = [];

  // Open position (frets 0-3)
  positions.push({
    value: 0,
    label: 'Open (frets 0-3)',
    startFret: 0,
    endFret: 3
  });

  // Positions I through XII
  for (let fret = 1; fret <= 12; fret++) {
    positions.push({
      value: fret,
      label: `${getPositionName(fret)} (frets ${fret}-${fret + 3})`,
      startFret: fret,
      endFret: fret + 3
    });
  }

  return positions;
}

// === voicingUtils.js ===
// Utility functions for chord voicings

/**
 * Find the fret position for a specific note on a given string
 * @param {string} targetNote - The note to find (e.g., 'C', 'F#')
 * @param {string} openStringNote - The open string note
 * @param {number} maxFret - Maximum fret to search
 * @returns {number[]} Array of fret positions where the note occurs
 */
function findNoteOnString(targetNote, openStringNote, maxFret = 22) {
  const positions = [];
  for (let fret = 0; fret <= maxFret; fret++) {
    if (getNoteOnFret(openStringNote, fret) === targetNote) {
      positions.push(fret);
    }
  }
  return positions;
}

/**
 * Calculate fret offset needed to transpose a moveable shape to a target root
 * @param {string} targetRoot - The target root note
 * @param {number} rootString - Which string has the root (0-5)
 * @param {string[]} tuning - Current tuning
 * @returns {number} Fret offset from open position
 */
function calculateRootFretOffset(targetRoot, rootString, tuning = STANDARD_TUNING) {
  const openNote = tuning[rootString];
  const openNoteIndex = getNoteIndex(openNote);
  const targetIndex = getNoteIndex(targetRoot);

  // Calculate semitones from open note to target
  let offset = (targetIndex - openNoteIndex + 12) % 12;

  return offset;
}

/**
 * Transpose a moveable voicing shape to a specific root note
 * @param {Object} moveableVoicing - The moveable voicing template
 * @param {string} targetRoot - Target root note
 * @param {string[]} tuning - Current tuning
 * @returns {Object} Transposed voicing with absolute fret positions
 */
function transposeVoicing(moveableVoicing, targetRoot, tuning = STANDARD_TUNING) {
  const fretOffset = calculateRootFretOffset(targetRoot, moveableVoicing.rootString, tuning);

  // Skip if this would put the chord at fret 0 (use open voicing instead)
  // or beyond the fretboard
  if (fretOffset === 0) {
    return null; // Let open voicing be used instead
  }

  const transposedPositions = moveableVoicing.basePositions.map(pos => {
    if (pos.fret === null) {
      return { string: pos.string, fret: null };
    }
    const newFret = pos.fret + fretOffset;
    // Skip if fret is negative or too high
    if (newFret < 0 || newFret > 22) {
      return { string: pos.string, fret: null };
    }
    return { string: pos.string, fret: newFret };
  });

  // Check if any required notes ended up muted (invalid transposition)
  const hasInvalidFrets = transposedPositions.some(
    (pos, i) => moveableVoicing.basePositions[i].fret !== null && pos.fret === null
  );

  if (hasInvalidFrets) {
    return null;
  }

  // Calculate barre info if present
  let transposedBarreInfo = null;
  if (moveableVoicing.barreInfo) {
    transposedBarreInfo = {
      fret: moveableVoicing.barreInfo.fretOffset + fretOffset,
      fromString: moveableVoicing.barreInfo.fromString,
      toString: moveableVoicing.barreInfo.toString
    };
  }

  return {
    id: `${moveableVoicing.id}_${targetRoot.replace('#', 'sharp')}`,
    name: `${targetRoot} ${moveableVoicing.name}`,
    positions: transposedPositions,
    barreInfo: transposedBarreInfo,
    category: moveableVoicing.category,
    difficulty: moveableVoicing.difficulty,
    basedOn: moveableVoicing.id,
    rootFret: fretOffset
  };
}

/**
 * Get all available voicings for a chord (open + transposed moveable)
 * @param {string} rootNote - Root note of the chord
 * @param {string} chordType - Type of chord (major, minor, etc.)
 * @param {string[]} tuning - Current tuning
 * @returns {Object[]} Array of voicing objects
 */
function getVoicingsForChord(rootNote, chordType, tuning = STANDARD_TUNING) {
  const voicings = [];

  // Check for open voicings first (ONLY in standard tuning)
  if (isStandardTuning(tuning)) {
    const openVoicingsForType = OPEN_VOICINGS[chordType];
    if (openVoicingsForType && openVoicingsForType[rootNote]) {
      voicings.push(...openVoicingsForType[rootNote]);
    }
  }

  // Get moveable voicings and transpose them
  const moveableVoicingsForType = MOVEABLE_VOICINGS[chordType];
  if (moveableVoicingsForType) {
    for (const moveable of moveableVoicingsForType) {
      const transposed = transposeVoicing(moveable, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // Add triad voicings (for major, minor, dim, aug)
  const triadType = mapChordTypeToTriad(chordType);
  if (triadType && TRIAD_VOICINGS[triadType]) {
    for (const triad of TRIAD_VOICINGS[triadType]) {
      const transposed = transposeVoicing(triad, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // Add shell voicings (for 7th chords)
  if (SHELL_VOICINGS[chordType]) {
    for (const shell of SHELL_VOICINGS[chordType]) {
      const transposed = transposeVoicing(shell, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // Add drop 2 voicings (for 7th chords)
  if (DROP2_VOICINGS[chordType]) {
    for (const drop2 of DROP2_VOICINGS[chordType]) {
      const transposed = transposeVoicing(drop2, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // Add spread voicings
  if (SPREAD_VOICINGS[chordType]) {
    for (const spread of SPREAD_VOICINGS[chordType]) {
      const transposed = transposeVoicing(spread, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // Add partial voicings
  if (PARTIAL_VOICINGS[chordType]) {
    for (const partial of PARTIAL_VOICINGS[chordType]) {
      const transposed = transposeVoicing(partial, rootNote, tuning);
      if (transposed) {
        voicings.push(transposed);
      }
    }
  }

  // If no predefined voicings, generate algorithmically
  if (voicings.length === 0) {
    const generated = generateVoicings(rootNote, chordType, tuning);
    voicings.push(...generated);
  }

  // Sort by difficulty and then by position on neck
  voicings.sort((a, b) => {
    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    const aDiff = difficultyOrder[a.difficulty] ?? 1;
    const bDiff = difficultyOrder[b.difficulty] ?? 1;
    if (aDiff !== bDiff) return aDiff - bDiff;

    // Then by lowest fret position
    const aMinFret = Math.min(...a.positions.filter(p => p.fret !== null).map(p => p.fret));
    const bMinFret = Math.min(...b.positions.filter(p => p.fret !== null).map(p => p.fret));
    return aMinFret - bMinFret;
  });

  return voicings;
}

/**
 * Map chord types to their basic triad type
 * @param {string} chordType - Full chord type
 * @returns {string|null} Basic triad type (major, minor, dim, aug) or null
 */
function mapChordTypeToTriad(chordType) {
  // Major family
  if (['major', 'maj7', 'maj9', 'add9', 'sus2', 'sus4', '6', 'maj6'].includes(chordType)) {
    return 'major';
  }
  // Minor family
  if (['minor', 'min7', 'min9', 'min6', 'min11'].includes(chordType)) {
    return 'minor';
  }
  // Diminished family
  if (['dim', 'dim7', 'min7b5'].includes(chordType)) {
    return 'dim';
  }
  // Augmented family
  if (['aug', 'aug7'].includes(chordType)) {
    return 'aug';
  }
  // Dominant chords use major triads
  if (['dom7', 'dom9', 'dom11', '7', '9', '11', '13'].includes(chordType)) {
    return 'major';
  }
  return null;
}

/**
 * Generate voicings algorithmically for chords without predefined shapes
 * @param {string} rootNote - Root note
 * @param {string} chordType - Chord type
 * @param {string[]} tuning - Current tuning
 * @param {Object} options - Generation options
 * @returns {Object[]} Array of generated voicings
 */
function generateVoicings(rootNote, chordType, tuning = STANDARD_TUNING, options = {}) {
  const { maxFretSpan = 4, numVoicings = 4, minFret = 0, maxFret = 12 } = options;

  const chordNotes = getChordNotes(rootNote, chordType);
  if (!chordNotes.length) return [];

  const voicings = [];
  const stringCount = tuning.length;

  // Find all positions for each chord note on each string
  const notePositions = [];
  for (let stringIdx = 0; stringIdx < stringCount; stringIdx++) {
    const stringPositions = [];
    for (const note of chordNotes) {
      const frets = findNoteOnString(note, tuning[stringIdx], maxFret);
      for (const fret of frets) {
        if (fret >= minFret) {
          stringPositions.push({ note, fret });
        }
      }
    }
    notePositions.push(stringPositions);
  }

  // Generate voicings at different fret regions
  const regions = [
    { start: 0, end: 4 },
    { start: 5, end: 9 },
    { start: 7, end: 11 },
    { start: 10, end: 14 }
  ];

  for (const region of regions) {
    const voicing = generateVoicingInRegion(
      notePositions,
      chordNotes,
      rootNote,
      region.start,
      region.end,
      maxFretSpan,
      stringCount
    );

    if (voicing) {
      voicings.push({
        id: `generated_${rootNote}_${chordType}_${region.start}`,
        name: `Position ${region.start === 0 ? 'Open' : `Fret ${region.start}`}`,
        positions: voicing,
        category: 'generated',
        difficulty: region.start === 0 ? 'beginner' : 'intermediate'
      });
    }

    if (voicings.length >= numVoicings) break;
  }

  return voicings;
}

/**
 * Generate a single voicing within a fret region
 */
function generateVoicingInRegion(notePositions, chordNotes, rootNote, minFret, maxFret, maxSpan, stringCount) {
  const positions = [];
  let usedNotes = new Set();
  let fretMin = Infinity;
  let fretMax = -Infinity;

  // Try to place notes on strings from low to high
  for (let stringIdx = 0; stringIdx < stringCount; stringIdx++) {
    const availableOnString = notePositions[stringIdx].filter(
      p => p.fret >= minFret && p.fret <= maxFret
    );

    if (availableOnString.length === 0) {
      positions.push({ string: stringIdx, fret: null });
      continue;
    }

    // Prioritize: 1) root note, 2) unused chord tones, 3) any chord tone
    let bestPosition = null;

    // First priority: root note if not used yet
    if (!usedNotes.has(rootNote)) {
      bestPosition = availableOnString.find(p => p.note === rootNote);
    }

    // Second priority: unused chord tones
    if (!bestPosition) {
      for (const note of chordNotes) {
        if (!usedNotes.has(note)) {
          const pos = availableOnString.find(p => p.note === note);
          if (pos && wouldFitSpan(pos.fret, fretMin, fretMax, maxSpan)) {
            bestPosition = pos;
            break;
          }
        }
      }
    }

    // Third priority: any chord tone that fits the span
    if (!bestPosition) {
      for (const pos of availableOnString) {
        if (wouldFitSpan(pos.fret, fretMin, fretMax, maxSpan)) {
          bestPosition = pos;
          break;
        }
      }
    }

    if (bestPosition) {
      positions.push({ string: stringIdx, fret: bestPosition.fret });
      usedNotes.add(bestPosition.note);
      if (bestPosition.fret > 0) {
        fretMin = Math.min(fretMin, bestPosition.fret);
        fretMax = Math.max(fretMax, bestPosition.fret);
      }
    } else {
      positions.push({ string: stringIdx, fret: null });
    }
  }

  // Validate: must have at least 3 strings played and include the root
  const playedStrings = positions.filter(p => p.fret !== null).length;
  if (playedStrings < 3 || !usedNotes.has(rootNote)) {
    return null;
  }

  return positions;
}

/**
 * Check if adding a fret would keep within max span
 */
function wouldFitSpan(fret, currentMin, currentMax, maxSpan) {
  if (fret === 0) return true; // Open strings don't count toward span
  if (currentMin === Infinity) return true;

  const newMin = Math.min(currentMin, fret);
  const newMax = Math.max(currentMax, fret);

  // Only count frets > 0 for span calculation
  return (newMax - newMin) <= maxSpan;
}

/**
 * Convert voicing positions to fretboard highlight format
 * @param {Object} voicing - Voicing object
 * @param {string[]} tuning - Current tuning
 * @returns {Object[]} Array of { stringIndex, fret, note, isMuted }
 */
function voicingToFretPositions(voicing, tuning = STANDARD_TUNING) {
  if (!voicing || !voicing.positions) return [];

  return voicing.positions.map((pos, idx) => {
    const stringIndex = pos.string;
    const isMuted = pos.fret === null;
    const note = isMuted ? null : getNoteOnFret(tuning[stringIndex], pos.fret);

    return {
      stringIndex,
      fret: pos.fret,
      note,
      isMuted
    };
  });
}

/**
 * Get voicing dropdown options
 * @param {Object[]} voicings - Array of voicing objects
 * @returns {Object[]} Array of { value, label }
 */
function getVoicingOptions(voicings) {
  return voicings.map((v, idx) => ({
    value: idx,
    label: v.name,
    category: v.category,
    difficulty: v.difficulty
  }));
}

/**
 * Check if a tuning is standard (for determining if predefined voicings apply)
 * @param {string[]} tuning - Current tuning
 * @returns {boolean}
 */
function isStandardTuning(tuning) {
  if (tuning.length !== STANDARD_TUNING.length) return false;
  return tuning.every((note, i) => note === STANDARD_TUNING[i]);
}



// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

const S = {
  mode: localStorage.getItem('gt_mode') || 'learn',
  root: localStorage.getItem('gt_root') || 'C',
  selectionType: localStorage.getItem('gt_selectionType') || 'scale',
  scaleKey: localStorage.getItem('gt_scaleKey') || 'major',
  chordKey: localStorage.getItem('gt_chordKey') || 'major',
  tuningKey: localStorage.getItem('gt_tuningKey') || 'standard',
  showIntervals: localStorage.getItem('gt_showIntervals') === 'true',
  learnView: localStorage.getItem('gt_learnView') || 'full',
  position: parseInt(localStorage.getItem('gt_position')) || 0,
  pathDirection: localStorage.getItem('gt_pathDirection') || 'ascending',
  voicingCategory: localStorage.getItem('gt_voicingCategory') || 'all',
  voicingIndex: parseInt(localStorage.getItem('gt_voicingIndex')) || 0,
  fretCount: parseInt(localStorage.getItem('gt_fretCount')) || 22,
  flipFretboard: localStorage.getItem('gt_flipFretboard') === 'true',
  leftHanded: localStorage.getItem('gt_leftHanded') === 'true',
  showInlays: localStorage.getItem('gt_showInlays') !== 'false',
  audioWaveform: localStorage.getItem('gt_audioWaveform') || 'triangle'
};

function saveState(key, val) {
  S[key] = val;
  localStorage.setItem('gt_' + key, val);
}

function getTuning() {
  return (TUNINGS[S.tuningKey] || TUNINGS.standard).notes;
}

// ═══════════════════════════════════════════════════════════════════
// AUDIO
// ═══════════════════════════════════════════════════════════════════

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function noteToFreq(note, octave) {
  const idx = NOTES.indexOf(note);
  if (idx < 0) return 440;
  const semitonesFromA4 = (idx - 9) + (octave - 4) * 12;
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

function playNote(note, octave, duration) {
  octave = octave || 4;
  duration = duration || 0.5;
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = S.audioWaveform;
  osc.frequency.value = noteToFreq(note, octave);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playInterval(note1, note2, octave, delay) {
  octave = octave || 4;
  delay = delay || 0.5;
  playNote(note1, octave, 1);
  setTimeout(function() { playNote(note2, octave, 1); }, delay * 1000);
}

function playChordNotes(notes, octave, strum) {
  octave = octave || 3;
  strum = strum || false;
  notes.forEach(function(note, i) {
    var d = strum ? i * 0.05 : 0;
    setTimeout(function() { playNote(note, octave, 1.5); }, d * 1000);
  });
}

// ═══════════════════════════════════════════════════════════════════
// FRETBOARD RENDERER
// ═══════════════════════════════════════════════════════════════════

function renderFretboard(container, opts) {
  if (!container) return;
  opts = opts || {};
  var tuning = opts.tuning || getTuning();
  var highlighted = opts.highlighted || [];
  var rootNote = opts.root || S.root;
  var showIntervals = opts.showIntervals != null ? opts.showIntervals : S.showIntervals;
  var fretCount = opts.fretCount || S.fretCount;
  var positionFilter = opts.positionFilter || null;
  var pathNotes = opts.pathNotes || null;
  var voicingPositions = opts.voicingPositions || null;
  var onNoteClick = opts.onNoteClick || null;
  var flipFB = opts.flip != null ? opts.flip : S.flipFretboard;
  var leftHanded = opts.leftHanded != null ? opts.leftHanded : S.leftHanded;

  container.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'relative';

  var stringCount = tuning.length;
  var strings = flipFB ? tuning.slice().reverse() : tuning.slice();

  // fretboard table
  var tbl = document.createElement('div');
  tbl.className = 'inline-block';
  tbl.style.minWidth = (fretCount * 52 + 40) + 'px';
  if (leftHanded) tbl.style.transform = 'scaleX(-1)';
  var lhFlip = leftHanded ? 'transform:scaleX(-1)' : '';

  // fret markers row
  var markerRow = document.createElement('div');
  markerRow.className = 'flex items-center';
  markerRow.style.paddingLeft = '38px';
  for (var f = 0; f <= fretCount; f++) {
    var mc = document.createElement('div');
    mc.className = 'flex-shrink-0 text-center text-[10px] text-gray-600';
    mc.style.width = '50px';
    mc.style.cssText += lhFlip;
    if (FRET_MARKERS.indexOf(f) >= 0) {
      mc.textContent = DOUBLE_MARKERS.indexOf(f) >= 0 ? '◆◆' : '◆';
    }
    markerRow.appendChild(mc);
  }
  tbl.appendChild(markerRow);

  // string rows
  for (var si = 0; si < stringCount; si++) {
    var openNote = strings[si];
    var origSi = flipFB ? (stringCount - 1 - si) : si;
    var thickness = 1 + (flipFB ? si : (stringCount - 1 - si)) * 0.4;

    var row = document.createElement('div');
    row.className = 'flex items-center';

    // open string label
    var label = document.createElement('div');
    label.className = 'flex-shrink-0 w-9 text-right pr-2 text-xs font-mono text-gray-400';
    if (lhFlip) label.style.cssText = lhFlip;
    label.textContent = openNote;
    row.appendChild(label);

    for (var fret = 0; fret <= fretCount; fret++) {
      var note = getNoteOnFret(openNote, fret);
      var isHighlighted = highlighted.indexOf(note) >= 0;
      var isRoot = note === rootNote && isHighlighted;

      // position filter
      if (positionFilter && isHighlighted) {
        if (fret < positionFilter.startFret || fret > positionFilter.endFret) {
          isHighlighted = false;
          isRoot = false;
        }
      }

      // path filter
      if (pathNotes && isHighlighted) {
        var inPath = pathNotes.some(function(p) { return p.stringIndex === origSi && p.fret === fret; });
        if (!inPath) {
          isHighlighted = false;
          isRoot = false;
        }
      }

      // voicing overlay
      var isVoicing = false;
      var isMuted = false;
      if (voicingPositions) {
        var vp = voicingPositions.find(function(p) { return p.stringIndex === origSi; });
        if (vp) {
          if (vp.isMuted) { isMuted = true; isHighlighted = false; }
          else if (vp.fret === fret) { isVoicing = true; isHighlighted = true; }
          else { isHighlighted = false; }
        }
      }

      var cell = document.createElement('div');
      cell.className = 'flex-shrink-0 relative flex items-center justify-center';
      cell.style.width = '50px';
      cell.style.height = '28px';

      // string line
      var stringLine = document.createElement('div');
      stringLine.className = 'absolute inset-x-0 bg-gray-500';
      stringLine.style.height = thickness + 'px';
      stringLine.style.top = '50%';
      stringLine.style.transform = 'translateY(-50%)';
      if (fret === 0) stringLine.style.opacity = '0.5';
      cell.appendChild(stringLine);

      // fret wire
      if (fret > 0) {
        var wire = document.createElement('div');
        wire.className = 'absolute left-0 bg-gray-600';
        wire.style.width = fret === 12 ? '3px' : '2px';
        wire.style.top = '0';
        wire.style.bottom = '0';
        cell.appendChild(wire);
      }

      // note dot
      if (isHighlighted && (fret > 0 || fret === 0)) {
        var dot = _createDot(note, rootNote, isRoot, isVoicing, showIntervals, onNoteClick, lhFlip);
        cell.appendChild(dot);
      } else if (isMuted && fret === 0) {
        var x = document.createElement('div');
        x.className = 'relative z-10 text-xs font-bold text-red-500';
        if (lhFlip) x.style.cssText = lhFlip;
        x.textContent = '✕';
        cell.appendChild(x);
      }

      row.appendChild(cell);
    }
    tbl.appendChild(row);
  }

  // fret numbers
  var numRow = document.createElement('div');
  numRow.className = 'flex items-center';
  numRow.style.paddingLeft = '38px';
  for (var fn = 0; fn <= fretCount; fn++) {
    var nc = document.createElement('div');
    nc.className = 'flex-shrink-0 text-center text-[10px] text-gray-600';
    nc.style.width = '50px';
    if (lhFlip) nc.style.cssText += lhFlip;
    if (fn === 0) nc.textContent = '0';
    else if (fn % 3 === 0 || fn === 1) nc.textContent = fn;
    numRow.appendChild(nc);
  }
  tbl.appendChild(numRow);

  wrap.appendChild(tbl);
  container.appendChild(wrap);
}

function _createDot(note, rootNote, isRoot, isVoicing, showIntervals, onClick, lhFlip) {
  var dot = document.createElement('div');
  if (lhFlip) dot.style.cssText = lhFlip;
  var interval = getIntervalFromRoot(note, rootNote);

  if (isRoot) {
    dot.className = 'relative z-10 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white shadow';
  } else if (isVoicing) {
    dot.className = 'relative z-10 w-6 h-6 rounded-full bg-gold/40 border border-gold flex items-center justify-center text-[10px] font-bold text-white shadow';
  } else {
    dot.className = 'relative z-10 w-5 h-5 rounded-full bg-emerald-700/60 flex items-center justify-center text-[9px] font-medium text-emerald-200';
  }

  if (showIntervals) {
    dot.textContent = INTERVAL_NAMES[interval] || note;
  } else {
    dot.textContent = note;
  }

  if (onClick) {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', function() { onClick(note); });
  }

  return dot;
}

// ═══════════════════════════════════════════════════════════════════
// CONTROLS BUILDER
// ═══════════════════════════════════════════════════════════════════

function _sel(label, options, value, onChange) {
  var wrap = document.createElement('div');
  wrap.className = 'flex items-center gap-1';

  var lbl = document.createElement('span');
  lbl.className = 'text-[10px] text-gray-500 uppercase tracking-wider';
  lbl.textContent = label;
  wrap.appendChild(lbl);

  var sel = document.createElement('select');
  sel.className = 'bg-dark-700 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-accent';

  options.forEach(function(opt) {
    var o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    if (opt.value === value || String(opt.value) === String(value)) o.selected = true;
    sel.appendChild(o);
  });

  sel.addEventListener('change', function() { onChange(sel.value); });
  wrap.appendChild(sel);
  return wrap;
}

function _btn(label, active, onClick) {
  var btn = document.createElement('button');
  btn.className = 'px-2 py-1 rounded text-xs transition ' +
    (active ? 'bg-accent text-white' : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600');
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function _toggle(label, value, onChange) {
  var wrap = document.createElement('div');
  wrap.className = 'flex items-center gap-1';

  var lbl = document.createElement('span');
  lbl.className = 'text-[10px] text-gray-500';
  lbl.textContent = label;
  wrap.appendChild(lbl);

  var btn = document.createElement('button');
  btn.className = 'w-8 h-4 rounded-full transition relative ' + (value ? 'bg-accent' : 'bg-dark-600');
  var knob = document.createElement('div');
  knob.className = 'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ' + (value ? 'left-4' : 'left-0.5');
  btn.appendChild(knob);
  btn.addEventListener('click', function() { onChange(!value); });
  wrap.appendChild(btn);
  return wrap;
}

// ═══════════════════════════════════════════════════════════════════
// LEARN MODE CONTROLS
// ═══════════════════════════════════════════════════════════════════

function _appendFretboardControls(bar) {
  // tuning
  var tuningOpts = Object.entries(TUNINGS).map(function(e) { return { value: e[0], label: e[1].name }; });
  bar.appendChild(_sel('Tuning', tuningOpts, S.tuningKey, function(v) {
    saveState('tuningKey', v);
    refresh();
  }));

  // fret count
  var fretOpts = [
    { value: 12, label: '12 frets' },
    { value: 15, label: '15 frets' },
    { value: 17, label: '17 frets' },
    { value: 22, label: '22 frets' }
  ];
  bar.appendChild(_sel('Frets', fretOpts, S.fretCount, function(v) {
    saveState('fretCount', parseInt(v));
    refresh();
  }));

  // audio waveform
  var waveOpts = [
    { value: 'sine', label: 'Sine' },
    { value: 'triangle', label: 'Triangle' }
  ];
  bar.appendChild(_sel('Sound', waveOpts, S.audioWaveform, function(v) {
    saveState('audioWaveform', v);
  }));

  // intervals toggle
  bar.appendChild(_toggle('Intervals', S.showIntervals, function(v) {
    saveState('showIntervals', v);
    refresh();
  }));

  // flip fretboard toggle
  bar.appendChild(_toggle('Flip', S.flipFretboard, function(v) {
    saveState('flipFretboard', v);
    refresh();
  }));

  // left-handed toggle
  bar.appendChild(_toggle('Left-Hand', S.leftHanded, function(v) {
    saveState('leftHanded', v);
    refresh();
  }));
}

function buildLearnControls(bar) {
  bar.innerHTML = '';

  // root note
  var rootOpts = NOTES.map(function(n) { return { value: n, label: getNoteDisplayName(n) }; });
  bar.appendChild(_sel('Root', rootOpts, S.root, function(v) {
    saveState('root', v);
    saveState('voicingIndex', 0);
    refresh();
  }));

  // scale/chord toggle
  bar.appendChild(_btn('Scale', S.selectionType === 'scale', function() {
    saveState('selectionType', 'scale');
    refresh();
  }));
  bar.appendChild(_btn('Chord', S.selectionType === 'chord', function() {
    saveState('selectionType', 'chord');
    refresh();
  }));

  // type selector
  if (S.selectionType === 'scale') {
    var scaleOpts = Object.entries(SCALES).map(function(e) { return { value: e[0], label: e[1].name }; });
    bar.appendChild(_sel('Scale', scaleOpts, S.scaleKey, function(v) {
      saveState('scaleKey', v);
      refresh();
    }));
  } else {
    var chordOpts = Object.entries(CHORDS).map(function(e) { return { value: e[0], label: e[1].name }; });
    bar.appendChild(_sel('Chord', chordOpts, S.chordKey, function(v) {
      saveState('chordKey', v);
      saveState('voicingIndex', 0);
      refresh();
    }));
  }

  _appendFretboardControls(bar);

  // view mode (full / position / path / voicing)
  var viewOpts = [
    { value: 'full', label: 'Full Neck' },
    { value: 'position', label: 'Position' },
    { value: 'path', label: 'Path' }
  ];
  if (S.selectionType === 'chord') {
    viewOpts.push({ value: 'voicing', label: 'Voicings' });
  }
  bar.appendChild(_sel('View', viewOpts, S.learnView, function(v) {
    saveState('learnView', v);
    refresh();
  }));

  // position-specific controls
  if (S.learnView === 'position') {
    var posOpts = getPositionOptions().map(function(p) { return { value: p.value, label: p.label }; });
    bar.appendChild(_sel('Pos', posOpts, S.position, function(v) {
      saveState('position', parseInt(v));
      refresh();
    }));
  }

  // path-specific controls
  if (S.learnView === 'path') {
    bar.appendChild(_btn('Ascending', S.pathDirection === 'ascending', function() {
      saveState('pathDirection', 'ascending');
      refresh();
    }));
    bar.appendChild(_btn('Descending', S.pathDirection === 'descending', function() {
      saveState('pathDirection', 'descending');
      refresh();
    }));
  }

  // voicing-specific controls
  if (S.learnView === 'voicing' && S.selectionType === 'chord') {
    var voicings = getVoicingsForChord(S.root, S.chordKey, getTuning());
    if (voicings.length > 0) {
      var vOpts = voicings.map(function(v, i) { return { value: i, label: v.name }; });
      bar.appendChild(_sel('Voicing', vOpts, S.voicingIndex, function(v) {
        saveState('voicingIndex', parseInt(v));
        refresh();
      }));

      // prev / next
      bar.appendChild(_btn('◀', false, function() {
        var idx = (S.voicingIndex - 1 + voicings.length) % voicings.length;
        saveState('voicingIndex', idx);
        refresh();
      }));
      bar.appendChild(_btn('▶', false, function() {
        var idx = (S.voicingIndex + 1) % voicings.length;
        saveState('voicingIndex', idx);
        refresh();
      }));

      // play button
      bar.appendChild(_btn('♪ Play', false, function() {
        var v = voicings[S.voicingIndex];
        if (v) {
          var positions = voicingToFretPositions(v, getTuning());
          var notes = positions.filter(function(p) { return !p.isMuted && p.note; }).map(function(p) { return p.note; });
          playChordNotes(notes, 3, true);
        }
      }));
    }
  }

  // play scale/chord button
  if (S.learnView !== 'voicing') {
    var playLabel = S.selectionType === 'scale' ? '♪ Scale' : '♪ Chord';
    bar.appendChild(_btn(playLabel, false, function() {
      var notes = S.selectionType === 'scale'
        ? getScaleNotes(S.root, S.scaleKey)
        : getChordNotes(S.root, S.chordKey);
      if (S.selectionType === 'scale') {
        notes.forEach(function(n, i) { setTimeout(function() { playNote(n, 4, 0.4); }, i * 250); });
      } else {
        playChordNotes(notes, 3, true);
      }
    }));
  }
}

// ═══════════════════════════════════════════════════════════════════
// REFERENCE PANEL
// ═══════════════════════════════════════════════════════════════════

function updateReference(panel) {
  if (!panel) return;
  var info, notes, html;

  if (S.selectionType === 'scale') {
    info = SCALES[S.scaleKey];
    notes = getScaleNotes(S.root, S.scaleKey);
    html = '<strong>' + S.root + ' ' + info.name + '</strong>';
    html += '  ·  Formula: ' + info.formula;
    html += '  ·  Notes: ' + notes.join(' - ');
    html += '  ·  ' + info.description;
  } else {
    info = CHORDS[S.chordKey];
    notes = getChordNotes(S.root, S.chordKey);
    html = '<strong>' + S.root + ' ' + info.name + '</strong>';
    html += '  ·  Formula: ' + info.formula;
    html += '  ·  Notes: ' + notes.join(' - ');
    html += '  ·  ' + info.description;
    if (info.theoryContext) {
      html += '<br><span class="text-gray-500">' + info.theoryContext.commonUses + '</span>';
    }
  }

  panel.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════

var practice = {
  quizType: localStorage.getItem('gt_practiceQuiz') || 'note',
  score: 0,
  total: 0,
  streak: 0,
  bestStreak: 0,
  question: null,
  answered: false,
  showHint: false
};

function practiceNewQuestion() {
  practice.answered = false;
  practice.showHint = false;
  var tuning = getTuning();
  var stringCount = tuning.length;

  if (practice.quizType === 'note') {
    var si = Math.floor(Math.random() * stringCount);
    var fret = Math.floor(Math.random() * (S.fretCount + 1));
    var answer = getNoteOnFret(tuning[si], fret);
    practice.question = {
      type: 'note',
      prompt: 'What note is on string ' + tuning[si] + ', fret ' + fret + '?',
      stringIndex: si,
      fret: fret,
      answer: answer,
      options: _shuffleWith(answer, NOTES, 4)
    };
  } else if (practice.quizType === 'fret') {
    var si2 = Math.floor(Math.random() * stringCount);
    var targetNote = NOTES[Math.floor(Math.random() * 12)];
    var validFrets = [];
    for (var f = 0; f <= S.fretCount; f++) {
      if (getNoteOnFret(tuning[si2], f) === targetNote) validFrets.push(f);
    }
    practice.question = {
      type: 'fret',
      prompt: 'Find ' + targetNote + ' on the ' + tuning[si2] + ' string',
      stringIndex: si2,
      targetNote: targetNote,
      validFrets: validFrets
    };
  } else if (practice.quizType === 'chord') {
    var chordKeys = Object.keys(CHORDS);
    var ck = chordKeys[Math.floor(Math.random() * chordKeys.length)];
    var root = NOTES[Math.floor(Math.random() * 12)];
    var notes = getChordNotes(root, ck);
    practice.question = {
      type: 'chord',
      prompt: 'Listen and identify the chord',
      answer: root + ' ' + CHORDS[ck].name,
      root: root,
      chordKey: ck,
      notes: notes,
      options: _generateChordOptions(root, ck, 4)
    };
    playChordNotes(notes, 3, true);
  } else if (practice.quizType === 'shape') {
    var shapeChordKeys = ['major', 'minor', 'dom7', 'min7', 'maj7'];
    var sck = shapeChordKeys[Math.floor(Math.random() * shapeChordKeys.length)];
    var sRoot = NOTES[Math.floor(Math.random() * 12)];
    var voicings = getVoicingsForChord(sRoot, sck, getTuning());
    if (voicings.length === 0) { practiceNewQuestion(); return; }
    var vi = Math.floor(Math.random() * Math.min(voicings.length, 5));
    var positions = voicingToFretPositions(voicings[vi], getTuning());
    practice.question = {
      type: 'shape',
      prompt: 'What chord is this shape?',
      answer: sRoot + ' ' + CHORDS[sck].name,
      root: sRoot,
      chordKey: sck,
      voicingPositions: positions,
      chordNotes: getChordNotes(sRoot, sck),
      options: _generateChordOptions(sRoot, sck, 4)
    };
  }
}

function _shuffleWith(correct, pool, count) {
  var opts = [correct];
  var available = pool.filter(function(x) { return x !== correct; });
  while (opts.length < count && available.length > 0) {
    var idx = Math.floor(Math.random() * available.length);
    opts.push(available.splice(idx, 1)[0]);
  }
  return _shuffle(opts);
}

function _generateChordOptions(correctRoot, correctKey, count) {
  var correct = correctRoot + ' ' + CHORDS[correctKey].name;
  var opts = [correct];
  var chordKeys = Object.keys(CHORDS);
  while (opts.length < count) {
    var r = NOTES[Math.floor(Math.random() * 12)];
    var k = chordKeys[Math.floor(Math.random() * chordKeys.length)];
    var label = r + ' ' + CHORDS[k].name;
    if (opts.indexOf(label) < 0) opts.push(label);
  }
  return _shuffle(opts);
}

function _shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function practiceAnswer(selected) {
  if (practice.answered) return;
  practice.answered = true;
  practice.total++;
  var q = practice.question;
  var correct = false;

  if (q.type === 'note' || q.type === 'chord' || q.type === 'shape') {
    correct = selected === q.answer;
  } else if (q.type === 'fret') {
    correct = q.validFrets.indexOf(selected) >= 0;
  }

  if (correct) {
    practice.score++;
    practice.streak++;
    if (practice.streak > practice.bestStreak) practice.bestStreak = practice.streak;
  } else {
    practice.streak = 0;
  }

  practice.lastCorrect = correct;
  renderPractice();
}

function buildPracticeControls(bar) {
  bar.innerHTML = '';

  var quizOpts = [
    { value: 'note', label: 'Note Quiz' },
    { value: 'fret', label: 'Fret Quiz' },
    { value: 'chord', label: 'Chord Quiz' },
    { value: 'shape', label: 'Shape Quiz' }
  ];
  bar.appendChild(_sel('Quiz', quizOpts, practice.quizType, function(v) {
    practice.quizType = v;
    localStorage.setItem('gt_practiceQuiz', v);
    practice.score = 0;
    practice.total = 0;
    practice.streak = 0;
    practiceNewQuestion();
    renderPractice();
  }));

  _appendFretboardControls(bar);

  // score display
  var scoreEl = document.createElement('div');
  scoreEl.className = 'flex items-center gap-3 ml-auto text-xs';
  scoreEl.innerHTML = '<span class="text-gray-400">Score: <strong class="text-white">' + practice.score + '/' + practice.total + '</strong></span>' +
    '<span class="text-gray-400">Streak: <strong class="text-gold">' + practice.streak + '</strong></span>' +
    '<span class="text-gray-400">Best: <strong class="text-emerald-400">' + practice.bestStreak + '</strong></span>';
  bar.appendChild(scoreEl);

  // hint button
  bar.appendChild(_btn('Hint', practice.showHint, function() {
    practice.showHint = !practice.showHint;
    renderPractice();
  }));

  // new question
  bar.appendChild(_btn('Next', false, function() {
    practiceNewQuestion();
    renderPractice();
  }));

  // reset
  bar.appendChild(_btn('Reset', false, function() {
    practice.score = 0;
    practice.total = 0;
    practice.streak = 0;
    practice.bestStreak = 0;
    practiceNewQuestion();
    refresh();
  }));
}

function renderPractice() {
  var content = document.getElementById('gt-practice-content');
  var fbWrap = document.getElementById('gt-practice-fretboard');
  var bar = document.getElementById('gt-controls');
  var ref = document.getElementById('gt-reference');
  if (!content) return;

  buildPracticeControls(bar);

  var q = practice.question;
  if (!q) { content.innerHTML = ''; return; }

  var html = '';

  // prompt
  html += '<div class="text-lg font-medium mb-4">' + q.prompt + '</div>';

  // feedback
  if (practice.answered) {
    if (practice.lastCorrect) {
      html += '<div class="text-emerald-400 font-bold mb-3">Correct!</div>';
    } else {
      var ans = q.answer || ('Fret ' + q.validFrets.join(' or '));
      html += '<div class="text-red-400 font-bold mb-3">Wrong — answer: ' + ans + '</div>';
    }
  }

  // answer options (for note, chord, shape quizzes)
  if (q.type === 'note' || q.type === 'chord' || q.type === 'shape') {
    html += '<div class="flex flex-wrap gap-2 mb-4">';
    q.options.forEach(function(opt) {
      var cls = 'px-4 py-2 rounded-lg text-sm font-medium transition ';
      if (practice.answered) {
        if (opt === q.answer) cls += 'bg-emerald-700 text-white';
        else cls += 'bg-dark-700 text-gray-600';
      } else {
        cls += 'bg-dark-700 text-gray-200 hover:bg-dark-600 hover:text-white cursor-pointer';
      }
      html += '<button class="' + cls + '" onclick="window._gtPracticeAnswer(\'' + opt.replace(/'/g, "\\'") + '\')">' + opt + '</button>';
    });
    html += '</div>';
  }

  // fret quiz: click-on-fretboard instruction
  if (q.type === 'fret' && !practice.answered) {
    html += '<div class="text-sm text-gray-400 mb-2">Click the correct fret on the fretboard below</div>';
  }

  // hint
  if (practice.showHint && !practice.answered) {
    html += '<div class="text-xs text-gold bg-gold/10 rounded px-3 py-2 mb-3">';
    if (q.type === 'note') {
      html += 'Open string ' + getTuning()[q.stringIndex] + ' + ' + q.fret + ' frets up';
    } else if (q.type === 'fret') {
      html += 'Count semitones from ' + getTuning()[q.stringIndex] + ' to find ' + q.targetNote;
    } else if (q.type === 'chord') {
      html += 'Listen for the quality: major (bright), minor (dark), 7th (bluesy)';
    } else if (q.type === 'shape') {
      html += 'Look at the root position and the intervals between fretted notes';
    }
    html += '</div>';
  }

  // replay button for chord quiz
  if (q.type === 'chord') {
    html += '<button class="px-3 py-1 rounded text-xs bg-dark-700 text-gray-300 hover:text-white mb-3" onclick="window._gtPracticeReplay()">Replay Chord</button>';
  }

  content.innerHTML = html;

  // render fretboard
  if (q.type === 'note') {
    var highlighted = [q.answer];
    var posFilter = null;
    if (!practice.answered && !practice.showHint) {
      highlighted = [];
    }
    renderFretboard(fbWrap, {
      tuning: getTuning(),
      highlighted: practice.answered || practice.showHint ? [q.answer] : NOTES,
      root: q.answer,
      fretCount: S.fretCount,
      positionFilter: !practice.answered && !practice.showHint ? { startFret: q.fret, endFret: q.fret } : null
    });
    // highlight the specific fret/string with a marker
    if (!practice.answered) {
      _markQuestionFret(fbWrap, q.stringIndex, q.fret);
    }
  } else if (q.type === 'fret') {
    renderFretboard(fbWrap, {
      tuning: getTuning(),
      highlighted: practice.answered ? [q.targetNote] : [],
      root: q.targetNote,
      fretCount: S.fretCount,
      onNoteClick: !practice.answered ? function(note) {
        // find fret that was clicked — use a simpler approach
      } : null
    });
    _setupFretClickHandler(fbWrap, q);
  } else if (q.type === 'shape') {
    renderFretboard(fbWrap, {
      tuning: getTuning(),
      highlighted: q.chordNotes,
      root: q.root,
      fretCount: S.fretCount,
      voicingPositions: q.voicingPositions
    });
  } else {
    fbWrap.innerHTML = '';
  }

  // reference panel
  if (practice.answered && (q.type === 'chord' || q.type === 'shape')) {
    var info = CHORDS[q.chordKey];
    if (info) {
      ref.innerHTML = '<strong>' + q.answer + '</strong> · ' + info.formula + ' · ' + info.description;
    }
  } else {
    ref.innerHTML = '<span class="text-gray-500">Answer the question to see details</span>';
  }
}

function _markQuestionFret(fbWrap, stringIndex, fret) {
  var rows = fbWrap.querySelectorAll('.flex.items-center');
  // rows[0] = marker row, rows[1..n] = string rows, last = number row
  var stringRow = rows[stringIndex + 1];
  if (!stringRow) return;
  // cells: first child is label, then fret cells
  var cells = stringRow.children;
  var cell = cells[fret + 1];
  if (!cell) return;

  var marker = document.createElement('div');
  marker.className = 'absolute inset-0 border-2 border-gold rounded z-20 pointer-events-none';
  cell.style.position = 'relative';
  cell.appendChild(marker);
}

function _setupFretClickHandler(fbWrap, q) {
  if (practice.answered) return;
  var rows = fbWrap.querySelectorAll('.flex.items-center');
  var stringRow = rows[q.stringIndex + 1];
  if (!stringRow) return;
  var cells = stringRow.children;
  for (var i = 1; i < cells.length; i++) {
    (function(fretIdx) {
      cells[i].style.cursor = 'pointer';
      cells[i].addEventListener('click', function() {
        practiceAnswer(fretIdx);
      });
    })(i - 1);
  }
}

// global handlers for inline onclick
window._gtPracticeAnswer = function(val) { practiceAnswer(val); };
window._gtPracticeReplay = function() {
  var q = practice.question;
  if (q && q.notes) playChordNotes(q.notes, 3, true);
};

// ═══════════════════════════════════════════════════════════════════
// EAR TRAINING MODE
// ═══════════════════════════════════════════════════════════════════

var ear = {
  exerciseType: localStorage.getItem('gt_earExercise') || 'interval',
  difficulty: localStorage.getItem('gt_earDifficulty') || 'easy',
  playMode: localStorage.getItem('gt_earPlayMode') || 'sequential',
  score: 0,
  total: 0,
  streak: 0,
  bestStreak: 0,
  question: null,
  answered: false
};

function earNewQuestion() {
  ear.answered = false;
  var baseNote = NOTES[Math.floor(Math.random() * 12)];
  var baseOctave = 3 + Math.floor(Math.random() * 2);

  if (ear.exerciseType === 'interval') {
    var available = getIntervalsByDifficulty(ear.difficulty);
    var intervalKey = available[Math.floor(Math.random() * available.length)];
    var interval = INTERVALS[intervalKey];
    var secondNote = getNoteAtInterval(baseNote, interval.semitones);

    ear.question = {
      type: 'interval',
      baseNote: baseNote,
      baseOctave: baseOctave,
      secondNote: secondNote,
      answer: intervalKey,
      interval: interval,
      options: _shuffleWith(intervalKey, available, Math.min(available.length, 6))
    };

    _playEarInterval(baseNote, secondNote, baseOctave);

  } else if (ear.exerciseType === 'chord') {
    var available2 = getChordQualitiesByDifficulty(ear.difficulty);
    var qualityKey = available2[Math.floor(Math.random() * available2.length)];
    var quality = CHORD_QUALITIES[qualityKey];
    var notes = quality.intervals.map(function(i) { return getNoteAtInterval(baseNote, i); });

    ear.question = {
      type: 'chord',
      baseNote: baseNote,
      baseOctave: baseOctave,
      notes: notes,
      answer: qualityKey,
      quality: quality,
      options: _shuffleWith(qualityKey, available2, Math.min(available2.length, 6))
    };

    _playEarChord(notes, baseOctave);

  } else if (ear.exerciseType === 'root') {
    ear.question = {
      type: 'root',
      answer: baseNote,
      baseOctave: baseOctave,
      options: _shuffleWith(baseNote, NOTES, 6)
    };

    playNote(baseNote, baseOctave, 1.5);
  }
}

function _playEarInterval(note1, note2, octave) {
  if (ear.playMode === 'sequential') {
    playNote(note1, octave, 1);
    setTimeout(function() { playNote(note2, octave, 1); }, 600);
  } else {
    playNote(note1, octave, 1.5);
    playNote(note2, octave, 1.5);
  }
}

function _playEarChord(notes, octave) {
  if (ear.playMode === 'sequential') {
    notes.forEach(function(n, i) {
      setTimeout(function() { playNote(n, octave, 0.8); }, i * 400);
    });
  } else {
    playChordNotes(notes, octave, false);
  }
}

function earAnswer(selected) {
  if (ear.answered) return;
  ear.answered = true;
  ear.total++;

  var correct = selected === ear.question.answer;
  if (correct) {
    ear.score++;
    ear.streak++;
    if (ear.streak > ear.bestStreak) ear.bestStreak = ear.streak;
  } else {
    ear.streak = 0;
  }
  ear.lastCorrect = correct;
  renderEar();
}

function buildEarControls(bar) {
  bar.innerHTML = '';

  var exOpts = [
    { value: 'interval', label: 'Intervals' },
    { value: 'chord', label: 'Chord Quality' },
    { value: 'root', label: 'Root Note' }
  ];
  bar.appendChild(_sel('Exercise', exOpts, ear.exerciseType, function(v) {
    ear.exerciseType = v;
    localStorage.setItem('gt_earExercise', v);
    ear.score = 0; ear.total = 0; ear.streak = 0;
    earNewQuestion();
    renderEar();
  }));

  var diffOpts = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];
  bar.appendChild(_sel('Level', diffOpts, ear.difficulty, function(v) {
    ear.difficulty = v;
    localStorage.setItem('gt_earDifficulty', v);
    ear.score = 0; ear.total = 0; ear.streak = 0;
    earNewQuestion();
    renderEar();
  }));

  var playOpts = [
    { value: 'sequential', label: 'Sequential' },
    { value: 'block', label: 'Block (Together)' }
  ];
  bar.appendChild(_sel('Play', playOpts, ear.playMode, function(v) {
    ear.playMode = v;
    localStorage.setItem('gt_earPlayMode', v);
  }));

  _appendFretboardControls(bar);

  // score
  var scoreEl = document.createElement('div');
  scoreEl.className = 'flex items-center gap-3 ml-auto text-xs';
  scoreEl.innerHTML = '<span class="text-gray-400">Score: <strong class="text-white">' + ear.score + '/' + ear.total + '</strong></span>' +
    '<span class="text-gray-400">Streak: <strong class="text-gold">' + ear.streak + '</strong></span>' +
    '<span class="text-gray-400">Best: <strong class="text-emerald-400">' + ear.bestStreak + '</strong></span>';
  bar.appendChild(scoreEl);

  bar.appendChild(_btn('Replay', false, function() {
    var q = ear.question;
    if (!q) return;
    if (q.type === 'interval') _playEarInterval(q.baseNote, q.secondNote, q.baseOctave);
    else if (q.type === 'chord') _playEarChord(q.notes, q.baseOctave);
    else if (q.type === 'root') playNote(q.answer, q.baseOctave, 1.5);
  }));

  bar.appendChild(_btn('Next', false, function() {
    earNewQuestion();
    renderEar();
  }));

  bar.appendChild(_btn('Reset', false, function() {
    ear.score = 0; ear.total = 0; ear.streak = 0; ear.bestStreak = 0;
    earNewQuestion();
    renderEar();
  }));
}

function renderEar() {
  var content = document.getElementById('gt-ear-content');
  var fbWrap = document.getElementById('gt-ear-fretboard');
  var bar = document.getElementById('gt-controls');
  var ref = document.getElementById('gt-reference');
  if (!content) return;

  buildEarControls(bar);

  var q = ear.question;
  if (!q) { content.innerHTML = ''; return; }

  var html = '';
  html += '<div class="text-lg font-medium mb-4">';
  if (q.type === 'interval') html += 'What interval do you hear?';
  else if (q.type === 'chord') html += 'What chord quality do you hear?';
  else if (q.type === 'root') html += 'What note do you hear?';
  html += '</div>';

  // feedback
  if (ear.answered) {
    var answerLabel;
    if (q.type === 'interval') answerLabel = q.interval.name;
    else if (q.type === 'chord') answerLabel = q.quality.name;
    else answerLabel = q.answer;

    if (ear.lastCorrect) {
      html += '<div class="text-emerald-400 font-bold mb-3">Correct! — ' + answerLabel + '</div>';
    } else {
      html += '<div class="text-red-400 font-bold mb-3">Wrong — answer: ' + answerLabel + '</div>';
    }
  }

  // options
  html += '<div class="flex flex-wrap gap-2 mb-4">';
  q.options.forEach(function(opt) {
    var label;
    if (q.type === 'interval') label = INTERVALS[opt] ? INTERVALS[opt].name : opt;
    else if (q.type === 'chord') label = CHORD_QUALITIES[opt] ? CHORD_QUALITIES[opt].name : opt;
    else label = getNoteDisplayName(opt);

    var cls = 'px-4 py-2 rounded-lg text-sm font-medium transition ';
    if (ear.answered) {
      if (opt === q.answer) cls += 'bg-emerald-700 text-white';
      else cls += 'bg-dark-700 text-gray-600';
    } else {
      cls += 'bg-dark-700 text-gray-200 hover:bg-dark-600 hover:text-white cursor-pointer';
    }
    html += '<button class="' + cls + '" onclick="window._gtEarAnswer(\'' + opt.replace(/'/g, "\\'") + '\')">' + label + '</button>';
  });
  html += '</div>';

  content.innerHTML = html;
  fbWrap.innerHTML = '';

  // reference
  if (ear.answered) {
    if (q.type === 'interval') {
      ref.innerHTML = '<strong>' + q.interval.name + '</strong> (' + q.interval.semitones + ' semitones) · ' +
        q.interval.description + ' · Song ref: ' + q.interval.songReference + ' — ' + q.interval.songArtist;
    } else if (q.type === 'chord') {
      ref.innerHTML = '<strong>' + q.quality.name + '</strong> · ' + q.quality.description;
    } else {
      ref.innerHTML = '<strong>' + q.answer + '</strong> · Frequency: ~' + Math.round(noteToFreq(q.answer, q.baseOctave)) + ' Hz';
    }
  } else {
    ref.innerHTML = '<span class="text-gray-500">Listen carefully and choose your answer</span>';
  }
}

window._gtEarAnswer = function(val) { earAnswer(val); };

// ═══════════════════════════════════════════════════════════════════
// JAM MODE
// ═══════════════════════════════════════════════════════════════════

var jam = {
  bpm: parseInt(localStorage.getItem('gt_jamBpm')) || 120,
  timeSig: parseInt(localStorage.getItem('gt_jamTimeSig')) || 4,
  swing: parseFloat(localStorage.getItem('gt_jamSwing')) || 0,
  loop: localStorage.getItem('gt_jamLoop') !== 'false',
  metronomeOn: localStorage.getItem('gt_jamMetronome') !== 'false',
  playing: false,
  currentStep: -1,
  currentBeat: -1,
  steps: JSON.parse(localStorage.getItem('gt_jamSteps') || 'null') || [
    { root: 'C', type: 'major', beats: 4 },
    { root: 'F', type: 'major', beats: 4 },
    { root: 'G', type: 'dom7', beats: 4 },
    { root: 'C', type: 'major', beats: 4 }
  ],
  _timerId: null,
  _nextNoteTime: 0,
  _scheduledBeat: 0
};

function jamSaveSteps() {
  localStorage.setItem('gt_jamSteps', JSON.stringify(jam.steps));
}

function jamAddStep() {
  jam.steps.push({ root: 'C', type: 'major', beats: 4 });
  jamSaveSteps();
  renderJam();
}

function jamRemoveStep(idx) {
  if (jam.steps.length <= 1) return;
  jam.steps.splice(idx, 1);
  jamSaveSteps();
  renderJam();
}

function jamUpdateStep(idx, key, val) {
  jam.steps[idx][key] = val;
  jamSaveSteps();
  renderJam();
}

function jamStart() {
  if (jam.playing) return;
  jam.playing = true;
  jam.currentStep = 0;
  jam.currentBeat = 0;
  jam._scheduledBeat = 0;

  var ctx = getAudioCtx();
  jam._nextNoteTime = ctx.currentTime + 0.05;
  _jamScheduler();
  renderJam();
}

function jamStop() {
  jam.playing = false;
  if (jam._timerId) { clearTimeout(jam._timerId); jam._timerId = null; }
  jam.currentStep = -1;
  jam.currentBeat = -1;
  renderJam();
}

function _jamScheduler() {
  if (!jam.playing) return;
  var ctx = getAudioCtx();
  var lookahead = 0.1;

  while (jam._nextNoteTime < ctx.currentTime + lookahead) {
    _jamPlayBeat(jam._nextNoteTime);
    _jamAdvanceBeat();
  }

  jam._timerId = setTimeout(_jamScheduler, 25);
}

function _jamPlayBeat(time) {
  var ctx = getAudioCtx();
  var step = jam.steps[jam.currentStep];
  if (!step) return;

  // metronome click with accent pattern per time signature
  if (jam.metronomeOn) {
    var isAccent = jam.currentBeat === 0;
    // 6/8: accent on beats 0 and 3 (two groups of 3)
    if (jam.timeSig === 6) isAccent = jam.currentBeat === 0 || jam.currentBeat === 3;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = isAccent ? 1000 : 800;
    gain.gain.setValueAtTime(isAccent ? 0.15 : 0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.05);
  }

  // play chord on beat 1 of each step
  if (jam.currentBeat === 0) {
    var notes = getChordNotes(step.root, step.type);
    notes.forEach(function(n, i) {
      var noteOsc = ctx.createOscillator();
      var noteGain = ctx.createGain();
      noteOsc.type = S.audioWaveform;
      noteOsc.frequency.value = noteToFreq(n, 3);
      var delay = i * 0.02;
      noteGain.gain.setValueAtTime(0, time + delay);
      noteGain.gain.linearRampToValueAtTime(0.2, time + delay + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + 1.0);
      noteOsc.connect(noteGain);
      noteGain.connect(ctx.destination);
      noteOsc.start(time + delay);
      noteOsc.stop(time + 1.2);
    });

    // update display
    setTimeout(function() { _jamUpdateDisplay(); }, (time - ctx.currentTime) * 1000);
  }
}

function _jamAdvanceBeat() {
  var step = jam.steps[jam.currentStep];
  var beatDuration = 60.0 / jam.bpm;

  // apply swing to off-beats
  var swingOffset = 0;
  if (jam.swing > 0 && jam.currentBeat % 2 === 1) {
    swingOffset = beatDuration * jam.swing * 0.3;
  }

  jam._nextNoteTime += beatDuration + swingOffset;
  jam.currentBeat++;

  if (jam.currentBeat >= (step ? step.beats : jam.timeSig)) {
    jam.currentBeat = 0;
    jam.currentStep++;
    if (jam.currentStep >= jam.steps.length) {
      if (jam.loop) {
        jam.currentStep = 0;
      } else {
        jamStop();
      }
    }
  }
}

function _jamUpdateDisplay() {
  var rows = document.querySelectorAll('.gt-jam-step');
  rows.forEach(function(row, i) {
    if (i === jam.currentStep && jam.playing) {
      row.classList.add('bg-accent/10', 'border-accent');
      row.classList.remove('border-gray-700');
    } else {
      row.classList.remove('bg-accent/10', 'border-accent');
      row.classList.add('border-gray-700');
    }
  });

  // update fretboard + reference for current step
  var fbWrap = document.getElementById('gt-jam-fretboard');
  var ref = document.getElementById('gt-reference');
  if (!fbWrap || !jam.playing) return;

  var step = jam.steps[jam.currentStep];
  if (!step) return;

  var chordNotes = getChordNotes(step.root, step.type);
  renderFretboard(fbWrap, {
    tuning: getTuning(),
    highlighted: chordNotes,
    root: step.root,
    fretCount: S.fretCount
  });

  if (ref) {
    ref.innerHTML = '<strong>' + step.root + ' ' + CHORDS[step.type].name + '</strong> · ' +
      CHORDS[step.type].formula + ' · Notes: ' + chordNotes.join(' - ');
  }
}

function buildJamControls(bar) {
  bar.innerHTML = '';

  // transport
  if (!jam.playing) {
    bar.appendChild(_btn('▶ Play', false, jamStart));
  } else {
    bar.appendChild(_btn('■ Stop', true, jamStop));
  }

  // bpm
  var bpmWrap = document.createElement('div');
  bpmWrap.className = 'flex items-center gap-1';
  var bpmLabel = document.createElement('span');
  bpmLabel.className = 'text-[10px] text-gray-500 uppercase tracking-wider';
  bpmLabel.textContent = 'BPM';
  bpmWrap.appendChild(bpmLabel);
  var bpmInput = document.createElement('input');
  bpmInput.type = 'number';
  bpmInput.min = '40';
  bpmInput.max = '240';
  bpmInput.value = jam.bpm;
  bpmInput.className = 'bg-dark-700 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 w-16 focus:outline-none focus:border-accent';
  bpmInput.addEventListener('change', function() {
    jam.bpm = Math.max(40, Math.min(240, parseInt(bpmInput.value) || 120));
    localStorage.setItem('gt_jamBpm', jam.bpm);
  });
  bpmWrap.appendChild(bpmInput);
  bar.appendChild(bpmWrap);

  // time signature
  var tsOpts = [
    { value: 3, label: '3/4' },
    { value: 4, label: '4/4' },
    { value: 6, label: '6/8' }
  ];
  bar.appendChild(_sel('Time', tsOpts, jam.timeSig, function(v) {
    jam.timeSig = parseInt(v);
    localStorage.setItem('gt_jamTimeSig', jam.timeSig);
  }));

  // swing
  var swingOpts = [
    { value: 0, label: 'None' },
    { value: 0.3, label: 'Light' },
    { value: 0.6, label: 'Medium' },
    { value: 1.0, label: 'Heavy' }
  ];
  bar.appendChild(_sel('Swing', swingOpts, jam.swing, function(v) {
    jam.swing = parseFloat(v);
    localStorage.setItem('gt_jamSwing', jam.swing);
  }));

  // loop toggle
  bar.appendChild(_toggle('Loop', jam.loop, function(v) {
    jam.loop = v;
    localStorage.setItem('gt_jamLoop', v);
  }));

  // metronome toggle
  bar.appendChild(_toggle('Metro', jam.metronomeOn, function(v) {
    jam.metronomeOn = v;
    localStorage.setItem('gt_jamMetronome', v);
  }));

  _appendFretboardControls(bar);

  // presets
  bar.appendChild(_btn('Save', false, function() {
    var name = prompt('Preset name:');
    if (!name) return;
    var presets = JSON.parse(localStorage.getItem('gt_jamPresets') || '{}');
    presets[name] = { steps: jam.steps, bpm: jam.bpm, timeSig: jam.timeSig };
    localStorage.setItem('gt_jamPresets', JSON.stringify(presets));
  }));

  bar.appendChild(_btn('Load', false, function() {
    var presets = JSON.parse(localStorage.getItem('gt_jamPresets') || '{}');
    var names = Object.keys(presets);
    if (names.length === 0) { alert('No saved presets'); return; }
    var name = prompt('Load preset:\n' + names.join('\n'));
    if (!name || !presets[name]) return;
    jam.steps = presets[name].steps;
    jam.bpm = presets[name].bpm || 120;
    jam.timeSig = presets[name].timeSig || 4;
    jamSaveSteps();
    localStorage.setItem('gt_jamBpm', jam.bpm);
    renderJam();
  }));
}

function renderJam() {
  var content = document.getElementById('gt-jam-content');
  var fbWrap = document.getElementById('gt-jam-fretboard');
  var bar = document.getElementById('gt-controls');
  var ref = document.getElementById('gt-reference');
  if (!content) return;

  buildJamControls(bar);

  var html = '<div class="space-y-2">';

  // header
  html += '<div class="flex items-center gap-2 mb-2">';
  html += '<span class="text-sm font-medium text-gray-300">Chord Progression</span>';
  html += '<button class="px-2 py-0.5 rounded text-xs bg-dark-700 text-gray-400 hover:text-white" onclick="window._gtJamAdd()">+ Add Step</button>';
  html += '</div>';

  // steps
  jam.steps.forEach(function(step, i) {
    var isActive = jam.playing && i === jam.currentStep;
    html += '<div class="gt-jam-step flex items-center gap-2 p-2 rounded border ' +
      (isActive ? 'bg-accent/10 border-accent' : 'border-gray-700 bg-dark-800') + '">';

    html += '<span class="text-xs text-gray-500 w-5">' + (i + 1) + '</span>';

    // root selector
    html += '<select class="bg-dark-700 border border-gray-700 rounded px-1 py-0.5 text-xs text-gray-200" onchange="window._gtJamStep(' + i + ',\'root\',this.value)">';
    NOTES.forEach(function(n) {
      html += '<option value="' + n + '"' + (n === step.root ? ' selected' : '') + '>' + getNoteDisplayName(n) + '</option>';
    });
    html += '</select>';

    // chord type
    html += '<select class="bg-dark-700 border border-gray-700 rounded px-1 py-0.5 text-xs text-gray-200" onchange="window._gtJamStep(' + i + ',\'type\',this.value)">';
    Object.entries(CHORDS).forEach(function(e) {
      html += '<option value="' + e[0] + '"' + (e[0] === step.type ? ' selected' : '') + '>' + e[1].name + '</option>';
    });
    html += '</select>';

    // beats
    html += '<select class="bg-dark-700 border border-gray-700 rounded px-1 py-0.5 text-xs text-gray-200 w-14" onchange="window._gtJamStep(' + i + ',\'beats\',parseInt(this.value))">';
    [1,2,3,4,6,8].forEach(function(b) {
      html += '<option value="' + b + '"' + (b === step.beats ? ' selected' : '') + '>' + b + ' beats</option>';
    });
    html += '</select>';

    // play preview
    html += '<button class="text-xs text-gray-500 hover:text-white" onclick="window._gtJamPreview(' + i + ')">♪</button>';

    // remove
    if (jam.steps.length > 1) {
      html += '<button class="text-xs text-red-500/50 hover:text-red-400 ml-auto" onclick="window._gtJamRemove(' + i + ')">✕</button>';
    }

    html += '</div>';
  });

  html += '</div>';
  content.innerHTML = html;

  // show fretboard for current step
  if (jam.playing && jam.currentStep >= 0 && jam.currentStep < jam.steps.length) {
    var step = jam.steps[jam.currentStep];
    var chordNotes = getChordNotes(step.root, step.type);
    renderFretboard(fbWrap, {
      tuning: getTuning(),
      highlighted: chordNotes,
      root: step.root,
      fretCount: S.fretCount
    });
    ref.innerHTML = '<strong>' + step.root + ' ' + CHORDS[step.type].name + '</strong> · ' +
      CHORDS[step.type].formula + ' · Notes: ' + chordNotes.join(' - ');
  } else if (!jam.playing && jam.steps.length > 0) {
    var first = jam.steps[0];
    var firstNotes = getChordNotes(first.root, first.type);
    renderFretboard(fbWrap, {
      tuning: getTuning(),
      highlighted: firstNotes,
      root: first.root,
      fretCount: S.fretCount
    });
    ref.innerHTML = 'Press Play to start the progression';
  } else {
    fbWrap.innerHTML = '';
    ref.innerHTML = '';
  }
}

// jam global handlers
window._gtJamAdd = function() { jamAddStep(); };
window._gtJamRemove = function(i) { jamRemoveStep(i); };
window._gtJamStep = function(i, k, v) { jamUpdateStep(i, k, v); };
window._gtJamPreview = function(i) {
  var step = jam.steps[i];
  if (step) playChordNotes(getChordNotes(step.root, step.type), 3, true);
};

// ═══════════════════════════════════════════════════════════════════
// MAIN REFRESH / RENDER
// ═══════════════════════════════════════════════════════════════════

function refresh() {
  var bar = document.getElementById('gt-controls');
  var ref = document.getElementById('gt-reference');

  if (S.mode === 'learn') {
    buildLearnControls(bar);
    renderLearn();
    updateReference(ref);
  } else if (S.mode === 'practice') {
    if (!practice.question) practiceNewQuestion();
    renderPractice();
  } else if (S.mode === 'ear') {
    if (!ear.question) earNewQuestion();
    renderEar();
  } else if (S.mode === 'jam') {
    renderJam();
  }
}

function renderLearn() {
  var container = document.getElementById('gt-fretboard-wrap');
  if (!container) return;

  var tuning = getTuning();
  var highlighted, typeKey;

  if (S.selectionType === 'scale') {
    highlighted = getScaleNotes(S.root, S.scaleKey);
    typeKey = S.scaleKey;
  } else {
    highlighted = getChordNotes(S.root, S.chordKey);
    typeKey = S.chordKey;
  }

  var opts = {
    tuning: tuning,
    highlighted: highlighted,
    root: S.root,
    showIntervals: S.showIntervals,
    fretCount: S.fretCount,
    flip: S.flipFretboard
  };

  // position filter
  if (S.learnView === 'position') {
    var posOptions = getPositionOptions();
    var pos = posOptions.find(function(p) { return p.value === S.position; });
    if (pos) opts.positionFilter = { startFret: pos.startFret, endFret: pos.endFret };
  }

  // path mode
  if (S.learnView === 'path') {
    var pathNotes = calculateNeckTraversalPath(
      tuning, highlighted, S.root, S.fretCount, 4, false, S.pathDirection
    );
    opts.pathNotes = pathNotes;
  }

  // voicing mode
  if (S.learnView === 'voicing' && S.selectionType === 'chord') {
    var voicings = getVoicingsForChord(S.root, S.chordKey, tuning);
    if (voicings.length > 0) {
      var idx = Math.min(S.voicingIndex, voicings.length - 1);
      var positions = voicingToFretPositions(voicings[idx], tuning);
      opts.voicingPositions = positions;
      opts.highlighted = getChordNotes(S.root, S.chordKey);
    }
  }

  renderFretboard(container, opts);
}

// ═══════════════════════════════════════════════════════════════════
// MODE SWITCHING
// ═══════════════════════════════════════════════════════════════════

function switchMode(mode) {
  saveState('mode', mode);

  // update tab styling
  document.querySelectorAll('[data-gt-tab]').forEach(function(btn) {
    var isActive = btn.getAttribute('data-gt-tab') === mode;
    btn.className = 'px-3 py-1.5 rounded-lg text-xs transition ' +
      (isActive ? 'bg-accent text-white' : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600');
  });

  // show/hide mode panels
  document.querySelectorAll('.gt-mode').forEach(function(el) { el.classList.add('hidden'); });
  var target = document.getElementById('gt-mode-' + mode);
  if (target) target.classList.remove('hidden');

  refresh();
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════

function init() {
  var root = document.getElementById('gt-root');
  if (!root) {
    setTimeout(init, 100);
    return;
  }

  // wire up tab buttons
  document.querySelectorAll('[data-gt-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchMode(btn.getAttribute('data-gt-tab'));
    });
  });

  // initial mode
  switchMode(S.mode);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 50);
}

})();
