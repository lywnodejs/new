---
title: avalon
date: 2018-10-28
categories: avalon
author: lyw
cover_picture: images/js.JPEG
tags:
    - avalon
---
> avalon2是一款基于虚拟DOM与属性劫持的 迷你、 易用、 高性能 的 前端MVVM框架， 拥有超优秀的兼容性, 支持移动开发, 后端渲染, WEB Component式组件开发, 无需编译, 开箱即用。

## avalon
 avalon的所有操作都是围绕vm进行。 vm，亦即view model，视图模型。只要我将一个JS对象添加一个$id属性， 再放到avalon.define方法里面，就能得到一个vm。
```
 var vm = avalon.define({
    $id: "start",
    name: "test"
})
```
 里面以$带头的属性或放到$skipArray，都转换为访问器属性，也就是其他语言的setter, getter。因此如果这个属性最初没有定义，那么它就不会转换为访问器属性，修改该属性，就不会刷新视图。

>计算属性集中定义在$computed对象中。有多种形式。
>函数形式的只读计算属性
```
avalon.define({
    $id: 'test',
    firstName: '333',
    lastName: 'xxx',
    $computed: {
        //fullName依赖于firstName与lastName
        fullName: function(){
            return this.firstName+' '+this.lastName
        },
        //xxx只依赖于firstNaem
        xxx: function(){
            return this.firstName+'!!'
        }
    }
})
```

![img](http://thyrsi.com/t6/415/1541661951x-1404755462.jpg)
![img](http://thyrsi.com/t6/415/1541662138x-1404781090.jpg)

## 插值表达式
> 位于文本节点中的双重花括号,当然这个可以配置.此指令其中文本ms-text指令的简单形式.
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            aaa: 'aaa',
            bbb: 'bbb'
        })

    </script>
    <p>{{@aaa}}{{@bbb}} 这个性能差些</p>
    <p>{{@aaa+@bbb}} 这个性能好些</p>
    <p>{{@aaa+@bbb  | uppercase}} 选择器必须放在表达值的后端</p>
</body>
```

## skip绑定
> 让avalon的扫描引擎跳过某一部分区域, 方便能原样输出
> 合理使用ms-skip能大大提高性能
```
<body :controller="test">
<script>
var vm = avalon.define({
  $id: "test",
  aaa: "XXXX"
  toggle: false
})
</script>
<div ms-skip='true' >{{@aaa}}</div>
<div>{{@aaa}}</div>
</body>
```

## controller绑定
>这个指令是用于圈定某个VM的作用域范围(换言之,这个元素的outerHTML会被扫描编译,所有ms-*及双花括号替换成vm中的内容),ms-controller的属性值只能是某个VM的$id
ms-controller的元素节点下面的其他节点也可以使用ms-controller
每个VM的$id可以在页面上出现一次, 因此不要在ms-for内使用ms-controller.
当我们在某个指令上用@aaa时,它会先从其最近的ms-controller元素上找, 找不到再往其更上方的ms-controller元素 

## important绑定
> 这个指令是用于圈定某个VM的作用域范围(换言之,这个元素的outerHTML会被扫描编译,所有ms-*及双花括号替换成vm中的内容),ms-important的属性值只能是某个VM的$id
ms-important的元素节点下面的其他节点也可以使用ms-controller或ms-important
与ms-controller不一同的是,当某个属性在ms-important的VM找不到时,就不会所上寻找
 
不要在ms-for内使用ms-important.
ms-important这特性有利协作开发,每个人的VM都不会影响其他人,并能大大提高性能
ms-important只能用于ms-controller的元素里面
```
  <div ms-important='aaa'>
      <div ms-controller='ccc'>
           <div ms-important='ddd'>

          </div>
          </div>
      <div ms-controller='bbb'>

      </div>
  </div>
```

## 属性绑定
>属性绑定用于为元素节点添加一组属性, 因此要求属性值为对象或数组形式. 数组最后也会合并成一个对象.然后取此对象的键名为属性名, 键值为属性值为元素添加属性
> 如果键名如果为for, char这样的关键字,请务必在两边加上引号
> 如果键名如果带横杠,请务必转换为驼峰风格或两边加上引号
> 注意,不能在ms-attr中设置style属性
```
<p ms-attr="{style:'width:20px'}">这样写是错的,需要用ms-css指令!!</p>
```

>示例:
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            obj: {title: '普通 ', algin: 'left'},
            active: {title: '激活'},
            width: 111,
            height: 222,
            arr: [{img: 'aaa'}, {img: 'bbb'}, {img: 'ccc'}],
            path: '../aaa/image.jpg',
            toggle: false,
            array: [{width: 1}, {height: 2}]
        })

    </script>
    <span ms-attr="@obj">直接引用对象</span>
    <img ms-attr="{src: @path}" />
    <ul>
        <li ms-for="el in @arr"><a ms-attr="{href:'http://www.ccc.xxx/ddd/'+ el.img}">下载</a></li>
    </ul>
    <span :attr="{width: @width, height: @height}">使用对象字面量</span><br/>
    <span :attr="@array">直接引用数组</span><br/>
    <span :attr="[@obj, @toggle && @active ]" :click="@toggle = !@toggle">选择性添加多余属性或重写已有属性</span>
</body>
```

