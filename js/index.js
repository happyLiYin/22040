function addModal() {
    //调用获取节点的方法
    this.getTag();
    //调用绑定事件的方法
    this.bindEve();
    //调用获取数据的方法
    this.getData();
    this.$();
};
//获取节点的方法
addModal.prototype.getTag = function () {
    //获取保存按钮的节点
    this.save = document.querySelector('.save-data');
    //给删除的模态框你绑定点击事件
    this.confirm = document.querySelector('.confirm-del');
    //获取tbody
    this.tbodyObj = document.querySelector('.table tbody');
    this.modify = document.querySelector('.modify-data');
    // console.log(this.modify,'哈哈');
}
//绑定事件的方法
addModal.prototype.bindEve = function () {
    this.save.onclick = this.clickFn.bind(this);
    this.tbodyObj.onclick = this.distribute.bind(this);
    this.confirm.onclick = this.confirmDel.bind(this);
    this.modify.onclick = this.saveModify.bind(this);
    // console.log(this.modify,'哈哈');
}
//绑定事件的回调函数
addModal.prototype.clickFn = function () {
    this.saveData();
}
//修改的方法
addModal.prototype.modifyData = function (target) {
    // console.log(target);
    //弹出修改的模态框
    $('#modifyModal').modal('show');
    //获取要修改的数据显示到模态框中
    let trobj = '';
    // //判断点击的是否是button
    if (target.nodeName == 'BUTTON') {
        trobj = target.parentNode.parentNode;
    }
    // // console.log(trobj);
    // //获取所有的子节点,分别取出id,idea,pos,title
    let chil = trobj.children;
    // console.log(chil);
    let id = chil[0].innerHTML;
    let title = chil[1].innerHTML;
    let pos = chil[2].innerHTML;
    let idea = chil[3].innerHTML;
    console.log(id, title, pos, idea);
    //将内容放置到修改表单中
    //获取form表单
     let form = this.$('#modifyModal form').elements;
    console.log(this.form, '哈哈');
    //将他们设置到表单中
    form.title.value = title;
    form.idea.value = idea;
    form.pos.value = pos;
    //将id设置为属性
    this.modifyId = id;
}
addModal.prototype.saveModify = function () {
    //数据能不能被解构看原型对象,点开原型对象之后看symbol.iterato.这是可以被迭代的,也就证明可以被解构(能够可迭代,就能够实现可解构)
    //解构赋值,直接拿到结果解构赋值(同样是获取form表单)
    let { title, idea, pos } = this.$('#modifyModal form').elements;
    console.log(title, idea, pos);
    let titleVal = title.value.trim();
    let ideaVal = idea.value.trim();
    let posVal = pos.value.trim();
    console.log(titleVal, ideaVal, posVal);
    //进行非空验证
    if (!posVal || !titleVal || !ideaVal) throw new Error('不能为空')
    if (!posVal || !titleVal || !ideaVal) return;
    //给后台点发送数据进行修改
    axios.put('  http://localhost:3000/then/' + this.modifyId, {
        title: titleVal,
        idea: ideaVal,
        pos: posVal
    }).then(res => {
        //     console.log(res);
        //请求成功则刷新页面
        if (res.status == 200) {
            location.reload();
        }

    })
}
addModal.prototype.distribute = function (eve) {
    let tar = eve.target;
    if (tar.classList.contains('btn-del')) this.delData(tar);
    if (tar.classList.contains('btn-modify')) this.modifyData(tar);
}
addModal.prototype.delData = function (target) {
    // console.log('这是删除的方法');
    //将当前准备删除的节点保存到属性上.声明一个属性,将节点保存到属性上
    this.target = target;
    //1.弹出确认删除的模态框,通过js控制
    //$是jquery的方法,不是我们封装的方法,不要加this
    $('#delModal').modal('show');
    //2.点击确认删除
}
//删除的方法
addModal.prototype.confirmDel = function () {
    console.log(this.target);
    //获取id
    let id = 0;
    //确定点击的是button
    if (this.target.nodeName == 'BUTTON') {
        let trobj = this.target.parentNode.parentNode;
        // console.log(trobj);
        //id作为第一个子节点所以是first
        id = trobj.firstElementChild.innerHTML;
        console.log(id);
    }
    //将id发送给json-server服务器,删除对应的数据,刷新页面
    axios.delete(' http://localhost:3000/then/' + id).then(res => {
        // console.log(res);
        console.log(id);
        //判断状态为200则删除成功
        if (res.status == 200) {
            //删除成功后进行刷新页面
            location.reload();
            // console.log('哈哈');
        }
    })
}
//添加内容的方法
addModal.prototype.saveData = function () {
    //获取表单
    this.form = document.forms[0].elements;
    //获取form表单内的值
    let title = this.form.title.value.trim();
    let pos = this.form.pos.value.trim();
    let idea = this.form.idea.value.trim();
    // console.log(title, pos, idea);
    //判断表单中是否有值.为空则进行提示
    if (!title || !pos || !idea) {
        //抛出错误,停止代码运行
        console.log(title, pos, idea);
        throw new Error('表单不能为空');
    }
    //将数据通过axios, 发送给json - server服务器, 进行保存
    axios.post('http://localhost:3000/then', {
        title,
        pos,
        idea
    }).then(res => {
        //判断服务器状态是否成功
        if (res.status == 201) {
            location.reload();
        };
    });
};

//获取数据的方法
addModal.prototype.getData = function () {
    // console.log('这是数据获取');
    axios.get('http://localhost:3000/then').then(res => {
        let { data, status } = res;
        if (status == 200) {
            let html = '';
            data.forEach(ele => {
                html += ` <tr>
                <th scope="row">${ele.id}</th>
                <td>${ele.title}</td>
                <td>${ele.pos}</td>
                <td>${ele.idea}</td>
                <td>
                <button type="button" class="btn btn-danger btn-sm btn-del">删除</button>
                <button type="button" class="btn btn-warning btn-sm btn-modify">修改</button>
                </td>
              </tr>`
            });
            // console.log(html);
            this.tbodyObj.innerHTML = html;
        };
    });
};
addModal.prototype.$=function(ele) {
    //如果当前获取到的值,长度只有1
    let res = document.querySelectorAll(ele);
    //判断房当前页面只有一个符合条件的,就返回单个节点对象,否则返回节点集合
    return res.length == 1 ? res[0] : res;
}
new addModal;