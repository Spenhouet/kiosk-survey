import { persisted } from 'svelte-persisted-store';
import { m } from "$lib/paraglide/messages.js";
import { type Locale, getLocale as getCurrentLocale } from "$lib/paraglide/runtime";

// --- Interfaces ---
export interface AnswerOption {
    id: string;
    text: string;
}

export interface SurveyAppearance {
    backgroundColor: string;
    buttonColor: string;
}

export interface Survey {
    id: string;
    question: string;
    answers: AnswerOption[];
    results: Record<string, number>;
    appearance: SurveyAppearance;
}

const generateDefaultsForLanguage = (langTag: Locale): { question: string, answers: AnswerOption[] } => {
    const question = m.default_survey_question({}, { locale: langTag });
    const answers: AnswerOption[] = [
        { id: crypto.randomUUID(), text: m.default_answer_option_1({}, { locale: langTag }) },
        { id: crypto.randomUUID(), text: m.default_answer_option_2({}, { locale: langTag }) },
    ];
    return { question, answers };
};

const createDefaultSurvey = (): Survey => {
    const defaults = generateDefaultsForLanguage(getCurrentLocale());
    return {
        id: crypto.randomUUID(),
        question: defaults.question,
        answers: defaults.answers,
        results: {},
        appearance: {
            backgroundColor: '#eed7f9',
            buttonColor: '#767cf9',
        }
    };
};

export const surveys = persisted<Survey[]>('surveys', []);

export function createNewSurvey(): string {
    const newSurvey = createDefaultSurvey();
    surveys.update(currentSurveys => [...currentSurveys, newSurvey]);
    return newSurvey.id;
}

export function deleteSurvey(surveyId: string) {
    surveys.update(currentSurveys => currentSurveys.filter(s => s.id !== surveyId));
}

export function updateSurveyDetails(surveyId: string, details: Partial<Omit<Survey, 'id' | 'results' | 'appearance'>> & { appearance?: Partial<SurveyAppearance> }) {
    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === surveyId) {
                const updatedSurvey = { ...survey };
                if (details.question !== undefined) updatedSurvey.question = details.question;
                if (details.answers !== undefined) updatedSurvey.answers = details.answers;
                if (details.appearance) {
                    updatedSurvey.appearance = { ...survey.appearance, ...details.appearance };
                }
                return updatedSurvey;
            }
            return survey;
        })
    );
}

export function recordAnswer(surveyId: string, answerId: string) {
    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === surveyId) {
                const newResults = { ...survey.results };
                newResults[answerId] = (newResults[answerId] || 0) + 1;
                return { ...survey, results: newResults };
            }
            return survey;
        })
    );
}

export function resetSurveyResults(surveyId: string) {
    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === surveyId) {
                return { ...survey, results: {} };
            }
            return survey;
        })
    );
}