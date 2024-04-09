const socket = io();

socket.emit('message', 'Hola, me estoy comunicando desde websocket');

socket.on('socket-individual', data => {
    console.log('>>>>socket-individual: ', data);
});
socket.on('todos-menos-socket', data => {
    console.log('>>>>todos-menos-socket:', data);
});
socket.on('socket-para-todos', data => {
    console.log('>>>>socket-para-todos: ', data);
});
