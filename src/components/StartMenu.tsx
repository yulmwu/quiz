import React, { useRef } from 'react'
import { create } from 'zustand'
import { quiz as exampleQuiz, Quiz } from '../quiz'

/**
 * playing: 게임 진행 여부
 * score: 점수
 * timer: 한 문제 당 시간 제한 (초)
 * timeRemaining: 전체 시간 제한 (초)
 * nextNow: 정답 후 바로 넘어가기 여부
 * particle: 파티클 효과 여부
 * correctCount: 정답 개수
 * incorrectCount: 오답 개수
 * showCorrectRate: 정답률 표시 여부
 */
interface Settings {
    quiz: Quiz | null
    playing: boolean
    score: number
    // duplevel: number
    correctCount: number
    incorrectCount: number
    showCorrectRate: boolean
}

const defaultSettings: Settings = {
    quiz: null,
    playing: false,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    showCorrectRate: false,
}

const useSettings = create<Settings>((set) => defaultSettings)

const StartMenu = () => {
    const quizNameRef = useRef<HTMLHeadingElement>(null)
    const quizDescriptionRef = useRef<HTMLParagraphElement>(null)

    const showCorrectRateRef = useRef<HTMLInputElement>(null)
    const errorRef = useRef<HTMLDivElement>(null)

    const checkboxLabelChange = (e: React.ChangeEvent<HTMLInputElement>, text: string) => {
        if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.textContent = text
    }

    const showCorrectRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) {
            checkboxLabelChange(e, '정답률 표시 함')
        } else {
            checkboxLabelChange(e, '정답률 표시 안함')
        }
    }

    // const error = (message: string) => {
    //     const error = errorRef.current as HTMLDivElement
    //     error.textContent = message
    //     error.classList.remove('hidden')
    // }

    const updateSettings = (start: boolean) => {
        const showCorrectRate = (showCorrectRateRef.current as HTMLInputElement).checked

        useSettings.setState({
            playing: start,
            showCorrectRate,
        })
    }

    const startGame = () => {
        if (!useSettings.getState().quiz) {
            errorRef.current!.textContent = '퀴즈 데이터를 불러오지 않았습니다.'
            errorRef.current!.classList.remove('hidden')
            return
        }

        updateSettings(true)
    }

    const fetchQuizData = () => {
        const quizData = (document.querySelector('textarea') as HTMLTextAreaElement).value
        try {
            const quiz = JSON.parse(quizData)
            useSettings.setState({ quiz })
            errorRef.current!.classList.add('hidden')
            quizNameRef.current!.textContent = quiz.name
            quizDescriptionRef.current!.textContent = quiz.description
        } catch (error) {
            errorRef.current!.textContent = 'Invalid JSON'
            errorRef.current!.classList.remove('hidden')
        }
    }

    return (
        <div className='container'>
            <div className='card'>
                <p className='text-2xl font-bold text-center mb-4' ref={quizNameRef}></p>
                <p className='text-sm text-gray-600 text-center mb-4' ref={quizDescriptionRef}></p>
                <div className='flex justify-center items-center space-x-2 mb-4 mt-4'>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600' onClick={startGame}>
                        시작
                    </button>
                </div>

                <div
                    className='text-center text-red-600 hidden cursor-pointer'
                    ref={errorRef}
                    onClick={() => errorRef.current?.classList.add('hidden')}
                ></div>
            </div>

            {/* 옵션 카드 */}
            <div className='card'>
                <h2 className='text-xl font-semibold text-center mb-4'>옵션 (선택)</h2>
                <p className='text-sm text-gray-600 text-center mb-4'>필요 시에만 선택하세요.</p>
                <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                        <input type='checkbox' ref={showCorrectRateRef} className='w-4 h-4' onChange={showCorrectRateChange} defaultChecked />
                        <label htmlFor='strokeImage' className='text-gray-700'>
                            정답률 표시 함
                        </label>
                    </div>
                </div>
            </div>

            <div className='card'>
                <h2 className='text-xl font-semibold text-center mb-4'>퀴즈 데이터 불러오기</h2>
                <p className='text-sm text-gray-600 text-center mb-4'>JSON 데이터를 직접 입력하세요.</p>
                <textarea className='w-full h-32 p-2 border border-gray-300 rounded-lg' placeholder='JSON 데이터'></textarea>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600' onClick={fetchQuizData}>
                    검증 및 불러오기
                </button>
            </div>
        </div>
    )
}

export default StartMenu
export { useSettings, defaultSettings }
