function sendDataToDetailTemplate(id){      
    localStorage.setItem('keyId',id)          
    location.href = 'detail.html'
    console.log(id)
}