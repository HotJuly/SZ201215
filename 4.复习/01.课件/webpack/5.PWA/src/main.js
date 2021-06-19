import "@/index.less";
import "@/index.css";

//只有在入口文件,或者后续依赖中使用到的文件,才会被webpack一起打包
console.log('hello webpack')


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }