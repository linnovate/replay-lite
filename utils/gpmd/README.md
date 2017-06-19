# Gpmd

GoPro MetaData decoder

## Usage

```js
const gpmd = require('gpmd')
```
Decode file path (requires ffmpeg)
```js
stream = gpmd.decodeFile('/path/to/file.mp4')
stream.on('data', (data) => {
  console.log(data.toString())
})
stream.on('end', () => {
  console.log('end')
})
```

Decode stream
```js
src = fs.createReadStream('/path/to/file.bin');
dest = fs.createWriteStream('/path/to/dest.vtt');
gpmd.decodeStream(src).pipe(dest);
```

File to WebVTT
```js
gpmd.file2vtt({
  src: '/path/to/file.mp4',
  dest: '/path/to/file.vtt',

})
```