CREATE TABLE `prolineWorkspaceSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`config` text NOT NULL,
	`updatedByUserId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prolineWorkspaceSettings_id` PRIMARY KEY(`id`)
);
