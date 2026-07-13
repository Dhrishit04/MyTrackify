// --- Student ---
export interface Student {
  id: number;
  email: string;
  collegeId: string;
  graduationYear: number;
  branch: string;
  cgpaRange: string;
  anonymizedId: string;
  leetcodeCount: number;
  leetcodeEasy: number;
  leetcodeMedium: number;
  leetcodeHard: number;
  contestRating: number | null;
  skillVector: number[]; // [DP, Graphs, Trees, Arrays, Strings]
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
}

export interface StudentProfile extends Student {
  totalApplications: number;
  offersReceived: number;
  successRate: number;
  sectorsApplied: string[];
  lastApplicationDate: string | null;
  role?: 'STUDENT' | 'ADMIN' | 'TPO';
  // Admin RBAC fields (null when not an admin)
  isAdmin?: boolean;
  adminLevel?: AdminLevel;
  adminAccessLevel?: number;
  scope?: string;
  permissions?: string[];
}

// --- Admin RBAC ---
export type AdminLevel = 'SYSTEM_ADMIN' | 'DIRECTOR' | 'ASSOCIATE' | 'MODERATOR';

export interface AdminUserSummary {
  id: number;
  studentId: number;
  email: string;
  anonymizedId: string;
  level: AdminLevel;
  roleName: string;
  accessLevel: number;
  scope: string;
  department: string | null;
  isActive: boolean;
  assignedAt: string;
  revokedAt: string | null;
}

export interface AuditLogEntry {
  id: number;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: number | null;
  changeReason: string | null;
  endpoint: string | null;
  httpMethod: string | null;
  createdAt: string;
}

export interface AssignRoleRequest {
  level: AdminLevel;
  scope: string;
  department?: string;
}

export interface RevokeRoleRequest {
  reason: string;
}

export interface FlagExperienceRequest {
  reason: string;
}

export interface RevisionRequest {
  note: string;
}

export interface NotificationRequest {
  recipientGroup: string;
  message: string;
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalCompanies: number;
  totalExperiences: number;
  totalApplications: number;
  activeUsers: number;
  pendingVerifications: number;
  totalAdmins: number;
}

// --- Company ---
export interface Company {
  id: number;
  name: string;
  sector: string; // 'Product' | 'Service' | 'Trading' | 'Consulting'
  headquartersLocation: string;
  website: string;
  visitFrequency: string;
  typicalRoles: string[];
  avgCtcRange: string;
  totalApplications: number;
  totalOffers: number;
  avgSuccessRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyWithProcess extends Company {
  currentProcess: InterviewProcess | null;
  recentExperiences: InterviewExperience[];
}

// --- Interview Process ---
export interface InterviewProcess {
  id: number;
  companyId: number;
  academicYear: string;
  semester: string;
  rounds: ProcessRound[];
  verifiedCount: number;
  lastVerifiedAt: string | null;
  isCurrent: boolean;
}

export interface ProcessRound {
  roundNumber: number;
  roundType: string;
  topics: string[];
  durationMinutes: number;
  avgEliminationRate: number;
}

// --- Application Journey ---
export interface ApplicationJourney {
  id: number;
  studentId: number;
  processId: number;
  applicationType: 'On-Campus' | 'Off-Campus';
  applicationDate: string;
  finalOutcome: 'Selected' | 'Rejected' | 'In Progress' | 'Withdrew';
  finalRoundReached: number | null;
  compensationOffered: number | null;
  roleOffered: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined data
  companyName?: string;
  companySector?: string;
}

// --- Round Attempt ---
export interface RoundAttempt {
  id: number;
  journeyId: number;
  roundNumber: number;
  roundType: string;
  outcome: 'Passed' | 'Failed' | 'Pending';
  difficultyPerceived: number; // 1-5
  attemptedAt: string | null;
  resultReceivedAt: string | null;
  createdAt: string;
}

// --- Interview Experience ---
export interface InterviewExperience {
  id: number;
  attemptId: number;
  questionsAsked: string;
  topics: string[];
  interviewerFocus: string;
  preparationTips: string;
  difficultyRating: number; // 1-5
  helpfulCount: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined data
  studentAnonymizedId?: string;
  roundNumber?: number;
  roundType?: string;
  companyName?: string;
  outcome?: string;
}

// --- Analytics ---
export interface ReadinessAnalysis {
  company: string;
  companyId: number;
  similarStudentsCount: number;
  similarStudentsSuccessRate: number;
  overallSuccessRate: number;
  yourStrengths: SkillAssessment[];
  focusAreas: SkillGap[];
  timeline: TimelineAssessment;
}

export interface SkillAssessment {
  topic: string;
  yourScore: number;
  targetScore: number;
  status: 'STRONG' | 'ADEQUATE' | 'WEAK';
}

export interface SkillGap {
  topic: string;
  yourScore: number;
  targetScore: number;
  gap: number;
  recommendation: string;
  prevalence: string;
}

export interface TimelineAssessment {
  avgPrepWeeks: number;
  companyVisitInWeeks: number;
  status: 'COMFORTABLE' | 'MODERATE' | 'TIGHT';
}

export interface RoundStats {
  roundNumber: number;
  roundType: string;
  totalAttempts: number;
  passedCount: number;
  failedCount: number;
  eliminationRate: number;
  avgDifficulty: number;
}

export interface DashboardStats {
  totalApplications: number;
  totalOffers: number;
  successRate: number;
  companiesExplored: number;
  experiencesLogged: number;
  recentActivity: ActivityItem[];
  applicationsByMonth: ChartDataPoint[];
  outcomeDistribution: ChartDataPoint[];
}

export interface ActivityItem {
  id: number;
  type: 'application' | 'experience' | 'offer';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

// --- API ---
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  collegeId: string;
  graduationYear: number;
  branch: string;
  cgpaRange: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType?: string;
  user: StudentProfile;
}

// --- Log Experience ---
export interface LogExperienceRequest {
  companyId: number;
  applicationType: 'On-Campus' | 'Off-Campus';
  applicationDate: string;
  finalOutcome: 'Selected' | 'Rejected' | 'In Progress' | 'Withdrew';
  rounds: LogRoundData[];
}

export interface LogRoundData {
  roundNumber: number;
  roundType: string;
  outcome: 'Passed' | 'Failed' | 'Pending';
  difficulty: number;
  questionsAsked: string;
  topics: string[];
  preparationTips: string;
}

// --- Auth Context ---
export interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
  hasPermission: (permission: string) => boolean;
  login: (credentials: LoginRequest) => Promise<StudentProfile>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

// --- Filters ---
export interface CompanyFilters {
  search: string;
  sector: string;
  sortBy: 'name' | 'successRate' | 'totalApplications' | 'avgCtc';
  sortOrder: 'asc' | 'desc';
}
