import { ResourceType } from '@prisma/client';
export declare class CreateCurriculumResourceDto {
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
    order?: number;
    isActive?: boolean;
}
