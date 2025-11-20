import { connectToDatabase } from '../lib/mongodb';
import Employee from '../models/Employee';
import Project from '../models/Project';
import TrainingTask from '../models/TrainingTask';
import UpdateLog from '../models/UpdateLog';
import Notification from '../models/Notification';
import Candidate from '../models/Candidate';
import AuditLog from '../models/AuditLog';
import AssessmentTemplate from '../models/AssessmentTemplate';
import DailyAssessment from '../models/DailyAssessment';
import Client from '../models/Client';
import ProjectRequest from '../models/ProjectRequest';
import {
  mockEmployeeData,
  mockProjectData,
  mockTrainingTasks,
  mockUpdates,
  mockNotifications,
  mockCandidates,
  mockAuditLogs,
  mockAssessmentTemplates,
  mockDailyAssessments,
  mockClients,
  mockProjectRequests,
} from './data';

export const seedDatabase = async () => {
  await connectToDatabase();

  const employeeCount = await Employee.countDocuments();
  if (!employeeCount) {
    await Employee.insertMany(
      mockEmployeeData.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const clientCount = await Client.countDocuments();
  if (!clientCount) {
    await Client.insertMany(
      mockClients.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const projectCount = await Project.countDocuments();
  if (!projectCount) {
    await Project.insertMany(
      mockProjectData.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const requestCount = await ProjectRequest.countDocuments();
  if (!requestCount) {
    await ProjectRequest.insertMany(
      mockProjectRequests.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const trainingCount = await TrainingTask.countDocuments();
  if (!trainingCount) {
    await TrainingTask.insertMany(
      mockTrainingTasks.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const updatesCount = await UpdateLog.countDocuments();
  if (!updatesCount) {
    await UpdateLog.insertMany(
      mockUpdates.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const notificationCount = await Notification.countDocuments();
  if (!notificationCount) {
    await Notification.insertMany(
      mockNotifications.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const candidateCount = await Candidate.countDocuments();
  if (!candidateCount) {
    await Candidate.insertMany(
      mockCandidates.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const auditCount = await AuditLog.countDocuments();
  if (!auditCount) {
    await AuditLog.insertMany(
      mockAuditLogs.map(({ id, ...rest }) => ({
        _id: id,
        ...rest,
      })),
    );
  }

  const templateCount = await AssessmentTemplate.countDocuments();
  if (!templateCount) {
    await AssessmentTemplate.insertMany(
      mockAssessmentTemplates.map(({ id, checklist, ...rest }) => ({
        _id: id,
        ...rest,
        checklist: checklist.map((item) => ({
          _id: item.id,
          text: item.text,
          weight: item.weight,
        })),
      })),
    );
  }

  const assessmentsCount = await DailyAssessment.countDocuments();
  if (!assessmentsCount) {
    await DailyAssessment.insertMany(
      mockDailyAssessments.map(({ responses, adminCorrections, ...rest }) => ({
        ...rest,
        responses: responses.map((response) => ({
          checklistItemId: response.checklistItemId,
          answer: response.answer,
        })),
        adminCorrections: adminCorrections?.map((correction) => ({
          checklistItemId: correction.checklistItemId,
          correctedAnswer: correction.correctedAnswer,
        })),
      })),
    );
  }
};

