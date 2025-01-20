"use client"
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useFormContext } from 'react-hook-form';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface GbFileUploadProps {
  name: string;
  defaultValue?: object[];
}

const GbFileUpload: React.FC<GbFileUploadProps> = ({ name,defaultValue }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { setValue,formState:{errors},watch } = useFormContext();
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      return Upload.LIST_IGNORE;
    }

    const isLt1M = file.size / 3072 / 3072 < 1;
    if (!isLt1M) {
      message.error('Image must be smaller than 3MB!');
      return Upload.LIST_IGNORE;
    }

    return isJpgOrPng && isLt1M;
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList.length > 6) {
      message.error('You can only upload up to 6 images!');
      return;
    }
    setFileList(newFileList);

    // Set the value in React Hook Form
    setValue(name, newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
    </button>
  );

  useEffect(()=>{
    if(defaultValue){
      setFileList(defaultValue?.map((item:any,i:any)=>{
        return {
          uid: i,
          name: `image-${i}`,
          status: 'done',
          url: item?.url,
        }
      }))
    }
  },[defaultValue])

  return (
    <>
     {!!errors[name] &&  <p className='text-red-500'><small>Please select  an image</small></p>}
      <Upload 
        className='custom_upload'
        action="/api/file"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        style={{
          border: '1px solid red',
          borderRadius: '0',
        }}
      >
        {fileList?.length >= 6 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image 
          alt=''
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default GbFileUpload;
