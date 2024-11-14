## 中文说明

`Easy Translate` 是一个 VSCode 插件，允许你快速翻译选中的英文文本。该插件通过调用百度翻译 API，将选中的英文文本翻译为中文，并将翻译结果复制到剪贴板。用户可以通过配置 `APP_ID` 和 `SECRET_KEY` 来自定义百度翻译 API 的密钥。

### 功能

- 支持从选中的文本中去除注释标记（`//` 和 `/* */` 注释）。
- 将选中的英文文本翻译为中文。
- 翻译结果自动复制到剪贴板。
- 提供快捷键支持，方便用户快速使用。

### 安装

1. 下载并安装 VSCode 插件：
    - 使用命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`），输入 `Extensions: Install from VSIX...`。
    - 选择下载的 `.vsix` 文件进行安装。


### 使用

1. 选中一段英文文本。
2. 使用快捷键 `Ctrl+Shift+T`（或者你设置的自定义快捷键）来触发翻译。
3. 翻译结果将自动复制到剪贴板，并且你可以直接使用。

### 配置

在 VSCode 的 `settings.json` 文件中，配置你的百度翻译 API 密钥：

```json
json
Copy code
"easy-translate.appId": "your-app-id",
"easy-translate.secretKey": "your-secret-key"

```

### 常见问题

- **问题**：如何找到 `APP_ID` 和 `SECRET_KEY`？
    - **答案**：你需要在百度翻译开放平台注册并申请 API 密钥。访问 [百度翻译开放平台](https://fanyi-api.baidu.com/) 获取相关信息。



## English Description

`Easy Translate` is a VSCode extension that allows you to quickly translate selected English text. It uses the Baidu Translate API to translate selected English text into Chinese and automatically copies the translated result to the clipboard. Users can configure their own `APP_ID` and `SECRET_KEY` for the Baidu Translate API.

### Features

- Removes comment markers (`//` and `/* */`) from the selected text.
- Translates selected English text into Chinese.
- Copies the translation result to the clipboard automatically.
- Supports keyboard shortcuts for quick use.

### Installation

1. Download and install the VSCode extension:
    - Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), and type `Extensions: Install from VSIX...`.
    - Select and install the `.vsix` file.

### Usage

1. Select a piece of English text.
2. Use the shortcut `Ctrl+Shift+T` (or your custom shortcut) to trigger the translation.
3. The translated result will be automatically copied to the clipboard, and you can use it directly.

### Configuration

To configure your Baidu Translate API keys in the `settings.json` file:

```json
json
Copy code
"easy-translate.appId": "your-app-id",
"easy-translate.secretKey": "your-secret-key"

```

### FAQ

- **Q**: Where can I find my `APP_ID` and `SECRET_KEY`?
    - **A**: You need to register and apply for API keys on the Baidu Translate Open Platform. Visit [Baidu Translate Open Platform](https://fanyi-api.baidu.com/) for more details.