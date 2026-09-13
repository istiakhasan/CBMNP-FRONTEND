import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const hrPayrollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ================= DEPARTMENTS & DESIGNATIONS =================
    getDepartments: build.query({
      query: () => ({ url: "/hr-payroll/departments", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createDepartment: build.mutation({
      query: (data) => ({ url: "/hr-payroll/departments", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateDepartment: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/departments/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteDepartment: build.mutation({
      query: (id) => ({ url: `/hr-payroll/departments/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    getDesignations: build.query({
      query: () => ({ url: "/hr-payroll/designations", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createDesignation: build.mutation({
      query: (data) => ({ url: "/hr-payroll/designations", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateDesignation: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/designations/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteDesignation: build.mutation({
      query: (id) => ({ url: `/hr-payroll/designations/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= BIOMETRIC DEVICES & PUNCH LOGS =================
    getBiometricDevices: build.query({
      query: () => ({ url: "/hr-payroll/biometric/devices", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    registerBiometricDevice: build.mutation({
      query: (data) => ({ url: "/hr-payroll/biometric/devices", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateBiometricDevice: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/biometric/devices/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    regenerateDeviceKey: build.mutation({
      query: (id) => ({ url: `/hr-payroll/biometric/devices/${id}/regenerate-key`, method: "PATCH" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteBiometricDevice: build.mutation({
      query: (id) => ({ url: `/hr-payroll/biometric/devices/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    syncBiometricPunch: build.mutation({
      query: (data) => ({ url: "/hr-payroll/biometric/sync", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getBiometricPunchLogs: build.query({
      query: (params) => ({ url: "/hr-payroll/biometric/logs", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= WORK SHIFTS & HOLIDAYS =================
    getShifts: build.query({
      query: () => ({ url: "/hr-payroll/shifts", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createShift: build.mutation({
      query: (data) => ({ url: "/hr-payroll/shifts", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getHolidays: build.query({
      query: () => ({ url: "/hr-payroll/holidays", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createHoliday: build.mutation({
      query: (data) => ({ url: "/hr-payroll/holidays", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteHoliday: build.mutation({
      query: (id) => ({ url: `/hr-payroll/holidays/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= EMPLOYEES =================
    getEmployees: build.query({
      query: (params) => ({ url: "/hr-payroll/employees", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    getEmployeeById: build.query({
      query: (id) => ({ url: `/hr-payroll/employees/${id}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createEmployee: build.mutation({
      query: (data) => ({ url: "/hr-payroll/employees", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateEmployee: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/employees/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteEmployee: build.mutation({
      query: (id) => ({ url: `/hr-payroll/employees/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= ATTENDANCE =================
    clockIn: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/clock-in", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    clockOut: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/clock-out", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    manualAttendanceEntry: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/manual-entry", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getAttendance: build.query({
      query: (params) => ({ url: "/hr-payroll/attendance", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    getAttendanceSummary: build.query({
      query: (params) => ({ url: "/hr-payroll/attendance/summary", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= LEAVES =================
    getLeaveTypes: build.query({
      query: () => ({ url: "/hr-payroll/leaves/types", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createLeaveType: build.mutation({
      query: (data) => ({ url: "/hr-payroll/leaves/types", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    applyLeave: build.mutation({
      query: (data) => ({ url: "/hr-payroll/leaves/apply", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    approveLeave: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/leaves/${id}/approve`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getLeaveRequests: build.query({
      query: (params) => ({ url: "/hr-payroll/leaves/requests", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    getLeaveBalances: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/leaves/balances/${employeeId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= LOANS & ADVANCE SALARY =================
    getLoans: build.query({
      query: (params) => ({ url: "/hr-payroll/loans", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    requestLoan: build.mutation({
      query: (data) => ({ url: "/hr-payroll/loans", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateLoanStatus: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/loans/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= EXPENSE CLAIMS =================
    getExpenseClaims: build.query({
      query: (params) => ({ url: "/hr-payroll/expenses", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    submitExpenseClaim: build.mutation({
      query: (data) => ({ url: "/hr-payroll/expenses", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    approveExpenseClaim: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/expenses/${id}/approve`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= RECRUITMENT & ATS =================
    getJobOpenings: build.query({
      query: () => ({ url: "/hr-payroll/recruitment/jobs", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createJobOpening: build.mutation({
      query: (data) => ({ url: "/hr-payroll/recruitment/jobs", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getJobApplications: build.query({
      query: (params) => ({ url: "/hr-payroll/recruitment/applications", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    applyForJob: build.mutation({
      query: (data) => ({ url: "/hr-payroll/recruitment/applications", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateApplicationStage: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/recruitment/applications/${id}/stage`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    convertCandidateToEmployee: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/recruitment/applications/${id}/hire`, method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= ASSETS =================
    getAssets: build.query({
      query: (params) => ({ url: "/hr-payroll/assets", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    assignAsset: build.mutation({
      query: (data) => ({ url: "/hr-payroll/assets", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateAssetStatus: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/assets/${id}/status`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= DOCUMENTS & PROMOTIONS =================
    getEmployeeDocuments: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/documents/${employeeId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    uploadDocument: build.mutation({
      query: (data) => ({ url: "/hr-payroll/documents", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    recordPromotion: build.mutation({
      query: (data) => ({ url: "/hr-payroll/promotions", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= OFFBOARDING & CLEARANCES =================
    getClearances: build.query({
      query: () => ({ url: "/hr-payroll/clearance", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    submitResignation: build.mutation({
      query: (data) => ({ url: "/hr-payroll/clearance/submit", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateClearance: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/clearance/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= PAYROLL =================
    getPayrollSheets: build.query({
      query: () => ({ url: "/hr-payroll/payroll", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    generatePayroll: build.mutation({
      query: (data) => ({ url: "/hr-payroll/payroll/generate", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    disbursePayroll: build.mutation({
      query: (id) => ({ url: `/hr-payroll/payroll/${id}/disburse`, method: "PATCH" }),
      invalidatesTags: [tagTypes.hrPayroll, tagTypes.accounting, tagTypes.finance],
    }),
    setSalaryStructure: build.mutation({
      query: (data) => ({ url: "/hr-payroll/payroll/structure", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getSalaryStructure: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/payroll/structure/${employeeId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    getPayslip: build.query({
      query: (itemId) => ({ url: `/hr-payroll/payroll/payslip/${itemId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= COMMISSIONS & TARGETS =================
    getCommissionRules: build.query({
      query: () => ({ url: "/hr-payroll/commissions/rules", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createCommissionRule: build.mutation({
      query: (data) => ({ url: "/hr-payroll/commissions/rules", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getCommissions: build.query({
      query: () => ({ url: "/hr-payroll/commissions", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    getSalesTargets: build.query({
      query: () => ({ url: "/hr-payroll/targets", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    setSalesTarget: build.mutation({
      query: (data) => ({ url: "/hr-payroll/targets", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= SHIFT UPDATE / DELETE =================
    updateShift: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/shifts/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteShift: build.mutation({
      query: (id) => ({ url: `/hr-payroll/shifts/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= HOLIDAY UPDATE =================
    updateHoliday: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/holidays/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= DASHBOARD =================
    getHrDashboard: build.query({
      query: () => ({ url: "/hr-payroll/dashboard", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= EMPLOYEE TIMELINE =================
    getEmployeeTimeline: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/employees/${employeeId}/timeline`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    recordTimelineEvent: build.mutation({
      query: ({ employeeId, ...data }) => ({ url: `/hr-payroll/employees/${employeeId}/timeline`, method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= SALARY HISTORY =================
    getSalaryHistory: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/salary-history/${employeeId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    addSalaryRevision: build.mutation({
      query: (data) => ({ url: "/hr-payroll/salary-history", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= ATTENDANCE CORRECTIONS =================
    submitAttendanceCorrection: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/corrections", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getAttendanceCorrections: build.query({
      query: (params) => ({ url: "/hr-payroll/attendance/corrections", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    approveAttendanceCorrection: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/attendance/corrections/${id}/approve`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= OVERTIME =================
    submitOvertimeRequest: build.mutation({
      query: (data) => ({ url: "/hr-payroll/overtime", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getOvertimeRequests: build.query({
      query: (params) => ({ url: "/hr-payroll/overtime", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    approveOvertimeRequest: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/overtime/${id}/approve`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= TRANSFERS =================
    recordTransfer: build.mutation({
      query: (data) => ({ url: "/hr-payroll/transfers", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getTransfers: build.query({
      query: (params) => ({ url: "/hr-payroll/transfers", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    approveTransfer: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/transfers/${id}/approve`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= PERFORMANCE REVIEWS =================
    createPerformanceReview: build.mutation({
      query: (data) => ({ url: "/hr-payroll/performance-reviews", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getPerformanceReviews: build.query({
      query: (params) => ({ url: "/hr-payroll/performance-reviews", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    updatePerformanceReview: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/performance-reviews/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= TRAINING =================
    createTrainingProgram: build.mutation({
      query: (data) => ({ url: "/hr-payroll/training", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getTrainingPrograms: build.query({
      query: () => ({ url: "/hr-payroll/training", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    updateTrainingProgram: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/training/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    enrollInTraining: build.mutation({
      query: (data) => ({ url: "/hr-payroll/training/enroll", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    updateEnrollment: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/training/enrollments/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getEnrollmentsByEmployee: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/training/enrollments/${employeeId}`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= DISCIPLINARY ACTIONS =================
    createDisciplinaryAction: build.mutation({
      query: (data) => ({ url: "/hr-payroll/disciplinary", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getDisciplinaryActions: build.query({
      query: (params) => ({ url: "/hr-payroll/disciplinary", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),
    updateDisciplinaryAction: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/disciplinary/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= ANNOUNCEMENTS =================
    createAnnouncement: build.mutation({
      query: (data) => ({ url: "/hr-payroll/announcements", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getAnnouncements: build.query({
      query: () => ({ url: "/hr-payroll/announcements", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    updateAnnouncement: build.mutation({
      query: ({ id, ...data }) => ({ url: `/hr-payroll/announcements/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    deleteAnnouncement: build.mutation({
      query: (id) => ({ url: `/hr-payroll/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // ================= LOAN REPAYMENTS =================
    recordLoanRepayment: build.mutation({
      query: ({ loanId, ...data }) => ({ url: `/hr-payroll/loans/${loanId}/repayments`, method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getLoanRepayments: build.query({
      query: (loanId) => ({ url: `/hr-payroll/loans/${loanId}/repayments`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= FINAL SETTLEMENT =================
    getFinalSettlement: build.query({
      query: (employeeId) => ({ url: `/hr-payroll/employees/${employeeId}/final-settlement`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= REPORTS =================
    getHrReport: build.query({
      query: (params) => ({ url: "/hr-payroll/reports", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= LEAVE CALENDAR =================
    getLeaveCalendar: build.query({
      query: (params) => ({ url: "/hr-payroll/leave-calendar", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // ================= PAYROLL SHEET ITEMS =================
    getPayrollSheetItems: build.query({
      query: (sheetId) => ({ url: `/hr-payroll/payroll-sheets/${sheetId}/items`, method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
  }),
});


export const {
  // Departments & Designations
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,

  // Biometrics & Shifts & Holidays
  useGetBiometricDevicesQuery,
  useRegisterBiometricDeviceMutation,
  useUpdateBiometricDeviceMutation,
  useRegenerateDeviceKeyMutation,
  useDeleteBiometricDeviceMutation,
  useSyncBiometricPunchMutation,
  useGetBiometricPunchLogsQuery,
  useGetShiftsQuery,
  useCreateShiftMutation,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,

  // Employees
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,

  // Attendance & Leaves
  useClockInMutation,
  useClockOutMutation,
  useManualAttendanceEntryMutation,
  useGetAttendanceQuery,
  useGetAttendanceSummaryQuery,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useApplyLeaveMutation,
  useApproveLeaveMutation,
  useGetLeaveRequestsQuery,
  useGetLeaveBalancesQuery,

  // Loans & Expenses
  useGetLoansQuery,
  useRequestLoanMutation,
  useUpdateLoanStatusMutation,
  useGetExpenseClaimsQuery,
  useSubmitExpenseClaimMutation,
  useApproveExpenseClaimMutation,

  // Recruitment & ATS
  useGetJobOpeningsQuery,
  useCreateJobOpeningMutation,
  useGetJobApplicationsQuery,
  useApplyForJobMutation,
  useUpdateApplicationStageMutation,
  useConvertCandidateToEmployeeMutation,

  // Assets & Documents & Promotions & Clearances
  useGetAssetsQuery,
  useAssignAssetMutation,
  useUpdateAssetStatusMutation,
  useGetEmployeeDocumentsQuery,
  useUploadDocumentMutation,
  useRecordPromotionMutation,
  useGetClearancesQuery,
  useSubmitResignationMutation,
  useUpdateClearanceMutation,

  // Payroll & Commissions & Targets
  useGetPayrollSheetsQuery,
  useGeneratePayrollMutation,
  useDisbursePayrollMutation,
  useSetSalaryStructureMutation,
  useGetSalaryStructureQuery,
  useGetPayslipQuery,
  useGetCommissionRulesQuery,
  useCreateCommissionRuleMutation,
  useGetCommissionsQuery,
  useGetSalesTargetsQuery,
  useSetSalesTargetMutation,

  // Shift & Holiday CRUD
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useUpdateHolidayMutation,

  // Dashboard
  useGetHrDashboardQuery,

  // Employee Timeline
  useGetEmployeeTimelineQuery,
  useRecordTimelineEventMutation,

  // Salary History
  useGetSalaryHistoryQuery,
  useAddSalaryRevisionMutation,

  // Attendance Corrections
  useSubmitAttendanceCorrectionMutation,
  useGetAttendanceCorrectionsQuery,
  useApproveAttendanceCorrectionMutation,

  // Overtime
  useSubmitOvertimeRequestMutation,
  useGetOvertimeRequestsQuery,
  useApproveOvertimeRequestMutation,

  // Transfers
  useRecordTransferMutation,
  useGetTransfersQuery,
  useApproveTransferMutation,

  // Performance Reviews
  useCreatePerformanceReviewMutation,
  useGetPerformanceReviewsQuery,
  useUpdatePerformanceReviewMutation,

  // Training
  useCreateTrainingProgramMutation,
  useGetTrainingProgramsQuery,
  useUpdateTrainingProgramMutation,
  useEnrollInTrainingMutation,
  useUpdateEnrollmentMutation,
  useGetEnrollmentsByEmployeeQuery,

  // Disciplinary
  useCreateDisciplinaryActionMutation,
  useGetDisciplinaryActionsQuery,
  useUpdateDisciplinaryActionMutation,

  // Announcements
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,

  // Loan Repayments
  useRecordLoanRepaymentMutation,
  useGetLoanRepaymentsQuery,

  // Final Settlement
  useGetFinalSettlementQuery,

  // Reports & Calendar
  useGetHrReportQuery,
  useGetLeaveCalendarQuery,
  useGetPayrollSheetItemsQuery,
} = hrPayrollApi;

