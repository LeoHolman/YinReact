import React, {Component} from 'react';
import './Home.css'
import yin1 from '../assets/images/yin1.svg'
import yin2 from '../assets/images/yin2.svg'
import yin3 from '../assets/images/yin3.svg'

class Home extends Component {
    render(){
        return (
            <>
                <div id = "main">
                    <img id = "yin1" src = {yin1} alt="yin1" />
                    <section id = "home-intro">
                        <p>Yin is a tool to help beginning learners of
                Chinese understand, recognize, and produce Chinese tone. Tone is a
                foundation of the Chinese language, and critical to effective
                communication. Through four lessons and four activities, you will not only learn what tone is and how it's used, but also how to put it into practice. The first two activities work with distinguishing between tones and the final two ask you to pronounce some Chinese words yourself and will give you visual feedback on how you measure up to a native speaker. Ready to learn?</p>
                    </section>
                        <a  href = "pages/Lesson1.php" id = "mid-wrapper">
                            <h1 id = "begin">BEGIN</h1>
                            <img id = "yin2" src = {yin2} alt="yin2"/>
                        </a>
                    <img id = "yin3" src = {yin3} alt="yin3"/>
                </div>
            </>
        )
    }
}

export default Home;