import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const hrPayrollApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Departments & Designations
    getDepartments: build.query({
      query: () => ({ url: "/hr-payroll/departments", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createDepartment: build.mutation({
      query: (data) => ({ url: "/hr-payroll/departments", method: "POST", data }),
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

    // Employees
    getEmployees: build.query({
      query: () => ({ url: "/hr-payroll/employees", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),
    createEmployee: build.mutation({
      query: (data) => ({ url: "/hr-payroll/employees", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),

    // Attendance
    clockIn: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/clock-in", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    clockOut: build.mutation({
      query: (data) => ({ url: "/hr-payroll/attendance/clock-out", method: "POST", data }),
      invalidatesTags: [tagTypes.hrPayroll],
    }),
    getAttendance: build.query({
      query: (params) => ({ url: "/hr-payroll/attendance", method: "GET", params }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // Leaves
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
      query: () => ({ url: "/hr-payroll/leaves/requests", method: "GET" }),
      providesTags: [tagTypes.hrPayroll],
    }),

    // Payroll
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

    // Commissions & Targets
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
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceQuery,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useApplyLeaveMutation,
  useApproveLeaveMutation,
  useGetLeaveRequestsQuery,
  useGetPayrollSheetsQuery,
  useGeneratePayrollMutation,
  useDisbursePayrollMutation,
  useSetSalaryStructureMutation,
  useGetCommissionRulesQuery,
  useCreateCommissionRuleMutation,
  useGetCommissionsQuery,
  useGetSalesTargetsQuery,
  useSetSalesTargetMutation,
} = hrPayrollApi;
