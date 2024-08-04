import React from 'react'
import { Header } from '.'
import { TopSection } from '.'
import { BotSection } from '.'
import { Footer } from '.'

const Home = () => {
    
    return (
        <div className="App">
        <link href='https://fonts.googleapis.com/css?family=Outfit' rel='stylesheet'></link>
        <Header />

        <TopSection />
    
        <BotSection />
            
        <Footer />
        
        </div>
    )
}

export default Home
