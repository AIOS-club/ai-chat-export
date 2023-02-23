import YAML from "js-yaml";
export const exportYaml = () => {
  const obj = getChatObject();
  let yamlText = "";
  if (obj) {
    yamlText = YAML.dump(obj);
  }
  if (yamlText) {
    var blob = new Blob([yamlText], { type: "text/yaml" });
    var a = document.createElement("a");

    a.download = "chat.yaml";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/yaml", a.download, a.href].join(":");
    a.click();
  }

  return yamlText;
};

export const getChatObject = () => {
  const elements = document.querySelectorAll("[class*='min-h-[20px]']");
  if (elements.length <= 0) return;

  const defaultJson = {
    $schema: "Dialog",
    Dialog: {
      title: "chatGPT对话",
      characters: [
        {
          name: "questioner",
          avatar:
            "https://static.cleword.cn/uploads/e9937b29/7lF_laun5RonFfosfZH6K.png",
        },
        {
          name: "AI",
          avatar: "https://res.pandateacher.com/WDNS259R1677122357140.png",
        },
      ],
      contents: [],
    },
  };

  const contents = [];

  elements.forEach((ele) => {
    const firstChild = ele.firstChild;
    if (!firstChild) return;

    let contentObj = {
      Utterance: {
        name: "questioner",
        messages: [],
      },
    };

    if (firstChild.nodeType === Node.TEXT_NODE) {
      // 提问的对话
      contentObj.Utterance.messages.push(firstChild.textContent);
    } else if (firstChild.nodeType === Node.ELEMENT_NODE) {
      // 回答的对话
      contentObj.Utterance.name = "AI";
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
        contentObj.Utterance.messages.push(message);
      });
    }

    contents.push(contentObj);
  });

  defaultJson.Dialog.contents = contents;
  return defaultJson;
};
