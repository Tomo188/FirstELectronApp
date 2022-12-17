

// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI
const form=document.querySelector("#img-form")
const img=document.querySelector("#img")
const outputPath=document.querySelector("#output-path")
const filename=document.querySelector("#filename")
const heightInput=document.querySelector("#height")
const widthInput=document.querySelector("#width")

img.addEventListener("change",loadImage)
function loadImage(e){
    const file=e.target.files[0]
    if(!isFIle(file)){
        alertMessage("please select image!!!",true)

        return
    }
    alertMessage("successful upload image", false)
    form.style.display="block"
    filename.innerHTML=file.name
    const image=new Image()
    image.src=URL.createObjectURL(file)
    image.onload=function(){
        widthInput.value=this.width
        heightInput.value=this.height
        outputPath.innerText=path.join(os.homedir(),"imageresizer")
    }
     
}
function alertMessage(message,type){
    to.console("ferdo")
    to.toast({
        text:message,
        duration:5000,
        close:false,
        style:{
            background:type?"red":"green",
            color:"white",
            textAlign:"center"
        }
    })
}
function isFIle(file){
    const acceptedImageType=["image/gif","image/png","image/jpeg"]
    return file && acceptedImageType.includes(file["type"])
}
function sendImage(e){
 e.preventDefault()
 const imgPath=img.files[0].path

 const height=heightInput.value
 const width=widthInput.value
 if (!img.files[0]){
    alertMessage("Please upload image!",true)
 }
 if(!height || !width){
    alertMessage("enter width or height!",true)
    return
 }
 ipcRenderer.send("image:resize",{
    height,width,imgPath
 })
 ipcRenderer.on("image:done",()=>alertMessage("done image resized",false))
}
form.addEventListener("submit",sendImage)