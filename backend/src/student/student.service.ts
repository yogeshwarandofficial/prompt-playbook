import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getMyCourses(userId: string) {
    const studentCourses = await this.prisma.studentCourse.findMany({
      where: {
        studentId: userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return studentCourses.map((sc) => sc.course);
  }

  async getStudentNotifications(userId: string) {
    try {
      const formatTimeAgo = (date: Date | string | null | undefined): string => {
        if (!date) return 'Recently';
        const now = Date.now();
        const past = new Date(date).getTime();
        const diffMs = Math.max(0, now - past);
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'Just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        const diffWeeks = Math.floor(diffDays / 7);
        return `${diffWeeks}w ago`;
      };

      const notifications: Array<{
        id: string;
        title: string;
        desc: string;
        time: string;
        timestamp: string;
        type: 'task' | 'team' | 'submission' | 'certificate' | 'general';
        linkView: 'dashboard' | 'team' | 'submissions' | 'certificate' | 'projects';
        read: boolean;
      }> = [];

      // 1. Explicit DB Notifications for this student
      try {
        const dbNotifs = await this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });
        for (const n of dbNotifs) {
          notifications.push({
            id: n.id,
            title: n.title,
            desc: n.body,
            time: formatTimeAgo(n.createdAt),
            timestamp: n.createdAt.toISOString(),
            type: 'general',
            linkView: 'dashboard',
            read: n.isRead,
          });
        }
      } catch (e) {
        // Safe catch if table is empty or missing
      }

      // 2. Real Assigned Team Tasks
      try {
        const teamTasks = await this.prisma.teamTask.findMany({
          where: {
            teamMember: {
              studentId: userId,
            },
          },
          include: {
            teamMember: {
              include: {
                team: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });

        for (const task of teamTasks) {
          const teamName = task.teamMember?.team?.name || 'Workspace';
          if (task.status === 'COMPLETED') {
            notifications.push({
              id: `task-completed-${task.id}`,
              title: `Task Completed: ${task.title}`,
              desc: `Your milestone "${task.title}" in ${teamName} has been marked as completed.`,
              time: formatTimeAgo(task.submittedAt || task.updatedAt),
              timestamp: (task.submittedAt || task.updatedAt).toISOString(),
              type: 'task',
              linkView: 'team',
              read: true,
            });
          } else if (task.status === 'IN_PROGRESS') {
            notifications.push({
              id: `task-progress-${task.id}`,
              title: `Task In Progress: ${task.title}`,
              desc: `You started "${task.title}" in ${teamName}. Submit deliverable when ready.`,
              time: formatTimeAgo(task.updatedAt),
              timestamp: task.updatedAt.toISOString(),
              type: 'task',
              linkView: 'team',
              read: false,
            });
          } else if (task.status === 'PENDING') {
            notifications.push({
              id: `task-assigned-${task.id}`,
              title: `New Task Assigned: ${task.title}`,
              desc: `New sprint task assigned to you in ${teamName}.${task.dueDate ? ` Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}`,
              time: formatTimeAgo(task.createdAt),
              timestamp: task.createdAt.toISOString(),
              type: 'task',
              linkView: 'team',
              read: false,
            });
          }
        }
      } catch (e) {
        console.warn('Error fetching student team tasks for notifications:', e);
      }

      // 3. Real Project Submissions & Reviews
      try {
        const subs = await this.prisma.submission.findMany({
          where: {
            studentProjectPhase: {
              studentProject: {
                studentId: userId,
              },
            },
          },
          include: {
            reviews: {
              orderBy: { reviewedAt: 'desc' },
              take: 1,
            },
            studentProjectPhase: {
              include: {
                phase: { select: { title: true } },
                studentProject: {
                  include: {
                    project: { select: { title: true } },
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
          take: 5,
        });

        for (const sub of subs) {
          const phaseTitle = sub.studentProjectPhase?.phase?.title || 'Deliverable';
          const projectTitle = sub.studentProjectPhase?.studentProject?.project?.title || 'Project';
          if (sub.reviews && sub.reviews.length > 0) {
            const rev = sub.reviews[0];
            const isApproved = rev.decision === 'APPROVED';
            notifications.push({
              id: `rev-${rev.id}`,
              title: isApproved ? `Review Approved: ${phaseTitle}` : `Review Feedback: ${phaseTitle}`,
              desc: `${projectTitle} — ${rev.feedback || rev.decision}`,
              time: formatTimeAgo(rev.reviewedAt),
              timestamp: rev.reviewedAt.toISOString(),
              type: 'submission',
              linkView: 'submissions',
              read: false,
            });
          } else {
            notifications.push({
              id: `sub-${sub.id}`,
              title: `Submitted: ${phaseTitle}`,
              desc: `Your deliverable for "${projectTitle}" is under review.`,
              time: formatTimeAgo(sub.submittedAt),
              timestamp: sub.submittedAt.toISOString(),
              type: 'submission',
              linkView: 'submissions',
              read: true,
            });
          }
        }
      } catch (e) {
        console.warn('Error fetching student submissions for notifications:', e);
      }

      // 4. Real Team Membership
      try {
        const memberships = await this.prisma.teamMember.findMany({
          where: { studentId: userId },
          include: { team: { select: { id: true, name: true, createdAt: true } } },
          orderBy: { joinedAt: 'desc' },
          take: 3,
        });

        for (const m of memberships) {
          if (m.team) {
            notifications.push({
              id: `team-member-${m.id}`,
              title: `Joined Team: ${m.team.name}`,
              desc: `You were assigned to team workspace "${m.team.name}".`,
              time: formatTimeAgo(m.joinedAt),
              timestamp: m.joinedAt.toISOString(),
              type: 'team',
              linkView: 'team',
              read: false,
            });
          }
        }
      } catch (e) {
        console.warn('Error fetching team memberships for notifications:', e);
      }

      // 5. Real Certificates
      try {
        const certs = await this.prisma.certificate.findMany({
          where: { studentId: userId },
          orderBy: { issuedAt: 'desc' },
          take: 3,
        });

        for (const cert of certs) {
          notifications.push({
            id: `cert-${cert.id}`,
            title: `Certificate Issued`,
            desc: `Certificate #${cert.certificateNo} for ${cert.domain} has been awarded to you.`,
            time: formatTimeAgo(cert.issuedAt),
            timestamp: cert.issuedAt.toISOString(),
            type: 'certificate',
            linkView: 'certificate',
            read: false,
          });
        }
      } catch (e) {
        console.warn('Error fetching certificates for notifications:', e);
      }

      // Sort newest first
      notifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const unreadCount = notifications.filter((n) => !n.read).length;

      return {
        notifications,
        unreadCount,
      };
    } catch (err) {
      console.error('getStudentNotifications error:', err);
      return {
        notifications: [],
        unreadCount: 0,
      };
    }
  }

  async markAllStudentNotificationsRead(userId: string) {
    try {
      await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return { success: true };
    } catch (err) {
      return { success: true };
    }
  }
}

