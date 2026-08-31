"use client";
import CustomTree from "@/components/ui/CustomTree";
import { useGetAllPermissionLabelQuery } from "@/redux/api/permission.Api";
import { useCreateUserPermissionMutation } from "@/redux/api/userPermission";
import { message, Spin, Tag, Divider } from "antd";
import React, { useState } from "react";

type SelectedUser = {
  userId: string;
  name?: string;
  email?: string;
};

type Props = {
  selectedUsers: SelectedUser[];
  onClose: () => void;
};

const AssignUserPermission = ({ selectedUsers, onClose }: Props) => {
  const { data, isLoading } = useGetAllPermissionLabelQuery(undefined);
  const [createUserPermission, { isLoading: submitting }] = useCreateUserPermissionMutation();
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const handleSubmit = async () => {
    try {
      const permissionIds = checkedKeys?.filter((item: any) => typeof item !== "string");

      if (!selectedUsers?.length) {
        return message.error("No users selected");
      }
      if (permissionIds?.length < 1) {
        return message.error("Please select at least one permission");
      }

      const payload = selectedUsers.flatMap((user) =>
        permissionIds.map((permissionId: any) => ({
          userId: user.userId,
          permissionId,
        }))
      );

      const res = await createUserPermission(payload).unwrap();
      if (res?.success) {
        message.success(res?.message || "Permissions assigned successfully");
        // Reload — same pattern as the single-user permission page,
        // keeps table selection/cache state consistent after a bulk write.
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to assign permissions");
    }
  };

  const loading = isLoading;

  return (
    <div className="flex flex-col p-[16px]">
      <div className="pb-3">
        <p className="text-[16px] font-semibold m-0">Assign Permission</p>
        <p className="text-[12px] text-gray-500 m-0 mt-1">
          Selected permissions will be added on top of each user is existing access.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3 max-h-[70px] overflow-y-auto">
        {selectedUsers.map((user) => (
          <Tag key={user.userId} className="!m-0 !text-[12px] !py-[2px]">
            {user.name || user.userId}
          </Tag>
        ))}
      </div>

      <Divider className="!my-2" />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spin size="large" tip="Loading permissions..." />
        </div>
      ) : (
        <div className="flex justify-center max-h-[380px] overflow-y-auto py-2">
          <CustomTree
            treeData={data?.data}
            checkedKeys={checkedKeys}
            setCheckedKeys={setCheckedKeys}
          />
        </div>
      )}

      <Divider className="!my-2" />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[12px] text-gray-500">
          {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="border text-[12px] font-bold px-[20px] py-[6px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="bg-[#4F8A6D] text-[#fff] font-bold text-[12px] px-[20px] py-[6px] disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && <Spin size="small" />}
            {submitting ? "Assigning..." : "Assign Permission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserPermission;