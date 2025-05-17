import React, { useRef, useState } from 'react'
import { create } from 'zustand'
import { Quiz } from '../quiz'
import { Editor } from '@monaco-editor/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand } from '@fortawesome/free-solid-svg-icons'
import ExpandEditorModal from './ExpandEditorModal'

import DefaultJSON from '../data/default.json'

interface Settings {
    quiz: Quiz | null
    playing: boolean
    score: number
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
    const quizAutherDateRef = useRef<HTMLParagraphElement>(null)

    const showCorrectRateRef = useRef<HTMLInputElement>(null)
    const errorRef = useRef<HTMLDivElement>(null)

    const quizDataMonacoRef = useRef<any>(null)
    const quizFetchButtonRef = useRef<HTMLButtonElement>(null)

    const quizDataMonacoExpandRef = useRef<any>(null)

    const quizDataMonacoExpandImportButtonRef = useRef<HTMLButtonElement>(null)

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

    const error = (message: string) => {
        const error = errorRef.current as HTMLDivElement
        error.textContent = message
        error.classList.remove('hidden')
    }

    const updateSettings = (start: boolean) => {
        const showCorrectRate = (showCorrectRateRef.current as HTMLInputElement).checked

        useSettings.setState({
            playing: start,
            showCorrectRate,
        })
    }

    const startGame = () => {
        if (!useSettings.getState().quiz) {
            error('퀴즈 데이터를 불러오지 않았습니다.')
            return
        }

        updateSettings(true)
    }

    const fetchQuizData = () => {
        const quizData = quizDataMonacoRef.current!.getValue()

        try {
            const quiz = JSON.parse(quizData)
            useSettings.setState({ quiz })
            errorRef.current!.classList.add('hidden')

            quizNameRef.current!.textContent = quiz.name
            quizDescriptionRef.current!.textContent = quiz.description
            quizAutherDateRef.current!.textContent = `${quiz.authors.join(', ')} / 최종 업데이트: ${quiz.lastUpdated}`

            quizFetchButtonRef.current!.disabled = true
        } catch (err) {
            error('잘못된 JSON 형식이거나 올바른 퀴즈 데이터가 아닙니다.')
        }
    }

    const changeQuizData = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const quizData = e.currentTarget.value
        let url = ''

