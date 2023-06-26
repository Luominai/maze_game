var socket = io()

submit = document.getElementById('submit')
submit.addEventListener('click', () => {
    gamePin = document.getElementById('gamePin').value
    socket.emit('checkPin', gamePin)
})
socket.on('checkPin', (room_exists) => {
    if (room_exists) {
        gamePin = document.getElementById('gamePin').value
        formAction('/join', 'POST', {'name' : 'gamePin', 'value' : gamePin})
    }
    // else alert
    else {
        alert('that game does not exist')
    }
})

// redirects you to another window as if you were submitting a form
function formAction(route, method, data) {
    // if the form already exist, get it
    if (document.getElementById('redirectCreate')){
        form = document.getElementById('redirectCreate')
        //remove existing children
        form.removeChild(form.firstChild)
    }
    // if the form doesn't exist, make one
    else{
        form = document.createElement('form')
        document.body.appendChild(form)
    }
    
    form.setAttribute('action', route)
    form.setAttribute('method', method)
    form.setAttribute('id', 'redirectCreate')

    input = document.createElement('input')
    input.setAttribute('hidden', true)
    if ('name' in data)
        input.setAttribute('name', data['name'])
    if ('value in data')
        input.setAttribute('value', data['value'])

    form.appendChild(input)

    form.submit()
}

(function () {
	window.onpageshow = function(event) {
        // event.persisted means loading the page from cache
		if (event.persisted) {
			window.location.reload();
		}
	};
})();