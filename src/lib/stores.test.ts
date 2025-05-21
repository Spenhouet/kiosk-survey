import { describe, it, expect, beforeEach, vi } from 'vitest';
import { surveyQuestion, surveyAnswers, surveyResults, recordAnswer, resetResults, resetSurveyToDefaults, type AnswerOption } from './stores';
import { get } from 'svelte/store'; // Helper to get store value

// Mocks are now in vitest-setup.ts

describe('Survey Stores', () => {
    beforeEach(() => {
        // localStorage is cleared and stores re-initialized by svelte-persisted-store
        // or by our setup file. We might need to explicitly reset stores if their
        // initial state depends on something other than localStorage at module load.
        // For svelte-persisted-store, clearing localStorage and then re-accessing the store
        // should make it fall back to its default. Let's ensure defaults are re-applied for test isolation.
        resetSurveyToDefaults();
    });

    it('should initialize with default question and answers', () => {
        expect(get(surveyQuestion)).toBe("What is your favorite Svelte feature?");
        const answers = get(surveyAnswers);
        expect(answers.length).toBe(4);
        expect(answers[0].text).toBe("Reactivity");
    });

    it('recordAnswer should increment result count for a given answer ID', () => {
        const firstAnswerId = get(surveyAnswers)[0].id;
        recordAnswer(firstAnswerId);
        expect(get(surveyResults)[firstAnswerId]).toBe(1);
        recordAnswer(firstAnswerId);
        expect(get(surveyResults)[firstAnswerId]).toBe(2);
    });

    it('recordAnswer should initialize count if answer ID not present', () => {
        const newId = "new-answer-id";
        recordAnswer(newId);
        expect(get(surveyResults)[newId]).toBe(1);
    });

    it('resetResults should clear all survey results', () => {
        const firstAnswerId = get(surveyAnswers)[0].id;
        recordAnswer(firstAnswerId);
        expect(Object.keys(get(surveyResults)).length).toBeGreaterThan(0);
        resetResults();
        expect(get(surveyResults)).toEqual({});
    });

    it('resetSurveyToDefaults should reset question, answers, and results', () => {
        // Modify stores
        surveyQuestion.set("A new question");
        surveyAnswers.update(ans => ans.slice(0, 1));
        recordAnswer(get(surveyAnswers)[0].id);

        expect(get(surveyQuestion)).toBe("A new question");
        expect(get(surveyAnswers).length).toBe(1);
        expect(Object.keys(get(surveyResults)).length).toBe(1);

        resetSurveyToDefaults();

        expect(get(surveyQuestion)).toBe("What is your favorite Svelte feature?");
        expect(get(surveyAnswers).length).toBe(4);
        expect(get(surveyResults)).toEqual({});
    });
});