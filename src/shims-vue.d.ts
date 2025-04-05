declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{Book}, {NewBook}, unknown>
    export default component
  }