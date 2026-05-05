import React, { useState, useEffect } from 'react';
import { Button, message, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { fileUrl } from '@/utils/request';
import { getBase64 } from '@/utils';
import { verifyPreviewFile } from '@/utils/file';
import type { UploadProps } from 'antd';

type FileUploadProps = {
  /** 已有列表 */
  defaultList: any[];
  /** 上传列表的内建样式 */
  listType: 'text' | 'picture' | 'picture-card';
  /** 限制上传数量 */
  maxCount?: number | 1;
  /** 文件上传回调 */
  onChange: (val: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { defaultList, listType, maxCount, onChange } = props;
  const [fileList, setFileList] = useState<any[]>([]);  //  存放上传文件的列表
  const [isFirst, setIsFirst] = useState<number>(1);


  useEffect(() => {
    if (isFirst === 1 && defaultList.length > 0 && defaultList[0]?.url) {
      setIsFirst(2);
      setFileList(defaultList);
    }
  }, [defaultList, isFirst])

  const handleChange = (files: any) => {
    console.log(files)
    // 采取受控写法:在最后一次log里面有response
    // 最终会有3次的打印机制
    if (files.fileList.length > 0) {
      let formatList = files.file;
      if (files.file.response) {
        formatList = {
          // ...files.file.response.data,
          url: files.file.response.data?.fileUrl,
          name: files.file.response.data?.fileName
        }
      }

      setFileList([formatList]);
      if (onChange) {
        onChange(formatList);
      }
    } else {
      setFileList([]);
      if (onChange) {
        onChange({});
      }
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.url = await getBase64(file.originFileObj as RcFile);
    }
    verifyPreviewFile(file, file?.url, file?.name);
  };

  const uploadButton = () => {
    return <>
      {listType === 'text' ?
        <Button icon={<UploadOutlined />}>上传</Button>
        :
        <div style={{ marginTop: 8 }}>
          <PlusOutlined />
        </div>
      }
    </>
  };


  const uploadProps: UploadProps = {
    name: 'file',
    action: `${fileUrl}/api/common/uploadToLocal`,
    headers: {
      authorization: 'authorization-text',
    },
    listType,
    maxCount: 1,
    fileList: fileList,
    // onChange(info) {
    //   if (info.file.status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (info.file.status === 'done') {
    //     message.success(`${info.file.name} file uploaded successfully`);
    //   } else if (info.file.status === 'error') {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
    onChange: handleChange,
    onPreview: handlePreview,
  };

  return (
    <>
      <Upload {...uploadProps}>
        {uploadButton()}
      </Upload>
    </>
  )
}

export default FileUpload;