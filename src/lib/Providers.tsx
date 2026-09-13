"use client";
import { Suspense } from 'react'; 
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import StyledComponentsRegistry from "./AntdRegistry";
import { ThemeProvider } from "@/context/ThemeContext";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {/* <Suspense fallback={<h1>Loading</h1>}> */}
      <StyledComponentsRegistry>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        </StyledComponentsRegistry>
      {/* </Suspense> */}
    </Provider>
  );
};

export default Providers;
