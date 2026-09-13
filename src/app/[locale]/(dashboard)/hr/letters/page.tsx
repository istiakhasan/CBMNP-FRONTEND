"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  message,
} from "antd";
import {
  CopyOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  PrinterOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetEmployeesQuery } from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { TextArea } = Input;

type LetterType = "appointment" | "joining" | "release" | "experience" | "custom";

const letterTypes: Array<{ value: LetterType; label: string; icon: React.ReactNode }> = [
  { value: "appointment", label: "Appointment Letter", icon: <FileProtectOutlined /> },
  { value: "joining", label: "Joining Letter", icon: <FileDoneOutlined /> },
  { value: "release", label: "Release Letter", icon: <UserSwitchOutlined /> },
  { value: "experience", label: "Experience Letter", icon: <FileTextOutlined /> },
  { value: "custom", label: "Other / Custom Letter", icon: <FileTextOutlined /> },
];

const clean = (value: any, fallback = "N/A") => value || fallback;

const formatDate = (value: any) => {
  if (!value) return "N/A";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD MMMM YYYY") : value;
};

const buildLetter = (type: LetterType, employee: any, values: any) => {
  const companyName = clean(values.companyName, "Ghorer Bazar");
  const employeeName = clean(employee?.fullName, "Selected Employee");
  const employeeCode = clean(employee?.employeeCode);
  const department = clean(employee?.department?.name, "General");
  const designation = clean(employee?.designation?.name, clean(values.designation, "Staff"));
  const joiningDate = formatDate(values.joiningDate || employee?.joiningDate);
  const issueDate = formatDate(values.issueDate || dayjs());
  const salary = Number(values.salary || employee?.basicSalary || 0).toLocaleString();
  const signerName = clean(values.signerName, "Authorized Signatory");
  const signerDesignation = clean(values.signerDesignation, "HR & Admin");
  const remarks = clean(values.remarks, "");

  const header = `${companyName}
${clean(values.companyAddress, "Corporate Office")}

Date: ${issueDate}

To,
${employeeName}
Employee ID: ${employeeCode}
Department: ${department}
Designation: ${designation}`;

  if (type === "appointment") {
    return `${header}

Subject: Appointment Letter

Dear ${employeeName},

We are pleased to appoint you as ${designation} in the ${department} department of ${companyName}, effective from ${joiningDate}.

Your monthly salary will be Tk ${salary}. Your employment will follow company policies, confidentiality requirements, attendance rules, and HR instructions.

Please report to HR on the joining date and submit all required onboarding documents.
${remarks ? `\n${remarks}\n` : ""}
Sincerely,


${signerName}
${signerDesignation}
${companyName}`;
  }

  if (type === "joining") {
    return `${header}

Subject: Joining Confirmation Letter

Dear ${employeeName},

This is to confirm that you have joined ${companyName} as ${designation} under the ${department} department from ${joiningDate}.

Your employee code is ${employeeCode}. Please follow company rules and complete any pending onboarding formalities with HR.
${remarks ? `\n${remarks}\n` : ""}
Sincerely,


${signerName}
${signerDesignation}
${companyName}`;
  }

  if (type === "release") {
    return `${header}

Subject: Release Letter

Dear ${employeeName},

This is to certify that you have been released from your position as ${designation} in the ${department} department of ${companyName}, effective from ${formatDate(values.effectiveDate)}.

Your handover and clearance formalities are subject to final verification by HR, accounts, and administration.
${remarks ? `\n${remarks}\n` : ""}
Sincerely,


${signerName}
${signerDesignation}
${companyName}`;
  }

  if (type === "experience") {
    return `${header}

Subject: Experience Letter

This is to certify that ${employeeName}, Employee ID ${employeeCode}, worked with ${companyName} as ${designation} in the ${department} department from ${joiningDate} to ${formatDate(values.effectiveDate || dayjs())}.

During this period, ${employeeName} performed assigned responsibilities and maintained professional conduct.
${remarks ? `\n${remarks}\n` : ""}
Sincerely,


${signerName}
${signerDesignation}
${companyName}`;
  }

  return `${header}

Subject: ${clean(values.subject, "Official Letter")}

Dear ${employeeName},

${clean(values.customBody, "Write the letter body here.")}
${remarks ? `\n${remarks}\n` : ""}
Sincerely,


${signerName}
${signerDesignation}
${companyName}`;
};

