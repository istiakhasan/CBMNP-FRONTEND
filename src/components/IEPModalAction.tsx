import { ConfigProvider, Spin } from "antd";
interface GbModalActionsProps {
  onClose: () => void;
  submitLoading: boolean;
  closeText?: string;
  submitText?: string;
}

const IEPModalAction = ({
  onClose,
  submitLoading,
  closeText = "Close",
  submitText = "Create",
}:GbModalActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-5 pt-5">
      <button
        type="button"
        onClick={onClose}
        className="text-[#4F8A6D] border-[#4F8A6D] border-[1px] font-bold text-[12px] px-[20px] py-[5px]"
      >
        {closeText}
      </button>
      <button
        disabled={submitLoading}
        type="submit"
        className="bg-[#4F8A6D] w-[100px] text-white border-[rgba(0,0,0,.2)] border-[1px] font-bold px-[15px] py-[4px]"
      >
        {submitLoading ? (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "white", // Default primary color (used in Spin)
              },
            }}
          >
            <Spin />
          </ConfigProvider>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
};

export default IEPModalAction;
