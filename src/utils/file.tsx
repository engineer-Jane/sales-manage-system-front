import { message, Modal } from "antd";
import axios from 'axios';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { default as ReactPlayer } from 'react-player';
import PreviewPhoto from "@/components/PreviewPhoto";
import { baseUrl } from '@/utils/request';
import { isMockApiEnabled } from '@/utils/mockApiClient';
import { getLocalData } from '@/utils';

/** xlsx 为 ZIP 结构，文件头 PK；旧版 xls 为 OLE */
function isExcelBinaryBlob(blob: Blob): Promise<boolean> {
  if (blob.size < 2) return Promise.resolve(false);
  return blob.slice(0, 4).arrayBuffer().then((buf) => {
    const b = new Uint8Array(buf);
    const pkZip = b[0] === 0x50 && b[1] === 0x4b;
    const oleXls = b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;
    return pkZip || oleXls;
  });
}

function parseFilenameFromDisposition(cd: string | undefined): string | undefined {
  if (!cd) return undefined;
  try {
    const star = /filename\*=(?:UTF-8'')?([^;\n]+)/i.exec(cd);
    if (star?.[1]) {
      return decodeURIComponent(star[1].trim().replace(/^["']|["']$/g, ''));
    }
    const fn = /filename\s*=\s*"?([^";\n]+)"?/i.exec(cd);
    if (fn?.[1]) return decodeURIComponent(fn[1].trim());
  } catch {
    return undefined;
  }
  return undefined;
}

/** 服务端异常时常返回 JSON/HTML，被当成 blob 保存后 Excel 会乱码或打不开 */
function pickExcelBlobType(contentType: string | undefined): string {
  const raw = (contentType || '').split(';')[0].trim().toLowerCase();
  if (
    raw.includes('spreadsheetml') ||
    raw.includes('ms-excel') ||
    raw.includes('excel') ||
    raw === 'application/vnd.ms-excel'
  ) {
    return raw || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

/**
 * 导出 Excel（二进制流）
 * 修复：鉴权头、JSON/HTML 错误体识别、Blob MIME（勿对二进制加 charset）、文件名、清理临时 DOM
 */
export const downloadExcel = (method?: string, action?: string, data?: Record<string, unknown>) => {
  if (!action || typeof action !== 'string') {
    message.error('导出地址无效');
    return;
  }

  if (isMockApiEnabled()) {
    message.warning('当前为 Mock / 演示部署，不发起真实导出请求；连接后端后可正常使用导出');
    return;
  }

  const token = getLocalData('token');
  const authorization = typeof token === 'string' && token ? token : '';

  axios({
    method: (method || 'POST').toLowerCase(),
    url: `${baseUrl}${action}`,
    data: data ?? {},
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, */*',
      authorization,
    },
    responseType: 'blob',
    withCredentials: true,
    timeout: 120000,
  })
    .then(async (res) => {
      const blob: Blob = res.data;
      if (!blob || blob.size === 0) {
        message.error('导出失败：文件为空');
        return;
      }

      const ct = (res.headers['content-type'] || res.headers['Content-Type']) as string | undefined;
      if (ct && ct.includes('application/json')) {
        const text = await blob.text();
        try {
          const json = JSON.parse(text) as { msg?: string; message?: string; code?: number };
          message.error(json.msg || json.message || '导出失败');
        } catch {
          message.error('导出失败');
        }
        return;
      }

      const looksExcel = await isExcelBinaryBlob(blob);
      if (!looksExcel) {
        const text = await blob.text();
        const trimmed = text.trimStart();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            const json = JSON.parse(text) as { msg?: string; message?: string; code?: number };
            message.error(json.msg || json.message || '导出失败');
            return;
          } catch {
            message.error('导出失败：响应不是有效的表格文件');
            return;
          }
        }
        if (trimmed.startsWith('<')) {
          message.error('导出失败：服务端返回了网页而非文件（请检查登录或接口地址）');
          return;
        }
        message.error('导出失败：无法识别文件格式');
        return;
      }

      const disposition = (res.headers['content-disposition'] || res.headers['Content-Disposition']) as
        | string
        | undefined;
      let filename =
        parseFilenameFromDisposition(disposition) ||
        `导出明细_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`;

      if (!/\.(xlsx|xls)$/i.test(filename)) {
        filename += '.xlsx';
      }

      const blobType = pickExcelBlobType(ct);
      const fileBlob = new Blob([blob], { type: blobType });
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(() => {
      message.error('导出失败！');
    });
};

export const handleDownload = async (fileUrl: string, fileName: string, fileId?: string) => {
  // if (!fileName && fileId) {
  //   const res = await FileApi.getFileInfo({ fileId })
  //   fileName = res.data.data.fileName
  // }
  if (!fileUrl || !fileName) return;
  const elemIF = document.createElement('a');
  elemIF.href = fileUrl;
  elemIF.target = '_black';
  elemIF.download = decodeURIComponent(fileName);
  elemIF.style.display = true;
  window.document.body.appendChild(elemIF);
  elemIF.click();
};

export const viewOrDownload = async (fileUrl: string, fileName: string, fileId?: string) => {
  const fileWordList = ['docx', 'xlsx', 'dotx', 'xlsb', 'xls', 'pptx'];
  const fileImgList = ['jpeg', 'jpg', 'png', 'bmp', 'ico'];
  const fileViodList = ['mp4'];
  // if (!fileName && fileId) {
  //   const res = await FileApi.getFileInfo({ fileId })
  //   fileName = res.data.data.fileName
  // }
  const strInx = fileName.lastIndexOf('.');
  const suffix = fileName.substring(strInx + 1, fileName.length).toLowerCase();
  console.log('suffix------', suffix);

  if (suffix === 'pdf') {
    return Modal.confirm({
      title: fileName,
      width: 1000,
      okText: '下载',
      onOk: () => handleDownload(fileUrl, fileName, fileId),
      icon: <LegacyIcon type={'none'} />,
      centered: true,
      cancelText: '关闭',
      content: (
        <div>
          <iframe
            style={{ height: '720px', width: '100%' }}
            id="pdf-iframe"
            // src={`https://preview.xintech.cn/view/url?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`}
            src={`/widgets/generic/web/pdf-viewer.html?file=${encodeURIComponent(fileUrl)}`}
            // src={`https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`}
            name="pdf"
            className="pdf-iframe"
            title="pdfRead"
            target="_black"
          />
        </div>
      ),
    });
  }

  if (fileWordList.indexOf(suffix) > -1) {
    return Modal.confirm({
      title: fileName,
      width: 1000,
      okText: '下载',
      onOk: () => handleDownload(fileUrl, fileName),
      icon: <LegacyIcon type={'none'} />,
      centered: true,
      cancelText: '关闭',
      content: (
        <div>
          <iframe
            style={{ height: '720px', width: '100%' }}
            // src={`https://preview.xintech.cn/view/url?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`}
            src={`/widgets/generic/web/pdf-viewer.html?file=${encodeURIComponent(fileUrl)}`}
            // src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
            className="pdf-iframe"
            title="pdfRead"
          />
        </div>
      ),
    });
  }

  if (fileImgList.indexOf(suffix) > -1) {
    console.log(fileName, 'name')
    return Modal.confirm({
      title: fileName,
      width: 900,
      okText: '下载',
      onOk: () => handleDownload(fileUrl, fileName),
      centered: true,
      icon: <LegacyIcon type={'none'} />,
      cancelText: '关闭',
      content: (
        <div style={{ textAlign: 'center', width: '100%', height: '658px', border: '1px solid #ddd', overflow: 'hidden' }}>
          <PreviewPhoto fileUrl={fileUrl} fileName={fileName} />
        </div>
      ),
    });
  }

  if (fileViodList.indexOf(suffix) > -1) {
    return Modal.confirm({
      title: fileName,
      width: 564,
      okText: '下载',
      onOk: () => handleDownload(fileUrl, fileName),
      centered: true,
      icon: <LegacyIcon type={'none'} />,
      cancelText: '关闭',
      content: (
        <div style={{ textAlign: 'center' }}>
          <ReactPlayer
            url={[
              {
                src: fileUrl,
                type: 'video/webm',
              },
            ]}
            width="500px"
            height="500px"
            playing
            controls
          />
        </div>
      ),
    });
  }

  handleDownload(fileUrl, fileName);
};

/**
 * @param file 点击上传的返回的file
 * @param fileName 上传成功后返回的文件名
 * @param fileUrl 上传成功后返回的下载url
 */
export const verifyPreviewFile = (file: any, fileName: string, fileUrl: string) => {
  if (file && !file.url) {
    message.warning('先确认暂存，然后预览!');
  } else if (file && file.url) {
    return viewOrDownload(file.url, file.name);
  } else {
    return viewOrDownload(fileUrl, fileName);
  }
};

/** 组装文件数据 */
export const resetFile = (info: any, key: string) => {
  let obj = {};
  if (info && Object.keys(info).length > 0) {
    let url = info[key];
    if (url) {
      let urlArr = url.split('/');
      let name = urlArr.pop();
      obj = {
        uid: '-1',
        status: 'done',
        url,
        name
      }
    }
  }

  return obj;
}