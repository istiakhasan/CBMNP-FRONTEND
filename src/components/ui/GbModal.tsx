import React from 'react';
import {Modal } from 'antd';
interface GbModalProps {
  isModalOpen: boolean;
    //   setIsModalOpen: (isOpen: boolean) => void;
    openModal:()=>void;
    closeModal:()=>void;
    children:React.ReactNode;
    width?:string
    clseTab?:boolean
    centered?:boolean
    cls?:string
}
const GbModal: React.FC<GbModalProps> = ({ isModalOpen,openModal,closeModal,children,width,clseTab=true,centered=false,cls }) => {
  return (
    <>
      <Modal 
       okButtonProps={{ hidden:true }}
       cancelButtonProps={{ hidden: true }}
       width={width?width: 730}
       maskClosable={false} 
       closable={clseTab} 
       centered={centered}
       className={cls}
       open={isModalOpen} onOk={openModal} onCancel={closeModal}>
        {children}
      </Modal>
    </>
  );
};

export default GbModal;
