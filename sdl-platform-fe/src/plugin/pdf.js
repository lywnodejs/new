import html2Canvas from 'html2canvas';

import JsPDF from 'jspdf';
export default function getPdf(title, id) {
    let element = document.querySelector(`${id}`); // 这个dom元素是要导出pdf的div容器
    element.style.padding = '30px'

    // console.log(element.children[3].offsetHeight)
    setTimeout(() => {

      html2Canvas(element).then(function(canvas) {

        //   console.log(canvas)
        // let contentWidth = canvas.width;
        // let contentHeight = canvas.height;
        // console.log(contentWidth, contentHeight)

        // //  一页pdf显示html页面生成的canvas高度;
        // let pageHeight = (contentWidth / 592.28) * 841.89;
        // console.log(pageHeight)

        // //  未生成pdf的html页面高度
        // // let leftHeight = contentHeight;

        // //  页面偏移
        // // let position = 0;

        // //  a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        // // let imgWidth = 595.28;
        // let imgHeight = (592.28 / contentWidth) * contentHeight;
        // let pageData = canvas.toDataURL('image/jpeg', 1.0);
        // let pdf = new JsPDF('', 'pt', 'a4');
        // console.log(imgHeight)

        //  有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //  当内容未超过pdf一页显示的范围，无需分页

        // if (leftHeight < pageHeight) {
        //   pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        // } else {
        //   while (leftHeight > 0) {
        //     pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        //     leftHeight -= pageHeight;
        //     position -= 841.89;

        //     //  避免添加空白页
        //     if (leftHeight > 0) {
        //       pdf.addPage();
        //     }
        //   }
        // }

        const contentWidth = canvas.width
        const contentHeight = canvas.height

        // console.log(contentHeight)
        // if (canvas.height > 14400) {
        //   let dom = document.createElement('a');
        //   dom.href = canvas.toDataURL('image/png');
        //   dom.download = title + '.png';
        //   dom.click();
        //   return
        // }
        const pdf = new JsPDF('', 'pt', [contentWidth, contentHeight])
        const pageData = canvas.toDataURL('image/jpeg', 1.0)

        pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight)

        pdf.save(title + '.pdf');

        location.reload()
      });
    }, 0);
};
