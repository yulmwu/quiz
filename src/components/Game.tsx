import { useRef, useEffect } from 'react'
import { useSettings } from './StartMenu'

import Settings from '../data/settings.json'
import { Question } from '../quiz'
import createFirework from '../utils/firework'

const Game = () => {
    let { quiz, playing, score, correctCount, incorrectCount, showCorrectRate } = useSettings((state) => state)

    const scoreRef = useRef<HTMLHeadingElement>(null) // 점수
    const questionRef = useRef<HTMLHeadingElement>(null) // 문제
    const hintRef = useRef<HTMLParagraphElement>(null) // 힌트
    const resultRef = useRef<HTMLParagraphElement>(null) // 정답 여부
    const optionsRef = useRef<HTMLDivElement>(null) // 문제 답변 선택지
    const nextButtonRef = useRef<HTMLButtonElement>(null) // 다음 문제 버튼
    const hintButtonRef = useRef<HTMLButtonElement>(null) // 힌트 버튼

    useEffect(() => {
        if (playing) {
            scoreUpdate()
            nextQuestion()
        }
    })

    let currentQuestion: Question | null = null // 현재 문제
    // 중복 문제 방지용
    let previousQuestion: Array<Question> = []

    const randomQuestion = () => quiz!.questions[Math.floor(Math.random() * quiz!.questions.length)]

    const disableAllButtons = (state: boolean) => {
        const optionsDiv = optionsRef.current as HTMLDivElement
        const buttons = optionsDiv.querySelectorAll('button')
        buttons.forEach((button) => {
            button.disabled = state
        })
    }

    const calcCorrectRate = (): number => {
        if (correctCount + incorrectCount === 0) return 0
        return (correctCount / (correctCount + incorrectCount)) * 100
    }

    const scoreUpdate = (n?: number) => {
        if (!n) score = Settings.score_const.default
        else score += n

        scoreRef.current!.textContent = `점수: ${score} ${showCorrectRate ? `(정답률: ${calcCorrectRate().toFixed(2)}%)` : ''}`

        if (score === 0) return

        if (score < 0) {
            scoreRef.current!.classList.add('text-red-700')
            scoreRef.current!.classList.remove('text-green-700')
        } else {
            scoreRef.current!.classList.add('text-green-700')
            scoreRef.current!.classList.remove('text-red-700')
        }
    }

    const nextQuestion = () => {
        if (!playing) return

        disableAllButtons(false)
        nextButtonRef.current!.disabled = true

        resultRef.current!.textContent = ''
        hintRef.current!.textContent = ''

        const question = randomQuestion()
        if (previousQuestion.includes(question)) {
            nextQuestion()
            return
        }

        previousQuestion.push(question)
        if (previousQuestion.length >= quiz!.questions.length) previousQuestion.shift()

        questionRef.current!.textContent = question.question
        currentQuestion = question

        if (currentQuestion.hint) {
            hintButtonRef.current!.disabled = false
        } else {
            hintButtonRef.current!.disabled = true
        }

        genarateOptions()
    }

    const genarateOptions = () => {
        if (!currentQuestion) return

        const options = currentQuestion.options.sort(() => Math.random() - 0.5)

        const optionsDiv = optionsRef.current as HTMLDivElement
        optionsDiv.innerHTML = ''

        const is_even = options.length % 2 === 0

        options.forEach((option, i) => {
            const button = document.createElement('button')
            button.textContent = option

            button.classList.add(
                i === options.length - 1 && !is_even ? 'w-full' : 'w-[calc(50%-0.5rem)]', // 50% - 0.5rem(8px) (half of the gap)
                'h-32',
                'bg-gray-100',
                'text-gray-800',
                'rounded-lg',
                'shadow-md',
                'hover:bg-gray-200'
            )
            button.onclick = () => checkAnswer(option, button)
            optionsDiv.appendChild(button)
        })
    }

    const checkAnswer = (selected: string, button: HTMLButtonElement) => {
        if (!currentQuestion) return
        button.disabled = true

        const result = resultRef.current as HTMLParagraphElement

        if (selected === currentQuestion.correct) {
            disableAllButtons(true)

            result.textContent = '정답입니다!'
            result.className = 'text-green-500 text-center pt-3'
            button.classList.add('correct')

            correctCount++
            scoreUpdate(Settings.score_const.correct)

            const rect = button.getBoundingClientRect()
            createFirework(rect.x + rect.width / 2, rect.y + rect.height / 2)

            nextButtonRef.current!.disabled = false
            hintButtonRef.current!.disabled = true
        } else {
            result.textContent = `오답입니다. 다시 한번 생각해보세요.`
            result.className = 'text-red-500 text-center pt-3'
            button.classList.add('incorrect', 'incorrect-animation')

            incorrectCount++
            scoreUpdate(Settings.score_const.incorrect)
        }
    }

    const hintButton = () => {
        if (!currentQuestion) return
        hintButtonRef.current!.disabled = true
        hintRef.current!.textContent = `힌트: ${currentQuestion.hint}`
    }

    const nextButton = () => {
        nextQuestion()
        nextButtonRef.current!.disabled = true
    }

    return (
        <div className='container'>
            <div className='card'>
                <p id='score' className='text-lg text-center pb-3' ref={scoreRef}>
                    점수: 0 {showCorrectRate ? '(정답률: 0%)' : ''}
                </p>
                <p id='hint' className='text-lg text-center pb-3' ref={hintRef}></p>
                <div>
                    <p id='question' className='text-3xl text-center' ref={questionRef}>
                        ?
                    </p>
                </div>
                <p id='result' className='text-center pt-3' ref={resultRef}></p>
            </div>

            <div className='card'>
                <div id='options' className='flex flex-wrap gap-4' ref={optionsRef}></div>
                <div className='flex justify-center flex-wrap gap-5 mt-5'>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'
                        onClick={hintButton}
                        ref={hintButtonRef}
                    >
                        힌트
                    </button>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'
                        onClick={nextButton}
                        ref={nextButtonRef}
                    >
                        다음 문제
                    </button>
                </div>
            </div>

            <div className='flex justify-center mt-20'>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600' onClick={() => window.location.reload()}>
                    처음으로 돌아가기
                </button>
            </div>
        </div>
    )
}

export default Game
