import html2canvas from "html2canvas";
import jsPDF from "jspdf";


/** 
 * 打印预览 效果 
 * printId 打印区域id
 * btnDivId 按钮父元素id
**/
export const Previewpdf = async (printId: string, btnDivId: string) => {
  const btnDom = document.getElementById(btnDivId); // 按钮父元素
  btnDom.style.display = "none";

  const dom = document.querySelector(`#${printId}`); // 打印元素
  let copyDom = dom.cloneNode(true);
  copyDom.style.height = "auto";
  document.body.appendChild(copyDom);

  /* const [lWidth, rWidth] = [20, 20];
  const pageWidth = 595.28 - lWidth - rWidth // A4纸的宽高 减去左右边距
  const pageHeight = 841.89 */
  // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  await html2canvas(copyDom, {
    logging: false,
    width: dom?.scrollWidth,
    height: dom?.scrollHeight,
    windowWidth: dom?.scrollWidth,
    windowHeight: dom?.scrollHeight
  }).then(function (canvas) {
    // 判断浏览器内核是否是IE
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      alert('截图打印暂不支持IE内核浏览器，请更换火狐或谷歌chrome内核浏览器，360等双核浏览器请切换至极速模式');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4'); // A4纸，纵向
    const ctx = canvas.getContext('2d');
    const a4w = 190;
    const a4h = 277; // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
    const imgHeight = Math.floor(a4h * canvas.width / a4w); // 按A4显示比例换算一页图像的像素高度
    let renderedHeight = 0;

    while (renderedHeight < canvas.height) {
      const page = document.createElement("canvas");
      page.width = canvas.width;
      page.height = Math.min(imgHeight, canvas.height - renderedHeight); // 可能内容不足一页

      // 用getImageData剪裁指定区域，并画到前面建立的canvas对象中
      page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight,
        canvas.height - renderedHeight)), 0, 0);
      pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height /
        page.width)); // 添加图像到页面，保留10mm边距

      renderedHeight += imgHeight;
      if (renderedHeight < canvas.height) { pdf.addPage(); } // 若是后面还有内容，添加一个空页
      page.remove();
    }
    const link = window.URL.createObjectURL(pdf.output('blob'));
    window.open(link);
    document.body.removeChild(copyDom);
  })

  setTimeout(() => {
    btnDom.style.display = "flex";
  }, 2000)
}

/** 
 * 打印预览 效果 
 * printId 打印区域id
 * btnDivId 按钮父元素id
 * name 导出pdf文件名
**/
export const ExportPdf = (printId: string, btnDivId: string, name: string) => {
  const downPdf = document.querySelector(`#${printId}`); // 打印元素
  const btnDom = document.getElementById(btnDivId); // 按钮父元素

  btnDom.style.display = "none";

  html2canvas(downPdf, {
    allowTaint: true,
    height: downPdf.scrollHeight
  }).then((canvas: any) => {   // 通过promise返回canvas元素
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = contentWidth / 592.28 * 841.89  // 每页高度：a4纸的尺寸
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 590.28  // 图片宽度
    let imgHeight = 592.28 / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0) // 保存canvas图像
    // 参数：方向（l：横向，p：纵向）| 测量单位（"pt"，"mm", "cm", "m", "in" or "px"）| 格式（默认a4，也可通过大小数组[595.28, 841.89]）
    let PDF = new jsPDF('p', 'pt', 'a4')
    // 按照a4规格分页操作
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage() // 添加页
        }
      }
    }
    PDF.save(`${name}.pdf`) // 保存pdf文档，本地下载pdf文件
  });

  setTimeout(() => {
    btnDom.style.display = "flex";
  }, 2000)
}