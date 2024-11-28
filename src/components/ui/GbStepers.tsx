"use client";
import React, { useState } from "react";
import { Button, message, Steps, theme } from "antd";

const GbStepers = ({ steps }: { steps: any }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <div>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <div
            onClick={() => next()}
            className="cm_button w-fit px-[30px] cursor-pointer"
          >
            Next
          </div>
        )}
        {current === steps.length - 1 && (
          <button
            type="submit"
            className="cm_button w-fit px-[30px] cursor-pointer"
          >
            Done
          </button>
        //   <button
        //     onClick={() => {
        //       message.success("Processing complete!");
        //     }}
        //     className="cm_button w-fit px-[30px] cursor-pointer"
        //   >
        //     Done
        //   </button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default GbStepers;
