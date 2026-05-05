import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { fileUrl } from '@/utils/request';
import { getBase64 } from '@/utils';
import { verifyPreviewFile } from '@/utils/file';
import type { UploadProps } from 'antd';

type FileUploadProps = {
  /** 已有列表 */
  defaultList?: any[];
  /** 上传列表的内建样式 */
  listType: 'text' | 'picture' | 'picture-card';
  /** 限制上传数量 */
  maxCount?: number | 1;
  /** 文件上传回调 */
  onChange: (val: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { defaultList, listType, onChange } = props;
  const [fileList, setFileList] = useState(defaultList || []);  //  存放上传文件的列表
  const maxCount = 1;

  const onUploadChange = (files: any) => {
    console.log(files)
    // 采取受控写法:在最后一次log里面有response
    // 最终会有3次的打印机制
    // const formatList = files.fileList.map((file: any) => {
    //   // 上传完毕做数据处理
    //   if (file.response) {
    //     return {
    //       ...file.response.data,
    //       url: file.response.data?.fileUrl,
    //       name: file.response.data?.fileName
    //     }
    //   }
    //   // 否则不做处理
    //   return file
    // })
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
  }

  const onRemove = (file: any) => {
    // const index = fileList.indexOf(file);
    // console.log('index----', index)
    // const newFileList = fileList.slice();
    // newFileList.splice(index, 1);
    // console.log('newFileList----', newFileList)
    // setFileList(newFileList);
    // if (onChange) {
    //   onChange(newFileList);
    // }
    setFileList([]);
  }

  const handlePreview = async (file: UploadFile) => {
    console.log('handlePreview-----', file);
    if (!file.url && !file.preview) {
      file.url = await getBase64(file.originFileObj as RcFile);
    }
    verifyPreviewFile(file, file?.url, file?.name);

    // setPreviewImage(file.url || (file.preview as string));
    // setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
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
    action: `${fileUrl}/api/common/uploadToLocal`,
    onChange: (files: any) => {
      console.log(files)
      // 采取受控写法:在最后一次log里面有response
      // 最终会有3次的打印机制
      // const formatList = files.fileList.map((file: any) => {
      //   // 上传完毕做数据处理
      //   if (file.response) {
      //     return {
      //       ...file.response.data,
      //       url: file.response.data?.fileUrl,
      //       name: file.response.data?.fileName
      //     }
      //   }
      //   // 否则不做处理
      //   return file
      // })
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
    },
    onPreview: async (file: UploadFile) => {
      console.log('handlePreview-----', file);
      if (!file.url && !file.preview) {
        file.url = await getBase64(file.originFileObj as RcFile);
      }
      verifyPreviewFile(file, file?.url, file?.name);
    },
    // onRemove: file => {
    //   const index = fileList.indexOf(file);
    //   console.log('index----', index)
    //   const newFileList = fileList.slice();
    //   newFileList.splice(index, 1);
    //   console.log('newFileList----', newFileList)
    //   setFileList(newFileList);
    //   if (onChange) {
    //     onChange(newFileList);
    //   }
    // },
    defaultFileList: defaultList,
    fileList,
    maxCount
  };

  return (
    <>
      <Upload
        // {...uploadProps}
        listType={listType}
        className='sales-upload'
        showUploadList
        action={`${fileUrl}/api/common/uploadToLocal`}
        onChange={onUploadChange}
        onPreview={handlePreview}
        onRemove={onRemove}
        // defaultFileList={defaultList}
        fileList={fileList}
        maxCount={maxCount}
      >
        {fileList.length >= maxCount ? null : uploadButton()}
      </Upload>
    </>
  )
}

export default FileUpload;