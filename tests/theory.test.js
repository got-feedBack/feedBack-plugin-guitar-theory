'use strict';
// Coverage for the music-theory engine in screen.js: note math, scale/chord
// lookups, interval naming, fretboard generation, positions.
// Runs under the org reusable CI as `node tests/theory.test.js`.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

function freshPlugin() {
    global.localStorage = { getItem: () => null, setItem: () => {} };
    global.window = {};
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    return require(file);
}

const mod = freshPlugin();

test('getNoteDisplayName shows sharp/flat enharmonics for accidentals only', () => {
    assert.equal(mod.getNoteDisplayName('C#'), 'C♯/D♭');
    assert.equal(mod.getNoteDisplayName('C'), 'C');
    assert.equal(mod.getNoteDisplayName('G'), 'G');
});

test('getNoteIndex resolves both sharp and flat spellings to the same pitch class', () => {
    assert.equal(mod.getNoteIndex('C'), 0);
    assert.equal(mod.getNoteIndex('C#'), 1);
    assert.equal(mod.getNoteIndex('Db'), 1);
    assert.equal(mod.getNoteIndex('B'), 11);
});

test('getNoteAtInterval / getNoteOnFret wrap around the octave', () => {
    assert.equal(mod.getNoteAtInterval('C', 7), 'G');
    assert.equal(mod.getNoteAtInterval('B', 1), 'C');
    assert.equal(mod.getNoteOnFret('E', 12), 'E'); // octave on the low E string
    assert.equal(mod.getNoteOnFret('A', 3), 'C');
});

test('getScaleOptions/getChordOptions/getIntervalOptions/getTuningOptions expose value+label pairs', () => {
    for (const opt of mod.getScaleOptions()) {
        assert.equal(typeof opt.value, 'string');
        assert.equal(typeof opt.label, 'string');
    }
    for (const opt of mod.getChordOptions()) {
        assert.equal(typeof opt.value, 'string');
    }
    for (const opt of mod.getIntervalOptions()) {
        assert.equal(typeof opt.semitones, 'number');
    }
    for (const opt of mod.getTuningOptions()) {
        assert.equal(typeof opt.value, 'string');
    }
    assert.ok(mod.getScaleOptions().some(o => o.value === 'major'));
    assert.ok(mod.getChordOptions().some(o => o.value === 'major'));
    assert.ok(mod.getTuningOptions().some(o => o.value === 'standard'));
});

test('getIntervalsByDifficulty and getChordQualitiesByDifficulty scale with difficulty', () => {
    const easy = mod.getIntervalsByDifficulty('easy');
    const hard = mod.getIntervalsByDifficulty('hard');
    assert.ok(Array.isArray(easy) && easy.length > 0);
    assert.ok(hard.length >= easy.length);

    const easyChords = mod.getChordQualitiesByDifficulty('easy');
    const hardChords = mod.getChordQualitiesByDifficulty('hard');
    assert.ok(Array.isArray(easyChords) && easyChords.length > 0);
    assert.ok(hardChords.length >= easyChords.length);
});

test('getIntervalBySemitones returns the [key, descriptor] entry for a known interval', () => {
    const [key, info] = mod.getIntervalBySemitones(7);
    assert.equal(key, 'P5');
    assert.equal(info.semitones, 7);
    assert.equal(info.shortName, 'P5');
});

test('getScaleNotes/getChordNotes derive pitch sets from a root', () => {
    assert.deepEqual(mod.getScaleNotes('C', 'major'), ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    assert.deepEqual(mod.getChordNotes('C', 'major'), ['C', 'E', 'G']);
    assert.deepEqual(mod.getChordNotes('A', 'minor'), ['A', 'C', 'E']);
});

test('isNoteInScale/isNoteInChord membership checks', () => {
    assert.equal(mod.isNoteInScale('E', 'C', 'major'), true);
    assert.equal(mod.isNoteInScale('C#', 'C', 'major'), false);
    assert.equal(mod.isNoteInChord('G', 'C', 'major'), true);
    assert.equal(mod.isNoteInChord('D', 'C', 'major'), false);
});

test('getIntervalFromRoot and getIntervalName agree on scale-degree naming', () => {
    assert.equal(mod.getIntervalFromRoot('G', 'C'), 7);
    assert.equal(mod.getIntervalName('G', 'C'), '5');
    assert.equal(mod.getIntervalName('C', 'C'), 'R');
    assert.equal(mod.getIntervalName('D#', 'C'), 'b3');
});

test('getIntervalName uses chord-flavored labels when isChord is true', () => {
    const scaleLabel = mod.getIntervalName('E', 'C', false);
    const chordLabel = mod.getIntervalName('E', 'C', true);
    assert.equal(typeof scaleLabel, 'string');
    assert.equal(typeof chordLabel, 'string');
});

test('generateFretboardData produces one row per string with fret+note pairs', () => {
    const tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
    const board = mod.generateFretboardData(tuning, 5);
    assert.equal(board.length, 6);
    assert.equal(board[0].length, 6); // frets 0..5 inclusive
    assert.equal(board[0][0].note, 'E');
    assert.equal(board[0][0].stringIndex, 0);
    assert.equal(board[5][0].note, 'E');
});

test('getHighlightedNotes dispatches on selection type', () => {
    assert.deepEqual(mod.getHighlightedNotes('C', 'scale', 'major'), mod.getScaleNotes('C', 'major'));
    assert.deepEqual(mod.getHighlightedNotes('C', 'chord', 'major'), mod.getChordNotes('C', 'major'));
    assert.deepEqual(mod.getHighlightedNotes('C', 'bogus', 'major'), []);
});

test('getSelectionInfo returns the scale/chord descriptor or null', () => {
    assert.ok(mod.getSelectionInfo('scale', 'major'));
    assert.ok(mod.getSelectionInfo('chord', 'major'));
    assert.equal(mod.getSelectionInfo('scale', 'nope'), null);
    assert.equal(mod.getSelectionInfo('bogus', 'major'), null);
});

test('getPositionName / getPositionOptions describe fretboard position windows', () => {
    assert.equal(mod.getPositionName(0), 'Open');
    const options = mod.getPositionOptions();
    assert.ok(options.length > 0);
    for (const opt of options) {
        assert.ok(opt.endFret > opt.startFret);
    }
});

test('findNoteOnString locates every fret matching a target note within range', () => {
    // Low E string: E(0) A(5) ... G occurs at fret 3 and fret 15.
    assert.deepEqual(mod.findNoteOnString('G', 'E', 22), [3, 15]);
    assert.deepEqual(mod.findNoteOnString('E', 'E', 12), [0, 12]);
});

test('calculateRootFretOffset finds the nearest fret producing the target root', () => {
    const STANDARD = ['E', 'A', 'D', 'G', 'B', 'E'];
    const fret = mod.calculateRootFretOffset('G', 0, STANDARD);
    assert.equal(mod.getNoteOnFret(STANDARD[0], fret), 'G');
});
