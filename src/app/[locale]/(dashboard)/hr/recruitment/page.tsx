"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Tabs,
  Rate,
  Divider,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetJobOpeningsQuery,
  useCreateJobOpeningMutation,
  useGetJobApplicationsQuery,
  useApplyForJobMutation,
  useUpdateApplicationStageMutation,
  useConvertCandidateToEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { TabPane } = Tabs;

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState("candidates");

  // Modals
  const [jobModal, setJobModal] = useState(false);
  const [candidateModal, setCandidateModal] = useState(false);
  const [hireModal, setHireModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Forms
  const [jobForm] = Form.useForm();
  const [candidateForm] = Form.useForm();
  const [hireForm] = Form.useForm();

  // Queries
  const { data: jobsData, isLoading: jobsLoading, refetch: refetchJobs } = useGetJobOpeningsQuery(undefined);
  const { data: appsData, isLoading: appsLoading, refetch: refetchApps } = useGetJobApplicationsQuery(undefined);
  const { data: deptData } = useGetDepartmentsQuery(undefined);
  const { data: desigData } = useGetDesignationsQuery(undefined);

  // Mutations
  const [createJob, { isLoading: isCreatingJob }] = useCreateJobOpeningMutation();
  const [applyJob, { isLoading: isApplyingJob }] = useApplyForJobMutation();
  const [updateStage] = useUpdateApplicationStageMutation();
  const [hireCandidate, { isLoading: isHiring }] = useConvertCandidateToEmployeeMutation();

  const jobs = jobsData?.data || [];
  const applications = appsData?.data || [];
  const departments = deptData?.data || [];
  const designations = desigData?.data || [];

  const handleCreateJob = async (values: any) => {
    try {
      await createJob(values).unwrap();
      message.success("Job opening published successfully");
      setJobModal(false);
      jobForm.resetFields();
      refetchJobs();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to publish job");
    }
  };

  const handleAddCandidate = async (values: any) => {
    try {
      await applyJob(values).unwrap();
      message.success("Candidate application recorded");
      setCandidateModal(false);
      candidateForm.resetFields();
      refetchApps();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to add candidate");
    }
  };

  const handleStageChange = async (id: string, stage: string) => {
    try {
      await updateStage({ id, stage }).unwrap();
      message.success(`Candidate moved to ${stage}`);
      refetchApps();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update stage");
    }
  };

  const handleOpenHire = (candidate: any) => {
    setSelectedCandidate(candidate);
    hireForm.setFieldsValue({
      employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      biometricUserId: `${Math.floor(1000 + Math.random() * 9000)}`,
      basicSalary: candidate.expectedSalary || 30000,
      joiningDate: dayjs().format("YYYY-MM-DD"),
    });
    setHireModal(true);
  };

  const handleHireSubmit = async (values: any) => {
    try {
      await hireCandidate({
        id: selectedCandidate.id,
        ...values,
      }).unwrap();
      message.success("Candidate successfully hired and added to Employee Directory!");
      setHireModal(false);
      hireForm.resetFields();
      refetchApps();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to hire candidate");
    }
  };

  const candidateColumns: any = [
    {
      title: "Candidate",
      dataIndex: "candidateName",
      key: "candidateName",
      render: (name: string, r: any) => (
        <div>
          <span className="font-bold text-gray-900 block text-sm">{name}</span>
          <span className="text-xs text-gray-400 font-mono">
            {r.candidatePhone} • {r.candidateEmail}
          </span>
        </div>
      ),
    },
    {
      title: "Applied Position",
      dataIndex: ["jobOpening", "title"],
      key: "job",
      render: (t: string) => <Tag color="blue">{t || "General Opening"}</Tag>,
    },
    {
      title: "Expected Salary",
      dataIndex: "expectedSalary",
      key: "expectedSalary",
      render: (amt: number) => (
        <span className="font-semibold text-gray-800">৳{Number(amt || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Hiring Stage",
      dataIndex: "stage",
      key: "stage",
      render: (st: string, record: any) => (
        <Select
          value={st}
          size="small"
          onChange={(val) => handleStageChange(record.id, val)}
          className="w-32"
          disabled={st === "Hired"}
        >
          <Option value="Applied">Applied</Option>
          <Option value="Screening">Screening</Option>
          <Option value="Interview">Interview</Option>
          <Option value="Offered">Offered</Option>
          <Option value="Hired">Hired</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.stage !== "Hired" ? (
            <Button
              size="small"
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => handleOpenHire(record)}
              className="bg-emerald-600 hover:bg-emerald-700 text-xs"
            >
              Hire to Staff
            </Button>
          ) : (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Active Staff
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  const jobColumns: any = [
    {
      title: "Job Title",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <span className="font-bold text-gray-900">{t}</span>,
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "dept",
      render: (d: string) => <Tag color="blue">{d || "General"}</Tag>,
    },
    {
      title: "Vacancies",
      dataIndex: "vacanciesCount",
      key: "vacanciesCount",
      align: "center" as const,
      render: (c: number) => <span className="font-bold text-emerald-700">{c || 1}</span>,
    },
    {
      title: "Experience",
      dataIndex: "experienceRequired",
      key: "exp",
      render: (e: string) => <span className="text-xs">{e || "Not specified"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Published" ? "green" : "default"}>{st}</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Recruitment Hub & Candidate Pipeline (ATS)" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Open Job Vacancies</span>}
              value={jobs.filter((j: any) => j.status === "Published").length}
              prefix={<SolutionOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Active Applicants</span>}
              value={applications.length}
              prefix={<UsergroupAddOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Hired Candidates</span>}
              value={applications.filter((a: any) => a.stage === "Hired").length}
              prefix={<CheckCircleOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Interview Stage</span>}
              value={applications.filter((a: any) => a.stage === "Interview").length}
              prefix={<AuditOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          {/* TAB 1: CANDIDATES */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <UsergroupAddOutlined className="text-purple-600" />
                Applicant Pipeline ({applications.length})
              </span>
            }
            key="candidates"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Applicants & Hiring Workflow</span>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => refetchApps()}>
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCandidateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 border-none"
                  >
                    Add Candidate
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={applications}
                rowKey="id"
                columns={candidateColumns}
                loading={appsLoading}
                pagination={{ pageSize: 10 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>

          {/* TAB 2: JOB OPENINGS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <SolutionOutlined className="text-blue-600" />
                Job Openings ({jobs.length})
              </span>
            }
            key="jobs"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Active Job Postings</span>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => refetchJobs()}>
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setJobModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 border-none"
                  >
                    Publish Job Opening
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={jobs}
                rowKey="id"
                columns={jobColumns}
                loading={jobsLoading}
                pagination={{ pageSize: 10 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* MODAL 1: ADD CANDIDATE */}
      <Modal
        title="Add Job Applicant / Candidate"
        open={candidateModal}
        onCancel={() => setCandidateModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={candidateForm} layout="vertical" onFinish={handleAddCandidate}>
          <Form.Item
            name="jobOpeningId"
            label="Applied Job Opening"
            rules={[{ required: true, message: "Please select position" }]}
          >
            <Select placeholder="Select job position">
              {jobs.map((j: any) => (
                <Option key={j.id} value={j.id}>
                  {j.title} ({j.department?.name || "General"})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="candidateName"
            label="Candidate Full Name"
            rules={[{ required: true, message: "Please enter candidate name" }]}
          >
            <Input placeholder="e.g. Shakib Al Hasan" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="candidatePhone"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="017XXXXXXXX" />
            </Form.Item>

            <Form.Item
              name="candidateEmail"
              label="Email Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="candidate@gmail.com" />
            </Form.Item>
          </div>

          <Form.Item name="expectedSalary" label="Expected Monthly Salary (BDT ৳)" initialValue={35000}>
            <InputNumber min={0} className="w-full font-bold" prefix="৳" />
          </Form.Item>

          <Form.Item name="resumeUrl" label="Resume / CV Portfolio Link">
            <Input placeholder="https://drive.google.com/..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setCandidateModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isApplyingJob}
              className="bg-purple-600 hover:bg-purple-700 border-none"
            >
              Save Candidate
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: 1-CLICK CONVERT CANDIDATE TO EMPLOYEE */}
      <Modal
        title="1-Click Onboard Candidate to Employee Directory"
        open={hireModal}
        onCancel={() => setHireModal(false)}
        footer={null}
        destroyOnClose
      >
        {selectedCandidate && (
          <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs">
            <span className="text-gray-500">Candidate: </span>
            <span className="font-bold text-emerald-900">{selectedCandidate.candidateName}</span>
            <span className="text-gray-500 block mt-0.5">
              Position: {selectedCandidate.jobOpening?.title}
            </span>
          </div>
        )}

        <Form form={hireForm} layout="vertical" onFinish={handleHireSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="employeeCode"
              label="Assign Employee Code"
              rules={[{ required: true }]}
            >
              <Input className="font-mono" />
            </Form.Item>

            <Form.Item
              name="biometricUserId"
              label="Biometric Machine User ID"
              rules={[{ required: true }]}
            >
              <Input className="font-mono border-emerald-300" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="basicSalary" label="Agreed Basic Salary (BDT)" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full font-bold text-emerald-700" prefix="৳" />
            </Form.Item>

            <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
              <Input type="date" className="w-full" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setHireModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isHiring}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Confirm Hiring & Add to Staff
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 3: PUBLISH JOB */}
      <Modal
        title="Publish Job Vacancy"
        open={jobModal}
        onCancel={() => setJobModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={jobForm} layout="vertical" onFinish={handleCreateJob}>
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="e.g. Senior Backend Engineer" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="departmentId" label="Department">
              <Select placeholder="Select department">
                {departments.map((d: any) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="designationId" label="Designation">
              <Select placeholder="Select designation">
                {designations.map((d: any) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="vacanciesCount" label="Vacancies Count" initialValue={1}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="experienceRequired" label="Experience Required">
              <Input placeholder="e.g. 2-4 years" />
            </Form.Item>
          </div>

          <Form.Item name="jobDescription" label="Job Description">
            <Input.TextArea rows={3} placeholder="Key responsibilities and qualifications..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setJobModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 border-none">
              Publish Job
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
