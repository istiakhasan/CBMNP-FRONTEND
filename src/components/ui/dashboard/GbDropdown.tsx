import React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

// Define the props interface
interface GbDropdownProps {
  items: MenuProps["items"];
  children: React.ReactNode;
}

const GbDropdown: React.FC<GbDropdownProps> = ({ items, children }) => (
  <Dropdown
    overlayClassName="gb_dropdown_menu"
    menu={{ items }}
    trigger={["click"]}
  >
    <a onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  </Dropdown>
);

export default GbDropdown;
