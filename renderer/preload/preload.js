const { channel } = require('diagnostics_channel')
const { contextBridge,ipcRenderer } = require('electron')
const os=require("os")
const path=require("path")
const toastify=require("toastify-js")

contextBridge.exposeInMainWorld('os', {
  homedir:()=>os.homedir()
})
contextBridge.exposeInMainWorld("path",{
  join:(...args)=>path.join(...args)
})
contextBridge.exposeInMainWorld("to",{
  toast:(option)=>toastify(option).showToast(),
  console:(name)=>console.log(name)
})
contextBridge.exposeInMainWorld("ipcRenderer",{
  send:(channel,data)=>ipcRenderer.send(channel,data),
  on:(channel,func)=>ipcRenderer.on(channel,(event,...args)=>func(...args))
})