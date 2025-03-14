export function downloadFile(userId) {
  fetch(import.meta.env.VITE_BASE_URL + `predicted/download`, {
    method: 'POST',
    responseType: 'blob',
    headers: {
      'Content-type': 'application/vnd.ms-excel',
      Authorization: userId
    }
  })
    .then((res) => res.blob())
    .then((blob) => {
      var url = window.URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.href = url
      a.download = 'predicted_odds.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
}
