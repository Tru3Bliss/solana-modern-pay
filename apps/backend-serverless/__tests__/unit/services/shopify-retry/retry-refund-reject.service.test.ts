import {
    ShopifyMutationRefundReject,
    ShopifyMutationRefundResolve,
} from '../../../../src/models/shopify-mutation-retry.model.js';
import { prismaMock } from '../../../../prisma-singleton.js';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
    createMockMerchant,
    createMockPaymentRecord,
    createMockRefundRecord,
    createMockSuccessPaymentSessionResolveResponse,
    createMockSuccessRefundSessionRejectResponse,
    createMockSuccessRefundSessionResolveResponse,
} from '../../../../src/utilities/testing-helper/create-mock.utility.js';
import { retryRefundReject } from '../../../../src/services/shopify-retry/retry-refund-reject.service.js';

describe('Shopify Retry Refund Reject Testing Suite', () => {
    it('should execute successfully', async () => {
        // Mock refund session reject
        let mock = new MockAdapter(axios);
        const mockRefundSessionRejectResponse = createMockSuccessRefundSessionRejectResponse();
        mock.onPost().reply(200, mockRefundSessionRejectResponse);

        // Mock database calls
        const mockMerchant = createMockMerchant({ accessToken: 'example-access-token' });
        prismaMock.merchant.findUnique.mockResolvedValue(mockMerchant);
        const mockRefundRecord = createMockRefundRecord();
        prismaMock.refundRecord.findFirst.mockResolvedValue(mockRefundRecord);
        prismaMock.refundRecord.update.mockResolvedValue(mockRefundRecord);

        // Set up retry resolve info
        const refundResolveInfo: ShopifyMutationRefundReject = {
            refundId: 'example-payment-id',
            code: 'RETURNED',
            reason: 'Customer didnt want it.',
        };

        // Test
        await expect(retryRefundReject(refundResolveInfo, prismaMock, axios)).resolves.not.toThrow();
    });
});
