---
title: elementUI
date: 2018-06-4
categories: 前端UI
cover_picture: images/ele.PNG
author: lyw
tags:
    - elementUI
---
> 想要在ele表格中添加图片或非文字类，方法如下

```
<el-table-column label="Logo" width="100">
    <template scope="scope">
    <img :src="scope.row.Logo" width="40" height="40" class="Logo"/>
    </template>
</el-table-column>
```
>其中Logo是你自己的定义参数
