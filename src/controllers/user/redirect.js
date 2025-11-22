export const success = (req, res) => {
    try {
        res.status(200).send('Função concluída!')
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
        console.error(error)
    }
}

export const cancel = (req, res) => {
    try {
        res.status(200).send('Função não concluída!')
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
        console.error(error)
    }
}