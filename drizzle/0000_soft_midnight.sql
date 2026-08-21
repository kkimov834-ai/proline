CREATE TABLE `prolineNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`fromColumn` enum('orders','production','polishing','paint','warehouse') NOT NULL,
	`toColumn` enum('orders','production','polishing','paint','warehouse') NOT NULL,
	`requesterUserId` int NOT NULL,
	`targetRole` varchar(32) NOT NULL,
	`status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	CONSTRAINT `prolineNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prolineOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`columnId` enum('orders','production','polishing','paint','warehouse') NOT NULL DEFAULT 'orders',
	`pendingTo` enum('orders','production','polishing','paint','warehouse'),
	`rejectedReason` text,
	`stageEnteredAt` timestamp NOT NULL DEFAULT (now()),
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prolineOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `prolineOrders_publicId_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`prolineRole` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
