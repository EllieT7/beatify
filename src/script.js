import Amplify, { API, Storage } from 'aws-amplify'
import awsconfig from './aws-exports'

Amplify.configure(awsconfig)

// Storage.configure({ level: 'public' })

const createAudioPlayer = track => {
  Storage.get(track.key).then(result => {
    const cancion = document.createElement('cancion')
    cancion.classList.add('cancion')
    const audio = document.createElement('audio')
    const source = document.createElement('source')
    const contenido = document.createElement('contenido')
    //Obtener datos de la cancion
    API.get('api2', '/cancion/' + track.key)
      .then(response => {
        console.log(response)
        //Inner html con los datos de la cancion
        const html = `  <div class="info">            
          <p class="titulo"><strong>Título:</strong> ${response[0].titulo} | <strong>Artista:</strong> ${response[0].artista} | <strong>Álbum:</strong> ${response[0].album} | <strong>Género:</strong> ${response[0].genero} &nbsp;&nbsp;&nbsp;</p>
            </div>
            `
        contenido.innerHTML = html
      }
      )
      .catch(error => {
        console.log(error.response)
      }
      )

    audio.appendChild(source)
    audio.appendChild(contenido)
    audio.setAttribute('controls', '')
    source.setAttribute('src', result)
    source.setAttribute('type', 'audio/mpeg')
    cancion.appendChild(contenido)
    cancion.appendChild(audio)
    document.querySelector('.tracks').appendChild(cancion)
  })

}

document.getElementById('upload-form').addEventListener('submit', e => {
  e.preventDefault()
  const file = document.getElementById('file-upload').files[0]
  const title = document.getElementById('title-input').value
  const artist = document.getElementById('artist-input').value
  const album = document.getElementById('album-input').value
  const genre = document.getElementById('genre-input').value
  const myInit = {
    body: {
      "id": "x",
      "titulo": title,
      "artista": artist,
      "album": album,
      "genero": genre
    }
  }
  Storage.put(file.name, file)
    .then(result => {
      console.log(result)
      myInit.body.id = result.key
      API.post('api2', '/cancion', myInit)
        .then(response => {
          console.log(response)
          createAudioPlayer(result)
          alert('Canción subida correctamente 😊')
        })
        .catch(error => {
          console.log(error.response)
        })
    })
    .catch(err => console.error(err))
})

Storage.list('')
  .then(result => {
    console.log(result)
    console.log(result[0].eTag)
    result.forEach(item => createAudioPlayer(item))
  })
  .catch(err => console.error(err))
