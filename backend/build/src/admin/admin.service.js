"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createStudent(dto) {
        const studentId = dto.studentId.trim();
        const email = dto.email.trim();
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { studentId },
                    { email }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.studentId === studentId) {
                throw new common_1.ConflictException('Student ID already exists');
            }
            if (existingUser.email === email) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = await this.prisma.$transaction(async (tx) => {
            if (dto.courseIds && dto.courseIds.length > 0) {
                const courses = await tx.course.findMany({
                    where: {
                        id: { in: dto.courseIds },
                        isActive: true
                    },
                });
                if (courses.length !== dto.courseIds.length) {
                    throw new common_1.BadRequestException('One or more invalid or inactive course IDs');
                }
            }
            const newUser = await tx.user.create({
                data: {
                    studentId,
                    name: dto.name,
                    email,
                    passwordHash,
                    role: 'STUDENT',
                    isActive: true,
                },
            });
            if (dto.courseIds && dto.courseIds.length > 0) {
                const studentCoursesData = dto.courseIds.map((courseId) => ({
                    studentId: newUser.id,
                    courseId,
                }));
                await tx.studentCourse.createMany({
                    data: studentCoursesData,
                });
            }
            return newUser;
        });
        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }
    async getStudents() {
        const students = await this.prisma.user.findMany({
            where: {
                role: 'STUDENT'
            },
            include: {
                courses: {
                    include: {
                        course: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return students.map(student => {
            const { passwordHash: _, ...safeStudent } = student;
            return safeStudent;
        });
    }
    async createCourse(dto) {
        const existingCourse = await this.prisma.course.findUnique({
            where: { key: dto.key },
        });
        if (existingCourse) {
            throw new common_1.ConflictException('Course key already exists');
        }
        return this.prisma.course.create({
            data: dto,
        });
    }
    async getCourses() {
        return this.prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async removeCourse(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return this.prisma.course.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async restoreCourse(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return this.prisma.course.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async getDashboardStats() {
        const [totalStudents, activeStudents, activeCourses, activeProjects, inProgressAssignments, pendingSubmissions, completedInternships, pendingApplications, activeBatches, scheduledInterviews, issuedCertificates] = await Promise.all([
            this.prisma.user.count({ where: { role: 'STUDENT' } }),
            this.prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
            this.prisma.course.count({ where: { isActive: true } }),
            this.prisma.project.count({ where: { status: 'ACTIVE' } }),
            this.prisma.studentProject.count({ where: { status: 'IN_PROGRESS' } }),
            this.prisma.submission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
            this.prisma.studentProject.count({ where: { status: 'COMPLETED' } }),
            this.prisma.application.count({ where: { status: 'PENDING' } }),
            this.prisma.batch.count({ where: { status: 'ACTIVE' } }),
            this.prisma.interview.count({ where: { status: 'SCHEDULED' } }),
            this.prisma.certificate.count({ where: { status: 'ACTIVE' } }),
        ]);
        return {
            totalStudents,
            activeStudents,
            activeCourses,
            activeProjects,
            inProgressAssignments,
            pendingSubmissions,
            completedInternships,
            pendingApplications,
            activeBatches,
            scheduledInterviews,
            issuedCertificates,
        };
    }
    async assignCourseToStudent(studentId, courseId) {
        const student = await this.prisma.user.findUnique({ where: { id: studentId } });
        if (!student || student.role !== 'STUDENT')
            throw new common_1.NotFoundException('Student not found');
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!course || !course.isActive)
            throw new common_1.BadRequestException('Course not found or inactive');
        const existing = await this.prisma.studentCourse.findUnique({
            where: { studentId_courseId: { studentId, courseId } },
        });
        if (existing)
            throw new common_1.ConflictException('Student already enrolled in this course');
        return this.prisma.studentCourse.create({ data: { studentId, courseId } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map