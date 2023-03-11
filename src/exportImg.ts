// 导出为图片
const getBase64Image = (img: HTMLImageElement) => {
  if (!img || !img?.width) return;
  img.setAttribute("crossOrigin", "anonymous");
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  // get context
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
};
const getAvataHtml = (html: string) => {
  return `<div style="width: 30px;height: 30px;border-radius: 0.125rem;">${html}</div>`;
};

const triggerDownload = (imgURI: string) => {
  var a = document.createElement("a");
  a.setAttribute("download", "chatgpt.png");
  a.setAttribute("href", imgURI);
  a.setAttribute("target", "_blank");
  a.click();
};

const getAvatars = () => {
  const avatarList = document.querySelectorAll(
    "[class*='w-[30px] flex flex-col relative items-end']"
  );
  const qDom = avatarList[avatarList.length - 2];
  const aDom = avatarList[avatarList.length - 1];

  const qImg = Array.from(qDom.querySelectorAll("img")).find((item) =>
    item.currentSrc.startsWith("https")
  );
  const aImag = aDom.querySelector("svg")?.innerHTML;

  const questioner = getAvataHtml(
    `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="41" height="41" viewBox="0 0 41 41" enable-background="new 0 0 41 41" xml:space="preserve">  <image id="image0" width="41" height="41" x="0" y="0"
    href="${getBase64Image(qImg)}" />
</svg>`
  );
  const ai = getAvataHtml(
    `<svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" style="width:1.5rem;height:1.5erm">${aImag}</svg>`
  );

  return {
    questioner,
    ai,
  };
};

export const exportImg = () => {
  const elements = document.querySelectorAll("[class*='min-h-[20px]']");
  if (elements.length <= 0) return;

  const { questioner, ai } = getAvatars();

  function divWrapper(child) {
    return `<div style="line-height: 1.5em; margin-bottom: 0.85em">${child}</div>`;
  }

  // canvas config
  const canvasWidth = 1600;

  let imageContent = "";
  const contentBg = "#fff";
  const responseBg = "#f7f7f8";

  const promptStartDiv = `<div style="background: ${contentBg}; padding: 24px 0;display: flex;">${questioner}`;
  const responseStartDiv = `<div style="background: ${responseBg}; padding: 24px 0;display: flex;">${ai}`;

  elements.forEach((ele, index) => {
    const isPromp = index % 2 == 0;
    const firstChild = ele.firstChild;
    if (!firstChild) return;

    if (isPromp) {
      // 提问的对话
      imageContent += promptStartDiv;
    } else {
      // 回答的对话
      imageContent += responseStartDiv;
    }

    imageContent += divWrapper(ele.outerHTML);
    imageContent += `</div>`;
  });

  // create canvas
  var canvas = document.createElement("canvas");

  // create content
  var content = promptStartDiv + "</div>";

  // get size of contents
  var sizingDiv = document.createElement("div");
  sizingDiv.id = "sizing-div";
  sizingDiv.style.width = canvasWidth / 2 + "px";
  sizingDiv.innerHTML = content.trim();
  document.body.appendChild(sizingDiv);
  var sizingDivHeight = sizingDiv.offsetHeight * 2;

  // remove sizing div
  sizingDiv.remove();

  // compile
  var timestamp = new Date(
    new Date(new Date(new Date()).toISOString()).getTime() -
      new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  var xmlDiv = document.createElement("div");
  xmlDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  xmlDiv.style.width = canvasWidth / 2 + "px";
  xmlDiv.style.fontFamily = "sans-serif";
  xmlDiv.style.fontSize = "16px";

  var headerDiv = document.createElement("div");
  headerDiv.innerText = timestamp;
  headerDiv.style.fontSize = "12px";
  headerDiv.style.paddingTop = "4px";
  headerDiv.style.paddingBottom = "2px";
  headerDiv.style.fontFamily = "monospace";
  headerDiv.style.textAlign = "center";
  headerDiv.style.color = "rgba(255,255,255,0.25)";

  var contentDiv = document.createElement("div");
  contentDiv.style.color = "#374151";
  contentDiv.style.fontWeight = "300";
  contentDiv.style.marginRight = "auto";
  contentDiv.style.marginLeft = "auto";
  contentDiv.appendChild(sizingDiv);

  var footerDiv = document.createElement("div");
  footerDiv.innerText = "Generated with ai-chatgpt-export";
  footerDiv.style.fontSize = "12px";
  footerDiv.style.paddingTop = "2px";
  footerDiv.style.paddingBottom = "4px";
  footerDiv.style.fontFamily = "monospace";
  footerDiv.style.textAlign = "center";
  footerDiv.style.color = "rgba(255,255,255,0.25)";

  // xmlDiv.appendChild(headerDiv);
  xmlDiv.appendChild(contentDiv);
  // xmlDiv.appendChild(footerDiv);

  var data = `<svg id="svg" xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}px" height="${sizingDivHeight}px">
  <foreignObject width="100%" height="100%">
  ${xmlDiv.outerHTML}
  </foreignObject>
  </svg>
  `;

  // canvas styles
  canvas.width = canvasWidth;
  canvas.height = sizingDivHeight;

  //get DPI
  let dpi = window.devicePixelRatio;

  // get context
  var ctx = canvas.getContext("2d");
  ctx.scale(dpi, dpi);

  // create image
  console.log(data);
  data = encodeURIComponent(data);

  var img = new Image();
  img.src = "data:image/svg+xml," + data;
  console.log(img);
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function (blob) {
      var newImg = document.createElement("img"),
        url = URL.createObjectURL(blob);

      newImg.onload = function () {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(url);
      };

      newImg.src = url;
      document.body.appendChild(newImg);

      // download image
      var imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      triggerDownload(imgURI);

      // remove image element
      newImg.remove();
    });
  };
};
