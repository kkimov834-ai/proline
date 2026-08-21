CREATE TABLE `prolineAuditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int,
	`actorUserId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`fromColumn` enum('orders','production','polishing','paint','warehouse'),
	`toColumn` enum('orders','production','polishing','paint','warehouse'),
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prolineAuditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `notificationSound` boolean DEFAULT true NOT NULL;