## 样式绑定
> CSS绑定用于为元素节点添加一组样式, 因此要求属性值为对象或数组形式. 数组最后也会合并成一个对象.然后取此对象的键名为样式名, 键值为样式值为元素添加样式
> 如果键名为表示长宽,字体大小这样的样式, 那么键值不需要加单位,会自动加上px
> 如果键名如果为float,请务必在两边加上引号
> 如果键名如果为font-size,请务必转换为驼峰风格或两边加上引号
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            obj: {backgroundColor: '#3bb0d0',width:300, height:50, 'text-align': 'center'},//属性名带-,必须用引号括起
            active: {color: 'red'},
            width:  300,
            height: 60,
            toggle: true,
            array: [{width:100},{height:50},{border: '1px solid #5cb85c'}]
        })

    </script>
  <div ms-css="@obj">直接引用对象</div>
  <div :css="{width: @width, height: @height,background: 'pink'}">使用对象字面量</div>
  <div :css="@array">直接引用数组</div>
  <div :css="[@obj, @toggle && @active ]" :click="@toggle = !@toggle">选择性添加多余属性或重写已有属性</div>
</body>
```
## 可见性绑定
>这是通过修改元素的style.display值改变元素的可见性, 要求属性值对应一个布尔，如果不是布尔， avalon会自动转换值为布尔。
```
<body :controller="test">
<script>
var vm = avalon.define({
  $id: "test",
  aaa: "这是被隐藏的内容"
  toggle: false
})
</script>
<p><button type="button" :click='@toggle = !@toggle'>点我</span></p>
<div :visible="@toggle">{{@aaa}}</div>
</body>
```

## 双工绑定
> 双工绑定是MVVM框架中最强大的指令.react推崇单向数据流,没有双工绑定, 那么需要rudex等额外的库来实现相同的功能.
> 双工绑定只要用于表单元素上.或当一个div设置了contenteditable为true,也可以用ms-duplex指令.
> 各个表单元素的用法
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            aaa: 'aaa',
            bbb: 'bbb',
            ccc: 'ccc'
        })

    </script>

    <input ms-duplex="@aaa"/>{{@aaa}}
    <input ms-duplex="@bbb" type="password"/>{{@bbb}}
    <textarea ms-duplex="@ccc" /></textarea>{{@ccc}}
</body>
```

> 上面有三个控件,text, password, textarea它们都是属于输入型控件, 只要每为控件敲入一个字符, 后面的文本都会立即变化.那是因为它们默认是绑定oninput事件,如果想控件全部输入好,失去焦点时 才同步,那么可以使用change过滤器
```
<input ms-duplex="@aaa | change"/>{{@aaa}}
```

> 如果你是做智能提示, 控件是绑定了一个AJAX请求与后端不断交互, 使用oninput事件会太频繁, 使用onchange事件会太迟钝,那么我们可以使用debounce过滤器
```
<input ms-duplex="@aaa | debounce(300)"/>{{@aaa}}
```

300ms同步一次.
另外,可编辑元素的用法与过滤器与上面三种控件一样.
```
<div contenteditable="true" ms-duplex="@aaa | debounce(300)"/></div>
<p>{{@aaa}}</p>
```

这两个过滤器只能适用于上面的情况.
此外, 控件还有许多种, 像checkbox, radio,它们的同步机制也不一样.
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            aaa: '33',
            bbb: ['22']
        })

    </script>

    <input type="radio" value="11"  ms-duplex="@aaa"/>
    <input type="radio" value="22"  ms-duplex="@aaa"/>
    <input type="radio" value="33"  ms-duplex="@aaa"/>
    <input type="checkbox" value="11"  ms-duplex="@bbb"/>
    <input type="checkbox" value="22"  ms-duplex="@bbb"/>
    <input type="checkbox" value="33"  ms-duplex="@bbb"/>
    <p>radio: {{@aaa}}; checkbox:{{@bbb}}</p>
</body>
```

>checkbox与radio是一点击就会更新.radio要求在vm中为一个简单数据类型数据,字符串,数字或布尔. 而checkbox则要求是一个数组.并且在最开始时,ms-duplex会令radio钩上其value值等vm属性的控件, checkbox则可以勾选多个.如此一来,vm中的属性些总是等于radio与checkbox的属性值.但我们也可以让 vm的属性值等于此控件的勾选状态,这时需要用上ms-duplex-checked转换器.
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            aaa: false,
            bbb: false
        })

    </script>
    <input type="radio"  ms-duplex-checked="@aaa"/>
    <input type="checkbox"  ms-duplex-checked="@bbb"/>
    <p>radio: {{@aaa}}; checkbox:{{@bbb}}</p>
</body>
```

>最后表单元素还有select控件,它根据其multiple属性分为单选下拉框与复选下拉框, 其在vm中的值与radio,checkbox一样.即单选时,必须是一个简单数据类型, 复选时为一个数组. 在最开始时, 当option元素的value值或innerText(不在value值)与数据相同,它们就会被选上.
```
<body ms-controller="test">
    <script>
        avalon.define({
            $id: 'test',
            aaa: 'bbb',
            bbb: ['bbb','ccc'],
        })

    </script>
    <select :duplex="@aaa"><option>aaa</option><option>bbb</option><option>ccc</option></select>
    <select multiple="true" :duplex="@bbb"><option>aaa</option><option>bbb</option><option>ccc</option></select>
</body>
```



