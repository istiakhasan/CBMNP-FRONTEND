import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { toast } from "react-toastify";

interface MenuState {
  toggle: boolean;
}

const initialState: MenuState = {
 toggle:false
};



export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleSidebar: (state,{payload}:PayloadAction<{show:boolean}>) => {
      state.toggle= payload?.show
    },
  },
});

export const {
  toggleSidebar
} = menuSlice.actions;

export default menuSlice.reducer;