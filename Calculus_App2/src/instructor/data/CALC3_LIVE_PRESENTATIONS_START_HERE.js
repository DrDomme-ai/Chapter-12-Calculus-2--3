/*
 * CALCULUS III LIVE PRESENTATIONS — START HERE
 *
 * This is the navigation index for the six Chapter 12 live presentations.
 * The actual slide arrays remain in their original source files so existing
 * imports, instructor edits, backups, and slide IDs are not disrupted.
 *
 * To add a slide:
 * 1. Choose the section below.
 * 2. Ctrl+click its import path in the editor.
 * 3. Find the matching exported lecture and edit its `slides: [...]` array.
 * 4. Give every new slide a unique, stable ID.
 */

// Sections 12.1–12.3 are authored in this file:
export {
  chapter121Lecture, // 12.1 Three-Dimensional Coordinate Systems
  chapter122Lecture, // 12.2 Vectors
  chapter123Lecture, // 12.3 The Dot Product
  chapter124Lecture, // 12.4 The Cross Product
  chapter125Lecture, // 12.5 Equations of Lines and Planes
} from './chapter12Lectures'

// Sections 12.4–12.6 are authored in this file:
export {
  chapter126Lecture, // 12.6 Cylinders and Quadric Surfaces
} from './chapter12AdvancedLectures'

// Additional required slides—welcome, retrieval, prerequisite bridge,
// Spark/Smile, exit checks, reflection, confidence, and feedback—are added by:
// ../services/lectureRequirements.js

// The presentation/editor interface is:
// ../LectureStudio.jsx