export default function HrLettersPage() {
  const [form] = Form.useForm();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>();
  const [letterType, setLetterType] = useState<LetterType>("appointment");
  const [letterBody, setLetterBody] = useState("");

  const { data, isLoading, refetch } = useGetEmployeesQuery(undefined);
  const employees = useMemo(() => data?.data || [], [data?.data]);
  const selectedEmployee = employees.find((emp: any) => emp.id === selectedEmployeeId);

  const stats = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((emp: any) => emp.status === "Active").length,
      probation: employees.filter((emp: any) => emp.status === "Probation").length,
    }),
    [employees]
  );

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp: any) => emp.id === employeeId);
    setSelectedEmployeeId(employeeId);
    form.setFieldsValue({
      designation: employee?.designation?.name,
      joiningDate: employee?.joiningDate ? dayjs(employee.joiningDate) : undefined,
      salary: employee?.basicSalary,
    });
  };

  const generateLetter = () => {
    if (!selectedEmployee) {
      message.warning("Please select an employee first");
      return;
    }

    setLetterBody(buildLetter(letterType, selectedEmployee, form.getFieldsValue()));
    message.success("Letter generated successfully");
  };

  const copyLetter = async () => {
    if (!letterBody) return;
    await navigator.clipboard.writeText(letterBody);
    message.success("Letter copied to clipboard");
  };

  const printLetter = () => {
    if (!letterBody) {
      message.warning("Generate a letter before printing");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      message.error("Popup blocked. Please allow popups and try again.");
      return;
    }

    const html = letterBody
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    printWindow.document.write(`
      <html>
        <head>
          <title>${letterTypes.find((item) => item.value === letterType)?.label}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 40px; }
            .page { max-width: 760px; margin: 0 auto; min-height: 980px; border: 1px solid #e5e7eb; padding: 56px; }
            .content { font-size: 14px; line-height: 1.8; }
            @media print { body { padding: 0; } .page { border: 0; min-height: auto; } }
          </style>
        </head>
        <body>
          <div class="page"><div class="content">${html}</div></div>
          <script>window.onload = function(){ window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Letter Generator" />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Total Employees" value={stats.total} prefix={<FileTextOutlined className="text-blue-600" />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Active Workforce" value={stats.active} prefix={<FileDoneOutlined className="text-emerald-600" />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Probation" value={stats.probation} prefix={<FileProtectOutlined className="text-amber-500" />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} lg={9}>
          <Card
            className="rounded-xl border border-gray-200 shadow-sm"
            title={<span className="font-semibold text-gray-800">Generate Letter</span>}
            extra={<Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button>}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                companyName: "Ghorer Bazar",
                companyAddress: "Corporate Office, Dhaka, Bangladesh",
                issueDate: dayjs(),
                signerName: "HR Manager",
                signerDesignation: "HR & Admin",
              }}
            >
              <Form.Item label="Letter Type" required>
                <Select value={letterType} onChange={setLetterType}>
                  {letterTypes.map((type) => (
                    <Option key={type.value} value={type.value}>
                      <span className="inline-flex items-center gap-2">{type.icon}{type.label}</span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Employee" required>
                <Select
                  showSearch
                  loading={isLoading}
                  value={selectedEmployeeId}
                  onChange={handleEmployeeChange}
                  placeholder="Search employee by name or code"
                  optionFilterProp="label"
                  options={employees.map((emp: any) => ({
                    label: `${emp.fullName} ${emp.employeeCode || ""}`,
                    value: emp.id,
                  }))}
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Form.Item name="issueDate" label="Issue Date">
                  <DatePicker className="w-full" format="DD MMM YYYY" />
                </Form.Item>
                <Form.Item name="joiningDate" label="Joining Date">
                  <DatePicker className="w-full" format="DD MMM YYYY" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Form.Item name="effectiveDate" label="Release / End Date">
                  <DatePicker className="w-full" format="DD MMM YYYY" />
                </Form.Item>
                <Form.Item name="salary" label="Salary">
                  <Input type="number" prefix="Tk" />
                </Form.Item>
              </div>

              <Form.Item name="subject" label="Custom Subject" hidden={letterType !== "custom"}>
                <Input placeholder="Official Letter" />
              </Form.Item>
              <Form.Item name="customBody" label="Custom Body" hidden={letterType !== "custom"}>
                <TextArea rows={5} placeholder="Write custom letter body..." />
              </Form.Item>

              <Divider className="my-4" />

              <Form.Item name="companyName" label="Company Name">
                <Input />
              </Form.Item>
              <Form.Item name="companyAddress" label="Company Address">
                <Input />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Form.Item name="signerName" label="Signer Name">
                  <Input />
                </Form.Item>
                <Form.Item name="signerDesignation" label="Signer Designation">
                  <Input />
                </Form.Item>
              </div>
              <Form.Item name="remarks" label="Additional Terms / Remarks">
                <TextArea rows={3} placeholder="Optional notes, clearance status, probation terms..." />
              </Form.Item>

              <Button type="primary" block icon={<FileDoneOutlined />} onClick={generateLetter} className="bg-emerald-600 hover:bg-emerald-700 border-none">
                Generate Letter
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={15}>
          <Card
            className="rounded-xl border border-gray-200 shadow-sm"
            title={
              <Space wrap>
                <span className="font-semibold text-gray-800">Letter Preview</span>
                <Tag color="blue">{letterTypes.find((item) => item.value === letterType)?.label}</Tag>
              </Space>
            }
            extra={
              <Space wrap>
                <Button icon={<CopyOutlined />} disabled={!letterBody} onClick={copyLetter}>Copy</Button>
                <Button type="primary" icon={<PrinterOutlined />} disabled={!letterBody} onClick={printLetter} className="bg-blue-600 hover:bg-blue-700 border-none">
                  Print / Save PDF
                </Button>
              </Space>
            }
          >
            {letterBody ? (
              <TextArea value={letterBody} onChange={(event) => setLetterBody(event.target.value)} rows={28} className="font-mono text-sm leading-7" />
            ) : (
              <div className="min-h-[560px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Empty description="Select an employee and generate a letter" />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
