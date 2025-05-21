import { persisted } from 'svelte-persisted-store';
import { writable, get } from 'svelte/store';
import { m } from "$lib/paraglide/messages.js";
import { type Locale, getLocale as getCurrentLocale } from "$lib/paraglide/runtime";

// --- Interfaces ---
export interface AnswerOption {
    id: string;
    text: string;
}

export interface SurveyAppearance {
    appBackgroundColor: string;
    pillButtonColor: string;
}

export interface Survey {
    id: string;
    name: string;
    question: string;
    answers: AnswerOption[];
    results: Record<string, number>;
    appearance: SurveyAppearance;
}

const generateDefaultsForLanguage = (langTag: Locale): { question: string, answers: AnswerOption[] } => {
    const question = m.default_survey_question({}, { locale: langTag });
    const answers: AnswerOption[] = [
        { id: 'default_answer_option_1', text: m.default_answer_option_1({}, { locale: langTag }) },
        { id: 'default_answer_option_2', text: m.default_answer_option_2({}, { locale: langTag }) },
    ];
    return { question, answers };
};

const createDefaultSurvey = (name: string): Survey => {
    const defaults = generateDefaultsForLanguage(getCurrentLocale());
    return {
        id: crypto.randomUUID(),
        name: name,
        question: defaults.question,
        answers: defaults.answers,
        results: {},
        appearance: {
            appBackgroundColor: '#282c34',
            pillButtonColor: '#007bff',
        }
    };
};

const initialSurveyName = m.default_survey_name ? m.default_survey_name() : "Default Survey";
export const surveys = persisted<Survey[]>('surveyApp_surveys', [createDefaultSurvey(initialSurveyName)]);

export const activeSurveyId = persisted<string | null>('surveyApp_activeSurveyId', get(surveys)[0]?.id || null);

const getActiveSurvey = (): Survey | undefined => {
    const currentSurveys = get(surveys);
    const currentActiveId = get(activeSurveyId);
    return currentSurveys.find((s: Survey) => s.id === currentActiveId);
};

export const surveyQuestion = writable<string>('');
export const surveyAnswers = writable<AnswerOption[]>([]);
export const surveyResults = writable<Record<string, number>>({});
export const appBackgroundColor = writable<string>('#282c34');
export const pillButtonColor = writable<string>('#007bff');

const updateDerivedStores = () => {
    const active = getActiveSurvey();
    if (active) {
        surveyQuestion.set(active.question);
        surveyAnswers.set(active.answers);
        surveyResults.set(active.results);
        appBackgroundColor.set(active.appearance.appBackgroundColor);
        pillButtonColor.set(active.appearance.pillButtonColor);
    } else {
        const noActiveName = m.no_active_survey_name ? m.no_active_survey_name() : "No Active Survey";
        const defaultSurvey = createDefaultSurvey(noActiveName);
        surveyQuestion.set(defaultSurvey.question);
        surveyAnswers.set(defaultSurvey.answers);
        surveyResults.set({});
        appBackgroundColor.set(defaultSurvey.appearance.appBackgroundColor);
        pillButtonColor.set(defaultSurvey.appearance.pillButtonColor);
    }
};

surveys.subscribe(updateDerivedStores);
activeSurveyId.subscribe(updateDerivedStores);

setTimeout(updateDerivedStores, 0); // Ensure initialization after persisted stores are ready

export function setActiveSurvey(surveyId: string) {
    activeSurveyId.set(surveyId);
}

export function createNewSurvey(name: string): string {
    const newSurvey = createDefaultSurvey(name);
    surveys.update(currentSurveys => [...currentSurveys, newSurvey]);
    setActiveSurvey(newSurvey.id);
    return newSurvey.id;
}

export function deleteSurvey(surveyId: string) {
    surveys.update(currentSurveys => currentSurveys.filter(s => s.id !== surveyId));
    if (get(activeSurveyId) === surveyId) {
        const remainingSurveys = get(surveys);
        activeSurveyId.set(remainingSurveys.length > 0 ? remainingSurveys[0].id : null);
    }
}

export function updateActiveSurveyDetails(details: Partial<Omit<Survey, 'id' | 'results' | 'appearance'>> & { appearance?: Partial<SurveyAppearance> }) {
    const currentActiveId = get(activeSurveyId);
    if (!currentActiveId) return;

    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === currentActiveId) {
                const updatedSurvey = { ...survey };
                if (details.question !== undefined) updatedSurvey.question = details.question;
                if (details.answers !== undefined) updatedSurvey.answers = details.answers;
                if (details.name !== undefined) updatedSurvey.name = details.name;
                if (details.appearance) {
                    updatedSurvey.appearance = { ...survey.appearance, ...details.appearance };
                }
                return updatedSurvey;
            }
            return survey;
        })
    );
}

export function recordAnswer(answerId: string) {
    const currentActiveId = get(activeSurveyId);
    if (!currentActiveId) return;

    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === currentActiveId) {
                const newResults = { ...survey.results };
                newResults[answerId] = (newResults[answerId] || 0) + 1;
                return { ...survey, results: newResults };
            }
            return survey;
        })
    );
}

export function resetActiveSurveyResults() {
    const currentActiveId = get(activeSurveyId);
    if (!currentActiveId) return;

    surveys.update(currentSurveys =>
        currentSurveys.map(survey => {
            if (survey.id === currentActiveId) {
                return { ...survey, results: {} };
            }
            return survey;
        })
    );
}