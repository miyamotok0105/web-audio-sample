let socket = null
let processor = null
let localstream = null

function startRecording() {
    socket = io.connect()
    console.log('start recording')
    context = new window.AudioContext()
    //sampleRate 全てのノードで使われるサンプルレート(1秒あたりのサンプル数)を浮動小数点で返します。
    //socket.emit 複数のイベントで発信、受信を行う
    socket.emit('start', { 'sampleRate': context.sampleRate })

    //メディア入力を使用する許可をユーザーに求めます。下記の場合、特定の要件なしに audio と video の両方要求します。
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        localstream = stream
        //ここからの音声は再生や編集ができます。
        const input = this.context.createMediaStreamSource(stream)

        //Web Audio API が提供する機能では望む音声処理を実現できない場合に使用
        //引数　サンプルフレームを単位としたバッファのサイズ , 入力のチャンネル数 , 出力のチャンネル数
        processor = context.createScriptProcessor(4096, 1, 1)

        input.connect(processor)
        processor.connect(context.destination)

        processor.onaudioprocess = (e) => {
            //音声データ
            const voice = e.inputBuffer.getChannelData(0)
            //全ユーザにメッセージを配信
            socket.emit('send_pcm', voice.buffer)
        }
    }).catch((e) => {
        // "DOMException: Rrequested device not found" will be caught if no mic is available
        console.log(e)
    })
}

function stopRecording() {
    console.log('stop recording')
    processor.disconnect()
    processor.onaudioprocess = null
    processor = null
    localstream.getTracks().forEach((track) => {
        track.stop()
    })
    socket.emit('stop', '', (res) => {
        console.log(`Audio data is saved as ${res.filename}`)
    })
}
