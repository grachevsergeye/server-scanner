import {
    findingRepository,
} from "../scanner/scanner.dependencies.js";

export class FindingsService {
    constructor(
        private readonly repository =
            findingRepository
    ) {}

    async getByJobId(
        jobId: string
    ) {
        return this.repository.findByJobId(
            jobId
        );
    }
}

export const findingsService =
    new FindingsService();