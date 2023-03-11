import { getQuestionerAvatarUrl } from "./utils";

const getChatJson = () => {
  const elements = document.querySelectorAll("[class*='min-h-[20px]']");
  if (elements.length <= 0) return;

  const questionerAvatar = getQuestionerAvatarUrl();
  const id = "chat#";

  const defaultJson = {
    $kind: "Dialog",
    $id: id,
    title: "chatGPT对话",
    characters: [
      {
        name: "questioner",
        direction: "right",
        avatar: questionerAvatar || "https://res.pandateacher.com/1O2BGDK91671292227563.jpg",
      },
      {
        name: "AI",
        avatar: "https://res.pandateacher.com/WDNS259R1677122357140.png",
      },
    ],
    contents: [],
  };

  let contents = [];

  elements.forEach((ele, index) => {
    let firstChild = ele;
    // 处理官方页面和aigcfun页面结构不同的情况
    if (window.location.host == "chat.openai.com") {
      firstChild = ele.firstChild as HTMLElement;
    }

    if (!firstChild) return;

    let contentObj = {
      $kind: "Utterance",
      name: "questioner",
      $id: `${id}content[${index}]`,
      messages: [],
    };

    if (index % 2 === 0) {
      // 提问的对话
      contentObj.messages.push(firstChild.innerHTML || firstChild.textContent);
    } else {
      // 回答的对话
      contentObj.name = "AI";
      firstChild.childNodes.forEach((child: Element) => {
        const tag = child.tagName;
        let message: string = child.outerHTML;
        // 针对代码做特殊处理
        if (tag === "PRE") {
          let code = child.querySelector("code");
          // hack 获取代码语言
          const language =
            Array.from(code.classList)
              .find((item) => item.startsWith("language-"))
              ?.replace("language-", "") || "";
          const text = code?.textContent || "";
          const codeText = "```" + language + "\n" + text + "```";

          message = codeText;
        }
        contentObj.messages.push(message);
      });
    }

    contents.push(contentObj);
  });

  const endContents = [
    {
      $kind: "CourseFinished",
      $id: `${id}content[${contents.length}]`,
      value: null,
    },
    {
      $kind: "End",
      $id: `${id}content[${contents.length + 1}]`,
      value: null,
    },
  ];
  contents = [...contents, ...endContents];
  defaultJson.contents = contents;
  return { main: defaultJson };
};

export const exportJson = () => {
  const obj = getChatJson();
  if (obj) {
    const blob = new Blob([JSON.stringify(obj)], { type: "text/plain" });
    const a = document.createElement("a");

    a.download = "chat.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
    a.click();
  }

  return obj;
};
