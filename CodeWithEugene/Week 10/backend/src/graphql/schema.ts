import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    COMPLETED
    ARCHIVED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    assigneeId: String
    assigneeName: String
    createdAt: String!
    updatedAt: String!
    dueDate: String
    tags: [String!]
  }

  input CreateTaskInput {
    title: String!
    description: String
    priority: TaskPriority
    assigneeId: String
    assigneeName: String
    dueDate: String
    tags: [String!]
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    assigneeId: String
    assigneeName: String
    dueDate: String
    tags: [String!]
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByStatus(status: TaskStatus!): [Task!]!
    tasksByAssignee(assigneeId: ID!): [Task!]!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean!
  }

  type Subscription {
    taskUpdated: Task!
    taskCreated: Task!
    taskDeleted: Task!
  }
`;

