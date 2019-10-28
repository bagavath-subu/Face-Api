const video= document.getElementById("video");


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('/weights')
]).then(start)

function start(){
    navigator.getUserMedia(
        {video:{}},
        stream=> video.srcObject= stream,
        err=>console.log(err)
    )
}

video.addEventListener('play',()=>{
    const canvas= faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaysize={width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,displaysize)
    setInterval(async()=>{
        const detect =await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detect)
        const resizeddetect=faceapi.resizeResults(detect,displaysize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawFaceExpressions(canvas, resizeddetect)
    },100)
})

