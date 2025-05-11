import koreaQuiz from './data/korea.json'

interface Quiz {
    name: string
    description: string
    questions: Array<Question>
}

interface Question {
    question: string
    options: Array<string>
    correct: string
    explanation: string
    hint?: string
}

const quiz: Quiz = koreaQuiz as Quiz

export type { Quiz, Question }
export { quiz }
