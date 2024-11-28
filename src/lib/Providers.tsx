"use client";
import { Suspense } from 'react'; 
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import StyledComponentsRegistry from "./AntdRegistry";
import { ConfigProvider } from 'antd';
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {/* <Suspense fallback={<h1>Loading</h1>}> */}
      <StyledComponentsRegistry>
        <ConfigProvider 
        theme={{
          token:{
            colorPrimary: '#288EA5',
            colorBgBase:"#ffffff"
          }
        }}
        >
          {children}
        </ConfigProvider>
        </StyledComponentsRegistry>
      {/* </Suspense> */}
    </Provider>
  );
};

export default Providers;