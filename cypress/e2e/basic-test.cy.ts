describe('Basic Test Page', () => {
    it('updates the URL with state changes', () => {
        cy.visit('/');
        cy.get('a#basic-test').click();

        cy.url().should(
            'include',
            '/basic-test?str=test&num=1&bool=true&obj=%7B%22a%22%3A1%2C%22b%22%3A2%7D&date=1999-01-01&strArr=a&strArr=b&numArr=1&numArr=2'
        );

        cy.go('back');
        cy.url().should('not.include', '/basic-test');

        const tests = [
            {
                btnSelector: '#btn-set-str-to-test2',
                stateSelector: '#str',
                expectedState: 'test2',
                paramName: 'str',
                expectedParamValue: 'test2'
            },
            {
                btnSelector: '#btn-increment-num',
                stateSelector: '#num',
                expectedState: '2',
                paramName: 'num',
                expectedParamValue: '2'
            },
            {
                btnSelector: '#btn-toggle-bool',
                stateSelector: '#bool',
                expectedState: 'false',
                paramName: 'bool',
                expectedParamValue: 'false'
            },
            {
                btnSelector: '#btn-set-obj-to-z-0',
                stateSelector: '#obj',
                expectedState: '{"z":0}',
                paramName: 'obj',
                expectedParamValue: '%7B%22z%22%3A0%7D'
            },
            {
                btnSelector: '#btn-set-date-to-2000-12-31',
                stateSelector: '#date',
                expectedState: '2000-12-31T00:00:00.000Z',
                paramName: 'date',
                expectedParamValue: '2000-12-31'
            },
            {
                btnSelector: '#btn-set-str-arr-to-c-d',
                stateSelector: '#str-arr',
                expectedState: '["c","d"]',
                paramName: 'strArr',
                expectedParamValue: 'c&strArr=d'
            },
            {
                btnSelector: '#btn-set-num-arr-to-3-4',
                stateSelector: '#num-arr',
                expectedState: '[3,4]',
                paramName: 'numArr',
                expectedParamValue: '3&numArr=4'
            }
        ];

        tests.forEach(
            ({ btnSelector, stateSelector, expectedState, paramName, expectedParamValue }) => {
                cy.visit('/basic-test');
                cy.get('#is-ready-for-test').should('exist', {
                    timeout: 10000
                });
                cy.get(btnSelector).should('exist').click();
                cy.url().should('include', `${paramName}=${expectedParamValue}`);
                cy.get(stateSelector).should('contain', expectedState);

                cy.go('back');
                cy.get(stateSelector).should('not.contain', expectedState);
            }
        );
    });
});
