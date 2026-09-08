export enum SupportLevel {
  PLATINUM = 'platinum',
  GOLD = 'gold',
  STANDARD = 'standard',
}

export enum MemberRole {
  OPS_LEAD = 'OPS Lead',
  OPS_SPECIALIST = 'OPS Specialist',
  LEAD_ENGINEER = 'Lead Engineer',
  SYSTEMS_ENGINEER = 'Systems Engineer',
  DATA_ENGINEER = 'Data Engineer',
  QA_SPECIALIST = 'QA Specialist',
  ARCHITECT = 'Architect',
  ANALYST = 'Analyst',
}

export enum AvatarColor {
  AV1 = 'av1',
  AV2 = 'av2',
  AV3 = 'av3',
  AV4 = 'av4',
  AV5 = 'av5',
  AV6 = 'av6',
  AV7 = 'av7',
  AV8 = 'av8',
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export enum PortalEnvironment {
  PROD = 'PROD',
  QA = 'QA',
  DEV = 'DEV',
}

export enum CalendarEventType {
  MAINTENANCE = 'Maintenance',
  ANNOUNCEMENT = 'Announcement',
  MEETING = 'Meeting',
  RELEASE = 'Release',
  REVIEW = 'Review',
  OTHER = 'Other',
}

export enum KbCategory {
  OPERATIONS = 'Operations',
  TROUBLESHOOTING = 'Troubleshooting',
  RUNBOOKS = 'Runbooks',
  ARCHITECTURE = 'Architecture',
  SECURITY = 'Security',
  GENERAL = 'General',
}

export enum MonitoringPanelType {
  GRAFANA = 'grafana',
  KIBANA = 'kibana',
  IFRAME = 'iframe',
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum ChatMessageRole {
  USER = 'user',
  BOT = 'bot',
}
