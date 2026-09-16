import { CurriculumPhaseType } from '@prisma/client';
export declare class CreateCurriculumPhaseDto {
    phaseNumber: number;
    title: string;
    description: string;
    objectives?: string;
    durationDays?: number;
    phaseType?: CurriculumPhaseType;
    googleSheetUrl?: string;
    sheetVisibleFrom?: string;
    requiresGitHub?: boolean;
    requiresLiveDemo?: boolean;
    projectId?: string;
    isPublished?: boolean;
}
