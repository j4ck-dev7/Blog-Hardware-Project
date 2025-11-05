export const tempoRelativo = (data) => {
    const agora = Date.now();
    const diff = agora - new Date(data);
    const segundos = Math.floor(diff / 1000);
    
    if(segundos < 60) return 'agora mesmo';
    if(segundos < 3600) return `há ${Math.floor(segundos / 60)} munitos`;
    if(segundos < 86400) return `há ${Math.floor(segundos / 3600)} horas`;
    if(segundos < 172800) return 'ontem';
    return `há ${Math.floor(segundos / 86400)} dias`;
}