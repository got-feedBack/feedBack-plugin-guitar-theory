# Guitar Theory Lab - Slopsmith Plugin

An interactive guitar theory learning tool built as a [slopsmith](https://github.com/tborys/slopsmith) plugin. Explore scales, chords, intervals, tunings, and voicings on a fully interactive fretboard - all within the slopsmith UI.

Ported from the standalone [Guitar Theory Lab](https://github.com/topkoa/guitar-theory-lab) React app into a single-file vanilla JS slopsmith plugin.

## Features

### Learn Mode
- **13 scale types**: Major, Natural/Harmonic/Melodic Minor, Pentatonic Major/Minor, Blues, Dorian, Phrygian, Lydian, Mixolydian, Locrian, Chromatic
- **16 chord types**: Major, Minor, Diminished, Augmented, Sus2, Sus4, Dom7, Maj7, Min7, Dim7, Half-Dim, Add9, Power, Dom9, Maj9, Min9
- **19 tuning presets**: 10 guitar tunings (Standard, Drop D, Half Step Down, D Standard, Open G/D/E/A, DADGAD, Drop C) + 9 bass tunings (4/5/6-string variants)
- **4 fretboard views**:
  - **Full Neck** - all notes across the entire fretboard
  - **Position** - notes within a 4-fret window (positions Open through XII)
  - **Path** - diagonal traversal pattern across strings (ascending/descending)
  - **Voicings** - chord voicing shapes from 7 categories (open, barre, CAGED, triad, shell, drop-2, spread, partial) with prev/next navigation
- **Audio playback** for scales (sequential notes) and chords (strummed)
- **Reference panel** showing formula, notes, description, and theory context
- **Interval notation** toggle (note names vs interval labels)

### Practice Mode
- **Note Quiz** - identify the note at a random string/fret position
- **Fret Quiz** - find the fret(s) for a target note on a given string (click the fretboard)
- **Chord Quiz** - listen to a chord and identify its root + type
- **Shape Quiz** - see a voicing shape on the fretboard and identify the chord
- Score tracking with current streak and best streak
- Hint system for each quiz type
- Fretboard visualization with highlighted answers

### Ear Training Mode
- **Interval identification** - hear two notes, identify the interval (12 intervals with song references)
- **Chord quality identification** - hear a chord, identify its quality (major, minor, dom7, maj7, min7, dim, aug, sus2, sus4)
- **Root note identification** - hear a single note, identify it
- **Progressive difficulty**: Easy (perfect intervals), Medium (+ thirds, sixths, sevenths), Hard (+ seconds, tritone)
- **Playback modes**: Sequential (notes one at a time) or Block (simultaneous)
- Replay button to hear the question again

### Jam Mode
- **Chord progression builder** - add/remove/reorder steps with per-step root note, chord type, and beat count
- **Transport controls** - play, stop, BPM (40-240), loop toggle
- **Metronome** with proper accent patterns per time signature:
  - 4/4 - accent on beat 1
  - 3/4 - accent on beat 1
  - 6/8 - accent on beats 1 and 4 (two groups of three)
- **Swing** control (none, light, medium, heavy)
- **Chord audio** synced to progression playback using Web Audio API scheduling
- **Live fretboard** updates to show current chord during playback
- **Preset save/load** via localStorage
- Default progression: I-IV-V-I in C major

### Display Controls (Available on All Tabs)
- **Tuning** selector (all 19 presets)
- **Fret count** (12, 15, 17, or 22 frets)
- **Audio waveform** (sine or triangle)
- **Intervals** toggle (note names vs interval labels)
- **Flip** toggle (invert string order)
- **Left-Hand** toggle (mirror fretboard horizontally for left-handed players)

## Installation

### As a slopsmith plugin (recommended)

Clone this repo into your slopsmith `plugins/` directory:

```bash
cd /path/to/slopsmith/plugins
git clone https://github.com/topkoa/slopsmith-plugin-guitar-theory.git guitar_theory
```

Restart slopsmith. "Theory Lab" will appear in the Plugins nav dropdown.

### Symlink (for development)

```bash
cd /path/to/slopsmith/plugins
ln -s /path/to/slopsmith-plugin-guitar-theory guitar_theory
```

## Plugin Structure

```
guitar_theory/
  plugin.json       # Plugin manifest with nav entry
  screen.html       # Full-screen layout (mode tabs, controls bar, fretboard, reference panel)
  screen.js         # Single IIFE (~5800 lines): all data, utils, renderer, 4 modes
  settings.html     # Default preferences (tuning, frets, display, audio)
  README.md
```

No backend required - everything runs client-side with Web Audio API and localStorage.

## Data

All music theory data is embedded in `screen.js`, ported from the original React app:

| Data | Count | Description |
|------|-------|-------------|
| Scales | 13 | Intervals, formulas, descriptions |
| Chords | 16 | Intervals, formulas, theory context (common uses, tension/resolution, related chords, typical progressions) |
| Intervals | 12 | Semitones, quality, song references for ear training |
| Tunings | 19 | Guitar (10) + Bass (9) with string notes |
| Voicings | ~200+ | Open, barre, CAGED, triad, shell, drop-2, spread, partial shapes + algorithmic generation fallback |

## Settings

All preferences persist via `localStorage` with the `gt_` prefix. Available in the settings page or inline on each tab:

| Setting | Key | Default |
|---------|-----|---------|
| Tuning | `gt_tuningKey` | `standard` |
| Fret count | `gt_fretCount` | `22` |
| Show intervals | `gt_showIntervals` | `false` |
| Flip fretboard | `gt_flipFretboard` | `false` |
| Left-handed | `gt_leftHanded` | `false` |
| Show inlays | `gt_showInlays` | `true` |
| Audio waveform | `gt_audioWaveform` | `triangle` |

## Tech

- **Vanilla JS** - no framework dependencies, single IIFE
- **Tailwind CSS** - uses slopsmith's existing Tailwind setup (dark theme: `bg-dark-900`, accent blue `#4080e0`, gold `#e8c040`)
- **Web Audio API** - oscillator-based note/chord synthesis, precise metronome scheduling via `AudioContext.currentTime`
- **DOM-based fretboard** - divs for strings/frets/notes (not canvas), supports click handlers and CSS styling

## License

MIT
