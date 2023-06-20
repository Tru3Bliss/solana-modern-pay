import pkg from 'aws-sdk';
import { retry } from '../../utilities/shopify-retry/shopify-retry.utility.js';
import { MissingEnvError } from '../../errors/missing-env.error.js';
import * as Sentry from '@sentry/serverless';

const { StepFunctions } = pkg;

/**
 *
 * @param stepFunctions - StepFunctions object to be used
 * @returns nothing
 */
// Dependency injection is used here for easier testing
export const startExecutionOfSafteySweep = async (
    key: string,
    stepFunctions: pkg.StepFunctions = new StepFunctions()
) => {
    const safteyMachineArn = process.env.SAFTEY_ARN;

    if (safteyMachineArn == null) {
        throw new MissingEnvError('saftey arn');
    }

    const maxNumberOfExecutionAttempts = 3;

    const attempts = await retry(
        () =>
            stepFunctions
                .startExecution({
                    stateMachineArn: safteyMachineArn,
                    input: JSON.stringify({ key: key }),
                })
                .promise(),
        maxNumberOfExecutionAttempts
    );

    // TODO: Get error out of retry
    if (attempts === maxNumberOfExecutionAttempts) {
        const error = new Error('Could not execute the shopify mutation step function');
        console.log(error);
        Sentry.captureException(error);
        throw error;
    }
};