        switch (quizData) {
            case 'input':
                return
            case 'korea':
                url = 'https://raw.githubusercontent.com/yulmwu/quiz_data/refs/heads/main/korea/modern.json'
                break
            case 'example':
                url = 'https://raw.githubusercontent.com/yulmwu/quiz_data/refs/heads/main/example.json'
                break
            default:
                error('Invalid quiz data')
                return
        }

        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error('가져오는 도중 오류 발생가 발생했습니다.')
                return response.json()
            })
            .then((data) => {
                quizDataMonacoRef.current!.setValue(JSON.stringify(data, null, 4))
            })
            .catch((_) => {
                error('가져오는 도중 오류 발생가 발생했습니다.')
            })
    }

    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className='container'>
            <div className='card'>
                <p className='text-2xl font-bold text-center mb-4' ref={quizNameRef}>
                    Quiz!
                </p>
                <p className='text-lg text-gray-600 text-center mb-4' ref={quizDescriptionRef}>
                    퀴즈를 불러오거나 직접 입력하여 시작하세요.
                </p>
                <p className='text-sm text-gray-500 text-center mb-4' ref={quizAutherDateRef}></p>
                <div className='flex justify-center items-center space-x-2 mb-4 mt-4'>
                    <button className='w-1/4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600' onClick={startGame}>
                        시작
                    </button>
                </div>

                <div
                    className='text-center text-red-600 hidden cursor-pointer'
                    ref={errorRef}
                    onClick={() => errorRef.current?.classList.add('hidden')}
                ></div>
            </div>

            <div className='card'>
                <h2 className='text-xl font-semibold text-center mb-4'>퀴즈 데이터 불러오기</h2>
                <p className='text-sm text-gray-600 text-center mb-4'>
                    JSON 데이터를 직접 입력하거나 선택하세요.
                    <a href='https://github.com/yulmwu/quiz_data' className='text-blue-500'>
                        {' '}
                        [퀴즈 데이터 목록]
                    </a>
                </p>
                <div className='flex justify-center items-center space-x-2 mb-4 mt-4'>
                    <select className='w-[60%] p-2 border border-gray-300 rounded-lg' onChange={changeQuizData}>
                        <option value='input'>직접 입력</option>
                        <option value='korea'>한국사</option>
                        <option value='example'>퀴즈 예시</option>
                    </select>
                    <input
                        type='file'
                        accept='.json'
                        className='w-[20%] p-2 border border-gray-300 rounded-lg'
                        onChange={(e) => {
                            const file = e.currentTarget.files?.[0]
                            if (file) {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                    quizDataMonacoRef.current!.setValue(event.target?.result as string)
                                }
                                reader.readAsText(file)
                            }
                        }}
                    />
                    <button
                        className='w-[20%] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'
                        onClick={fetchQuizData}
                        ref={quizFetchButtonRef}
                    >
                        확인
                    </button>
                </div>
                <Editor
                    language='json'
                    defaultValue={JSON.stringify(DefaultJSON, null, 4)}
                    className='w-full h-64 p-2 border border-gray-300 rounded-lg'
                    options={{
                        fontSize: 14,
                    }}
                    onMount={(editor) => {
                        quizDataMonacoRef.current = editor
                    }}
                    onChange={() => {
                        quizFetchButtonRef.current!.disabled = false
                    }}
                ></Editor>
                <div className='flex justify-end mt-2'>
                    <FontAwesomeIcon
                        icon={faExpand}
                        className='text-gray-500 cursor-pointer mr-1'
                        onClick={() => {
                            setModalOpen(true)
                        }}
                    />
                </div>
                <ExpandEditorModal open={modalOpen}>
                    <div className='w-full h-[70vh]'>
                        <Editor
                            language='json'
                            className='w-full h-full p-2 border border-gray-300 rounded-lg'
                            options={{
                                fontSize: 14,
                            }}
                            onMount={(editor) => {
                                quizDataMonacoExpandRef.current = editor
                            }}
                        ></Editor>
                    </div>
                    <div className='flex justify-end mt-2'>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'
                            onClick={() => {
                                quizDataMonacoExpandRef.current!.setValue(quizDataMonacoRef.current!.getValue())
                                quizDataMonacoExpandImportButtonRef.current!.disabled = true
                            }}
                            ref={quizDataMonacoExpandImportButtonRef}
                        >
                            기존 데이터 불러오기
                        </button>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 ml-2'
                            onClick={() => {
                                quizDataMonacoRef.current!.setValue(quizDataMonacoExpandRef.current!.getValue())
                                setModalOpen(false)
                            }}
                        >
                            저장
                        </button>
                        <button
                            className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 ml-2'
                            onClick={() => {
                                setModalOpen(false)
                            }}
                        >
                            취소
                        </button>
                    </div>
                </ExpandEditorModal>
            </div>

            <div className='card'>
                <h2 className='text-xl font-semibold text-center mb-4'>옵션 (선택)</h2>
                <p className='text-sm text-gray-600 text-center mb-4'>필요 시에만 선택하세요.</p>
                <div className='space-y-2'>
                    <div className='flex items-center space-x-2 pl-0 md:pl-10 pb-2'>
                        <input
                            id='rateshow'
                            type='checkbox'
                            ref={showCorrectRateRef}
                            className='w-4 h-4'
                            onChange={showCorrectRateChange}
                            defaultChecked
                        />
                        <label htmlFor='rateshow' className='text-gray-700'>
                            정답률 표시 함
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartMenu
export { useSettings, defaultSettings }
