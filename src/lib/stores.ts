import { persisted } from 'svelte-persisted-store';
import { m } from "$lib/paraglide/messages.js";
import { type Locale, getLocale } from "$lib/paraglide/runtime";

// --- Interfaces ---
export interface AnswerOption {
    id: string;
    text: string;
}

// --- Function to generate default survey content in a specific language ---
const generateDefaultsForLanguage = (langTag: Locale): { question: string, answers: AnswerOption[] } => {
    const question = m.default_survey_question({}, { locale: langTag }); // Pass options object even if empty

    const answers: AnswerOption[] = [
        { id: 'default_answer_option_1', text: m.default_answer_option_1({}, { locale: langTag }) },
        { id: 'default_answer_option_2', text: m.default_answer_option_2({}, { locale: langTag }) },
    ];
    return { question, answers };
};

const initialEnglishDefaults = generateDefaultsForLanguage(getLocale());
// --- Persistent Stores ---
export const surveyQuestion = persisted<string>('surveyApp_question', initialEnglishDefaults.question);
export const surveyAnswers = persisted<AnswerOption[]>('surveyApp_answers', initialEnglishDefaults.answers);

// Results: Record where key is answer.id and value is count
export const surveyResults = persisted<Record<string, number>>('surveyApp_results', {});

export const appBackgroundColor = persisted<string>('surveyApp_backgroundColor', '#282c34'); // A darker default
export const pillButtonColor = persisted<string>('surveyApp_pillButtonColor', '#007bff'); // Default pill button color

// --- Helper functions for stores ---
export function recordAnswer(answerId: string) {
    surveyResults.update(results => {
        results[answerId] = (results[answerId] || 0) + 1;
        return results;
    });
}

export function resetResults() {
    surveyResults.set({});
}

export function resetSurveyToDefaults() {
    const defaultsInCurrentLanguage = generateDefaultsForLanguage(getLocale());

    surveyQuestion.set(defaultsInCurrentLanguage.question);
    surveyAnswers.set(defaultsInCurrentLanguage.answers);
    resetResults(); // Also reset results when resetting survey
}