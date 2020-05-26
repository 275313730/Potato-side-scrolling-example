# 简介

    这是一个用Potato框架制作的移动端游戏示例，可以直接通过调用webview来进行游戏，采用的版本是0.5.0

# 文件结构

*   App.js: App.js是webpack的入口文件，打包后生成bundel.js文件。

*   public: public里包含index.html，bundle.js和其他游戏资源文件，index.html是webview的入口文件，bundle.js是由App.js和src里的资源打包成的js文件。(public文件夹里包含了完整的游戏内容，可以直接运行)

*   src: src里包含Potato框架和游戏逻辑文件等

# 跨平台方法

1.   将public里的文件拷贝到android.assets里
2.   使用android里的webview来调用index.html文件(无需考虑服务器和跨域问题)
3.   通过android studio编译apk文件