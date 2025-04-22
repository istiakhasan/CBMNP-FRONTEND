import React from "react";
import { Dropdown, message } from "antd";
import type { MenuProps } from "antd";

// Define the props interface
interface GbDropdownProps {
  items: MenuProps["items"];
  children: React.ReactNode;
}

const GbDropdown= ({ items, children,state=true }:any) => (
  <Dropdown
    overlayClassName="gb_dropdown_menu"
    menu={{ items }}
    trigger={["click"]}
    onOpenChange={(visible) => {
      if (visible && !state) {
        message.error("Please select a warehouse");
      }
    }}
    open={!!state ? undefined : false}
  >
    <a onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  </Dropdown>
);

export default GbDropdown;
