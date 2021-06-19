import Vue from 'vue';

/*
    该文件是router-link的源码实现
    router-link是函数组件
    实现原理:
        1.默认生成a标签
        2.给当前a标签绑定点击事件
        3.禁止a标签的默认事件,防止他自动跳转
        4.在点击事件内部,调用编程式导航this.$router.push方法
*/
export default {
    name:"RouterLink",
    functional:true,
    props:{
        tag:{
            type:String,
            default:"a"
        },
        path:{
            type:String.require
        }
    },
    render:(_,{parent,props,data,children})=>{
        /*
            获取父组件创建虚拟DOM的方法
        */
        let createElement = parent.$createElement;

        /*
            绑定点击事件,并禁止a标签的默认行为
            使用编程式导航push方法,根据props传递下来的path属性值,实现URL地址变化
        */
        data.on={
            click:function(event){
                event.preventDefault();
                Vue.prototype.router.push(props.path);
            }
        }

        /*
            将props传递下来的path属性值赋值给a标签,作为a标签的href属性
        */
        data.attrs.href=props.path;

        /*
            通过createElement方法生成虚拟DOM
            children是组件标签之间写的内容,例如<router-link>aaa</router-link>,那children就是"aaa"
        */
        return createElement(props.tag,data,children)
    }
}