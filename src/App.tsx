import React from 'react'
import './App.css'

import StartMenu, { useSettings } from './components/StartMenu'
import Game from './components/Game'

const App = () => {
    return <div className='App'>{useSettings((state) => state.playing) ? <Game /> : <StartMenu />}</div>
}

export default App
