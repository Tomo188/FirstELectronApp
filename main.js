const {app,browserWindow, BrowserWindow,Menu,ipcMain,shell}=require("electron")
const isDevelopment=process.env.NODE_ENV!=="development"
const isMac=process.platform !== 'darwin'
const path=require("path")
const os=require("os")
const fs=require("fs")
let mainWindow;
const resizeImage=require("resize-img")
function createMainWindow(){
     mainWindow=new BrowserWindow({
        title:"Resizer Image",
        width:isDevelopment?1000:500,
        height:700,
        webPreferences:{
            contextIsolation:true,
            nodeIntegration:true,
            preload:path.join(__dirname,"./renderer/preload/preload.js")
        }
    })
    if(isDevelopment){
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname,"./renderer/index.html"))
}

app.on("ready",()=>{
  createMainWindow()
  const mainMenu=Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu)
  mainWindow.on("closed",()=>(mainWindow=null))  
})
     
            
    
    
function createAboutWindow(){
    const aboutWindow=new BrowserWindow({
        title:"About Resizer Image",
        width:300,
        height:300
    })
 
    aboutWindow.loadFile(path.join(__dirname,"./renderer/about.html"))
}

const menu=[
    ...(!isMac?[{
        label:app.name,
        submenu:[
            {
                label:"About",
                click:createAboutWindow
            }
        ]
    }]:[]),
    {
        role:"fileMenu"
    },
    ...(isMac?[{
        label:"Help",
        submenu:[
            {
                label:"About",
                click:createAboutWindow
            }
        ]
    }]:[])
]
ipcMain.on("image:resize",(e,options)=>{
    console.log("i dio")
    options.dest=path.join(os.homedir(),"imageresizer")
    console.log(options)
    imageResize(options)
})
async function imageResize({imgPath,height,width,dest}){
     console.log(imgPath)
  try{
    const newPath=await resizeImage(fs.readFileSync(imgPath),{
        width:Number(width),
        height:Number(height)
    })
    const filename=path.basename(imgPath)
    if(!fs.existsSync(dest)){
        fs.mkdirSync(dest)
    }
     fs.writeFileSync(path.join(dest,filename),newPath)
        shell.openPath(dest)
        mainWindow.webContents.send("image:done")
  }
  catch(err){
    console.error(err.message)
  }
}
app.on('window-all-closed', () => {
  if (isMac) {
    app.quit()
  }
})