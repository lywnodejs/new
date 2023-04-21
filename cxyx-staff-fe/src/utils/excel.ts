import XLSX from 'xlsx';
import { WritingOptions } from 'xlsx';

// 将workbook装化成blob对象
function workbook2blob(workbook) {
  // 生成excel的配置项
  const wopts: WritingOptions = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  };
  const wbout = XLSX.write(workbook, wopts);
  // 将字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  });
  return blob;
}

// 将blob对象创建bloburl，然后用a标签实现弹出下载框
export function openDownloadDialog(blob, fileName) {
  if (typeof blob == 'object' && blob instanceof Blob) {
    blob = URL.createObjectURL(blob); // 创建blob地址
  }
  const aLink = document.createElement('a');
  aLink.href = blob;
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || '';
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  //   移动端
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

function exportExcel(data: { [key: string]: string | number }[], fileName: string) {
  const sheet1 = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet1);
  const workbookBlob = workbook2blob(wb);
  // 导出最后的总表
  openDownloadDialog(workbookBlob, `${fileName}.xlsx`);
}

/**
 * 读取并解析excel, 并返回json格式
 * 现在只支持读取一个文件
 * @param file
 */
export const parseExcel = file => {
  return new Promise((resolve, reject) => {
    if (!file) return reject();
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = e => {
      const { target } = e;
      const data = target && target.result;
      try {
        const workbox = XLSX.read(data, {
          type: 'binary',
        });
        const sheetName = workbox.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbox.Sheets[sheetName]);
        resolve(sheetData);
      } catch (e) {
        reject(e);
      }
    };
  });
};
export default exportExcel;
