const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const fetch = require("node-fetch");
const querystring = require("querystring");
const crypto = require("crypto");

const URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "easy-translate" is now active!'
  );

  // 监听换行并处理注释
  vscode.workspace.onDidChangeTextDocument((event) => {
    //获取当前活动的编辑器实例
    const editor = vscode.window.activeTextEditor;
    if (!editor || event.document !== editor.document) return;

    if (event.contentChanges.length !== 1) return; // 跳过非单一变更的操作（如粘贴代码等）

    //获取内容变化数组的第一个变更记录 change
    const change = event.contentChanges[0];
    if (!change || !change.text.includes("\n")) return; // 仅处理换行符

    //获取变更开始的位置（光标的位置）
    const position = change.range.start;
    const line = editor.document.lineAt(position.line).text;
    // console.log("line", line);
    // 判断是否是注释行
    if (line.trimStart().startsWith("//")) {
      vscode.window.showInformationMessage("这是单行注释");
      insertCommentPrefix(editor, position, "// ");
    } else if (line.trimStart().startsWith("/*")) {
      insertCommentPrefix(editor, position, " * ");
    }
  });

  let disposable = vscode.commands.registerCommand(
    "easy-translate.translateSelectedText",
    async () => {
      // 获取当前选中的文本
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("没有打开的编辑器");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      // vscode.window.showInformationMessage("选择的文本：", selectedText);

      // 去除注释标记
      const cleanedText = selectedText
        .replace(/\/\/\s*/g, "") // 删除单行注释的标记 //，保留内容
        .replace(/\/\*|\*\//g, "") // 删除多行注释的标记 /* 和 */
        .replace(/^\s*\*\s?/gm, "") // 删除多行注释中每一行开头的 * 号
        .replace(/\n/g, " ") // 将换行符替换为空格
        .trim();
      if (cleanedText.length > 0) {
        try {
          const translatedText = await translateText(cleanedText);
          // 复制翻译结果到剪切板
          vscode.env.clipboard.writeText("// " + translatedText);
          vscode.window.showInformationMessage("翻译成功，结果已复制到剪切板");
        } catch (error) {
          vscode.window.showErrorMessage("翻译失败: " + error.message);
        }
      } else {
        vscode.window.showInformationMessage("没有有效的文本可供翻译");
      }
    }
  );

  context.subscriptions.push(disposable);
}
//TODO: 获取当前文件的后缀名，处理不同语言的注释
function getFileExtension() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return null; 

  const fileName = editor.document.fileName; // 获取当前文件名
  return path.extname(fileName).slice(1); // 提取后缀名，去掉 "."
}

/**
 * 插入注释前缀
 * @param {vscode.TextEditor} editor 当前编辑器
 * @param {vscode.Position} position 光标位置
 * @param {string} prefix 注释前缀
 */
function insertCommentPrefix(editor, position, prefix) {
  editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(position.line + 1, 0), prefix);
  });
}
// 读取配置文件中的密钥
function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, "utf-8");
    try {
      return JSON.parse(configData);
    } catch (error) {
      vscode.window.showErrorMessage(
        "无法解析 config.json 文件：" + error.message
      );
      return null;
    }
  } else {
    // vscode.window.showErrorMessage("config.json 文件未找到！");
    return null;
  }
}
// 获取用户配置的 APP_ID 和 SECRET_KEY
function getConfig() {
  const config = vscode.workspace.getConfiguration("easy-translate");
  const appId = config.get("appId");
  const secretKey = config.get("secretKey");

  return { appId, secretKey };
}
//调用百度翻译 API
async function translateText(text) {
  const config = loadConfig();
  let appId = "";
  let secretKey = "";
  if (config === null) {
    const fallbackConfig = getConfig();
    appId = fallbackConfig.appId;
    secretKey = fallbackConfig.secretKey;
  } else {
    appId = config.APP_ID;
    secretKey = config.SECRET_KEY;
  }

  if (!appId || !secretKey) {
    vscode.window.showErrorMessage("API 密钥未设置。");
    return "";
  }

  const salt = Date.now();
  const sign = generateSign(appId, text, salt, secretKey);

  const fromLang = "en";
  const toLang = "zh";

  const params = querystring.stringify({
    q: text,
    from: fromLang,
    to: toLang,
    appid: appId,
    salt: salt,
    sign: sign,
  });
  const response = await fetch(`${URL}?${params}`);
  const data = await response.json();

  if (data && data.trans_result && data.trans_result[0]) {
    return data.trans_result[0].dst;
  } else {
    throw new Error("翻译失败");
  }
}
//生成签名
function generateSign(appId, text, salt, secretKey) {
  const sign = crypto
    .createHash("md5")
    .update(appId + text + salt + secretKey)
    .digest("hex");
  return sign;
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
