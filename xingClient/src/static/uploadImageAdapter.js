export default class uploadImageAdapter {
  constructor (loader, id) {
    this.loader = loader
    this.id = id
  }

  upload () {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this._initRequest()
        this._initListeners(resolve, reject, file, this.id)
        this._sendRequest(file, this.id)
      }))
  }

  abort () {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  _initRequest () {
    const xhr = this.xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://127.0.0.1:7001/addimg', true)
    xhr.responseType = 'json'
  }

  _initListeners (resolve, reject, file, id) {
    const xhr = this.xhr
    const loader = this.loader
    const genericErrorText = `Couldn't upload file: ${file.name}.`
    xhr.addEventListener('error', () => reject(genericErrorText))
    xhr.addEventListener('abort', () => reject())
    xhr.addEventListener('load', () => {
      const response = xhr.response
      console.log(response)
      if (!response || response.error) {
        console.log(id)
        return reject(response && response.error ? response.error.message : genericErrorText)
      }
      resolve({
        default: response.result
      })
    })
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total
          loader.uploaded = evt.loaded
        }
      })
    }
  }

  _sendRequest (file, id) {
    const data = new FormData()
    data.append('img', file)
    data.append('idd', id)
    this.xhr.send(data)
  }
}
