import { ProjectStatus } from '@prisma/client';
export declare class CreateProjectDto {
    title: string;
    description: string;
    courseId?: string;
    projectLink?: string;
    status?: ProjectStatus;
}
