import { message } from "antd";

const copyToClipboard = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber);
    message.config({
      top: window.innerHeight - 90,
    });
    message.success('coppied..');
  };

  export default copyToClipboard