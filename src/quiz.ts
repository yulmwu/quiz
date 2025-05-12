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
    difficulty?: 'easy' | 'normal' | 'hard'
}

// https://raw.githubusercontent.com/yulmwu/quiz_data/refs/heads/main/korea.json

export type { Quiz, Question }
