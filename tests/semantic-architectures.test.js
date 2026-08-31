import { test } from 'node:test';
import assert from 'node:assert';
import { OneShotEngine } from '../src/orchestrator/oneshot.js';
import { DynamicPlanner } from '../src/orchestrator/planner.js';
import { SemanticEngine } from '../src/orchestrator/semantic-engine.js';
import { RequirementContract } from '../src/orchestrator/requirement-contract.js';

test('Semantic Architecture 1: Hospital Appointment & Clinical Management Platform', async (t) => {
  const prompt = "create a hospital appointment management system where patients can search doctors by specialty, book consultation time slots, and view medical history";
  const oneshot = new OneShotEngine();
  const res = await oneshot.generateWebsite(prompt);

  assert.ok(res.buildResult, "Build result generated");
  const files = res.buildResult.files;

  // 1. Verify Domain TypeScript Entities
  assert.ok(files['src/types/index.ts'].includes('export interface Doctor'), "Doctor interface defined");
  assert.ok(files['src/types/index.ts'].includes('export interface Appointment'), "Appointment interface defined");

  // 2. Verify Domain UI Components
  assert.ok(files['src/components/sections/DoctorSearchCatalog.tsx'], "Doctor search catalog synthesized");
  assert.ok(files['src/components/sections/AppointmentBookingCalendar.tsx'], "Appointment booking calendar synthesized");
  assert.ok(files['src/components/sections/PatientHistoryTable.tsx'], "Patient history table synthesized");

  // 3. Verify Backend API Route Handlers
  assert.ok(files['src/app/api/doctors/route.ts'], "GET /api/doctors route handler synthesized");
  assert.ok(files['src/app/api/appointments/route.ts'], "POST /api/appointments route handler synthesized");

  // 4. Verify Requirement Contract Audit
  assert.ok(res.contractValidation, "Contract validation report exists");
  assert.strictEqual(res.contractValidation.isValid, true, "100% of requirement contract must pass");
  assert.ok(res.contractValidation.passRate === 100, "Requirement pass rate is 100%");
});

test('Semantic Architecture 2: E-Learning Platform with Quizzes and Progress', async (t) => {
  const prompt = "build an interactive online learning platform with curriculum courses, coding lessons, multiple choice quizzes, and student progress tracking";
  const oneshot = new OneShotEngine();
  const res = await oneshot.generateWebsite(prompt);

  const files = res.buildResult.files;

  // 1. Verify Domain Types & Data Models
  assert.ok(files['src/types/index.ts'].includes('export interface Course'), "Course interface defined");
  assert.ok(files['src/types/index.ts'].includes('export interface Quiz'), "Quiz interface defined");

  // 2. Verify Domain UI Views
  assert.ok(files['src/components/sections/CourseCatalog.tsx'], "Course catalog synthesized");
  assert.ok(files['src/components/sections/LessonViewer.tsx'], "Lesson viewer workspace synthesized");
  assert.ok(files['src/components/sections/QuizRunner.tsx'], "Interactive quiz runner synthesized");
  assert.ok(files['src/components/sections/ProgressTracker.tsx'], "Progress tracker dashboard synthesized");

  // 3. Verify Backend APIs
  assert.ok(files['src/app/api/courses/route.ts'], "/api/courses endpoint synthesized");
  assert.ok(files['src/app/api/quizzes/submit/route.ts'], "/api/quizzes/submit endpoint synthesized");

  // 4. Verify Requirement Contract
  assert.strictEqual(res.contractValidation.isValid, true, "All e-learning requirements verified");
});

test('Semantic Architecture 3: Real-Time Strategy & Multiplayer Chess Arena', async (t) => {
  const prompt = "create a real-time multiplayer chess platform with interactive game board, algebraic move log, and matchmaking lobby";
  const oneshot = new OneShotEngine();
  const res = await oneshot.generateWebsite(prompt);

  const files = res.buildResult.files;

  // 1. Verify Game Entities & State Models
  assert.ok(files['src/types/index.ts'].includes('export interface GameRoom'), "GameRoom interface defined");
  assert.ok(files['src/types/index.ts'].includes('export interface MoveRecord'), "MoveRecord interface defined");

  // 2. Verify Interactive Game Components
  assert.ok(files['src/components/sections/ChessBoardView.tsx'], "Chess board view synthesized");
  assert.ok(files['src/components/sections/MatchmakingLobby.tsx'], "Matchmaking lobby synthesized");

  // 3. Verify Route Handlers
  assert.ok(files['src/app/api/games/route.ts'], "/api/games endpoint synthesized");
  assert.ok(files['src/app/api/moves/route.ts'], "/api/moves endpoint synthesized");

  assert.strictEqual(res.contractValidation.isValid, true, "Game requirements verified");
});

test('Semantic Architecture 4: E-Commerce Store with Cart & Multi-Step Checkout', async (t) => {
  const prompt = "create an online store for selling handcrafted white ash furniture with catalog filtering, slide-out cart drawer, and checkout payment";
  const oneshot = new OneShotEngine();
  const res = await oneshot.generateWebsite(prompt);

  const files = res.buildResult.files;

  // 1. Verify E-Commerce Types
  assert.ok(files['src/types/index.ts'].includes('export interface Product'), "Product interface defined");
  assert.ok(files['src/types/index.ts'].includes('export interface CartItem'), "CartItem interface defined");

  // 2. Verify Commerce Components
  assert.ok(files['src/components/sections/ProductGrid.tsx'], "Product grid synthesized");
  assert.ok(files['src/components/sections/CartDrawer.tsx'], "Cart drawer synthesized");
  assert.ok(files['src/components/sections/CheckoutModal.tsx'], "Checkout modal synthesized");

  // 3. Verify Commerce APIs
  assert.ok(files['src/app/api/products/route.ts'], "/api/products endpoint synthesized");
  assert.ok(files['src/app/api/cart/route.ts'], "/api/cart endpoint synthesized");
  assert.ok(files['src/app/api/checkout/route.ts'], "/api/checkout endpoint synthesized");

  assert.strictEqual(res.contractValidation.isValid, true, "Commerce requirements verified");
});

test('Semantic Architecture 5: Restaurant Table Reservation & Tasting Menu System', async (t) => {
  const prompt = "create a dining table reservation system for a botanical tasting menu restaurant where guests can select tables, party size, and dates";
  const oneshot = new OneShotEngine();
  const res = await oneshot.generateWebsite(prompt);

  const files = res.buildResult.files;

  // 1. Verify Dining Types
  assert.ok(files['src/types/index.ts'].includes('export interface Restaurant'), "Restaurant interface defined");
  assert.ok(files['src/types/index.ts'].includes('export interface DiningTable') || files['src/types/index.ts'].includes('export interface Reservation'), "Dining models defined");

  // 2. Verify Hospitality Views
  assert.ok(files['src/components/sections/TastingMenuShowcase.tsx'], "Tasting menu showcase synthesized");
  assert.ok(files['src/components/sections/TableReservationCalendar.tsx'], "Table reservation calendar synthesized");

  // 3. Verify APIs
  assert.ok(files['src/app/api/restaurants/route.ts'], "/api/restaurants endpoint synthesized");
  assert.ok(files['src/app/api/reservations/route.ts'], "/api/reservations endpoint synthesized");

  assert.strictEqual(res.contractValidation.isValid, true, "Restaurant requirements verified");
});
