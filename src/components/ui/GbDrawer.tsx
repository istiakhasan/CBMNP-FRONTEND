import React from "react";
import { Divider, Drawer } from "antd";

const GbDrawer = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: any;
  setOpen: any;
}) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        placement={"right"}
        width={500}
        style={{padding:0}}
        onClose={onClose}
        closable={false}
        open={open}
      >
        <div className="flex justify-between items-center sticky top-0 z-20 bg-white py-4">
          <h1 className="text-[24px] text-[#00171d] ">Add Product</h1>
          <i
            onClick={onClose}
            style={{ fontSize: "20px" }}
            className="ri-close-large-line cursor-pointer"
          ></i>
        </div>
        <Divider />
        {children}
      </Drawer>
    </>
  );
};

export default GbDrawer;
