CREATE TABLE `prolinePushSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`endpoint` varchar(2048) NOT NULL,
	`p256dh` varchar(255) NOT NULL,
	`auth` varchar(255) NOT NULL,
	`userAgent` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prolinePushSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `prolinePushSubscriptions_endpoint_unique` UNIQUE(`endpoint`)
);
