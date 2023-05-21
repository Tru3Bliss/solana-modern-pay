import { parseAndValidatePaymentAppConfigureResponse } from '../../../../src/models/shopify-graphql-responses/payment-app-configure-response.model';

describe('unit testing payment app configure model', () => {
    it('valid payment app configure response', () => {
        const validPaymentAppConfigureResponse = {
            data: {
                paymentsAppConfigure: {
                    paymentsAppConfiguration: {
                        externalHandle: 'mock-internal-id',
                        ready: true,
                    },
                    userErrors: [],
                },
            },
            extensions: {},
        };

        expect(() => {
            parseAndValidatePaymentAppConfigureResponse(validPaymentAppConfigureResponse);
        }).not.toThrow();
    });

    it('invalid payment app configure response, missing externalHandleId', () => {
        const invalidPaymentAppConfigureResponse = {
            data: {
                paymentsAppConfigure: {
                    paymentsAppConfiguration: {
                        ready: true,
                    },
                    userErrors: [],
                },
            },
            extensions: {},
        };

        expect(() => {
            parseAndValidatePaymentAppConfigureResponse(invalidPaymentAppConfigureResponse);
        }).toThrow();
    });
});
